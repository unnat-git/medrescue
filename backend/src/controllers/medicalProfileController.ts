import { Response } from 'express';
import db from '../db';
import { AuthRequest } from '../utils/authMiddleware';
import crypto from 'crypto';

const generatePatientId = async (): Promise<string> => {
  let patientId = '';
  let isUnique = false;
  
  while (!isUnique) {
    patientId = `PAT-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
    const check = await db.query('SELECT 1 FROM medical_profiles WHERE patient_id = $1', [patientId]);
    if (check.rows.length === 0) {
      isUnique = true;
    }
  }
  return patientId;
};

export const createProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    const { blood_group, allergies, chronic_diseases, medications, emergency_contact_name, emergency_contact_phone } = req.body;

    // Check if profile already exists
    const existing = await db.query('SELECT id FROM medical_profiles WHERE user_id = $1', [userId]);
    if (existing.rows.length > 0) {
      res.status(400).json({ message: 'Medical profile already exists for this user. Please use update instead.' });
      return;
    }

    const patient_id = await generatePatientId();

    const result = await db.query(
      `INSERT INTO medical_profiles (user_id, patient_id, blood_group, allergies, chronic_diseases, medications, emergency_contact_name, emergency_contact_phone)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [userId, patient_id, blood_group, allergies, chronic_diseases, medications, emergency_contact_name, emergency_contact_phone]
    );

    res.status(201).json({ message: 'Medical profile created successfully', profile: result.rows[0] });
  } catch (error) {
    console.error('Error creating profile:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    const { blood_group, allergies, chronic_diseases, medications, emergency_contact_name, emergency_contact_phone } = req.body;

    const result = await db.query(
      `UPDATE medical_profiles 
       SET blood_group = $1, allergies = $2, chronic_diseases = $3, medications = $4, 
           emergency_contact_name = $5, emergency_contact_phone = $6, updated_at = CURRENT_TIMESTAMP
       WHERE user_id = $7 RETURNING *`,
      [blood_group, allergies, chronic_diseases, medications, emergency_contact_name, emergency_contact_phone, userId]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ message: 'Medical profile not found' });
      return;
    }

    res.status(200).json({ message: 'Medical profile updated successfully', profile: result.rows[0] });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    const result = await db.query(`SELECT * FROM medical_profiles WHERE user_id = $1`, [userId]);

    if (result.rows.length === 0) {
      res.status(404).json({ message: 'Medical profile not found' });
      return;
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const getPublicProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id: patient_id } = req.params; 
    console.log(`Fetching medical profile for patient_id: ${patient_id}`);
    
    const result = await db.query(`
      SELECT mp.patient_id, mp.blood_group, mp.allergies, mp.chronic_diseases, mp.medications, 
             mp.emergency_contact_name, mp.emergency_contact_phone, u.full_name 
      FROM medical_profiles mp 
      JOIN users u ON mp.user_id = u.id 
      WHERE mp.patient_id = $1`, [patient_id]);

    if (result.rows.length === 0) {
      res.status(404).json({ message: 'Profile not found' });
      return;
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching public profile:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

