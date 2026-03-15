import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../db';
import * as twilioService from '../services/twilioService';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

export const signup = async (req: Request, res: Response): Promise<void> => {
  try {
    let { phone_number } = req.body;

    if (!phone_number) {
      res.status(400).json({ message: 'Phone number is required' });
      return;
    }

    // Format phone number: remove spaces and dashes
    phone_number = phone_number.replace(/[\s-]/g, '');
    
    // Automatically add +91 prefix if user enters 10 digits
    if (/^\d{10}$/.test(phone_number)) {
      phone_number = `+91${phone_number}`;
    }

    // Comprehensive check for user existence
    const existingUser = await db.query('SELECT * FROM users WHERE phone_number = $1', [phone_number]);
    if (existingUser.rows.length > 0) {
      const user = existingUser.rows[0];
      if (user.phone_verified) {
        res.status(400).json({ message: 'User with this phone number already exists. Please login.' });
        return;
      }
      // If not verified, we can let them re-verify (OTP will be resent)
      console.log('Unverified user found, resending OTP...');
    }

    try {
      // Send OTP via Twilio
      await twilioService.sendOTP(phone_number);
      res.status(200).json({ message: 'OTP sent successfully', phone_number });
    } catch (twilioError: any) {
      console.error('Twilio Error:', twilioError);
      
      let errorMessage = 'Failed to send OTP. Please check your phone number.';
      if (twilioError.status === 429) {
        errorMessage = 'Too many requests. Please try again after some time.';
      } else if (twilioError.code === 21614) {
        errorMessage = 'The provided phone number is not a valid mobile number.';
      } else if (twilioError.status === 401 || twilioError.status === 403) {
        errorMessage = 'Twilio Authentication Error: Please check your Account SID and Auth Token in Render environment variables.';
      }


      res.status(twilioError.status || 500).json({ 
        message: errorMessage,
        error_code: twilioError.code
      });
    }
  } catch (error: any) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Internal server error during signup' });
  }
};


export const verifyOTP = async (req: Request, res: Response): Promise<void> => {
  try {
    const { full_name, phone_number, email, password, otp } = req.body;

    if (!full_name || !phone_number || !password || !otp) {
      res.status(400).json({ message: 'All fields are required' });
      return;
    }

    // Verify OTP with Twilio
    const verification = await twilioService.verifyOTP(phone_number, otp);

    if (verification.status !== 'approved') {
      res.status(400).json({ message: 'Invalid or expired OTP' });
      return;
    }

    // Hash password
    const password_hash = await bcrypt.hash(password, 10);

    // Create user in database
    // Using ON CONFLICT to handle cases where an unverified record might exist
    const result = await db.query(
      `INSERT INTO users (full_name, phone_number, email, password_hash, phone_verified)
       VALUES ($1, $2, $3, $4, true)
       ON CONFLICT (phone_number) DO UPDATE 
       SET full_name = EXCLUDED.full_name, 
           email = EXCLUDED.email, 
           password_hash = EXCLUDED.password_hash, 
           phone_verified = true
       RETURNING id, full_name, phone_number, email`,
      [full_name, phone_number, email || null, password_hash]
    );

    const user = result.rows[0];

    // Generate JWT
    const token = jwt.sign({ id: user.id, phone_number: user.phone_number }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({ 
      message: 'User registered and verified successfully', 
      user,
      token 
    });
  } catch (error: any) {
    console.error('OTP Verification error:', error);
    res.status(500).json({ message: error.message || 'Error during verification' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { phone_number, password } = req.body;

    if (!phone_number || !password) {
      res.status(400).json({ message: 'Phone number and password are required' });
      return;
    }

    const result = await db.query('SELECT * FROM users WHERE phone_number = $1 AND phone_verified = true', [phone_number]);
    
    if (result.rows.length === 0) {
      res.status(401).json({ message: 'Invalid phone number or password' });
      return;
    }

    const user = result.rows[0];
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      res.status(401).json({ message: 'Invalid phone number or password' });
      return;
    }

    // Generate JWT
    const token = jwt.sign({ id: user.id, phone_number: user.phone_number }, JWT_SECRET, { expiresIn: '7d' });

    res.status(200).json({ 
      message: 'Login successful', 
      user: { id: user.id, full_name: user.full_name, phone_number: user.phone_number, email: user.email },
      token 
    });
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
