import twilio from 'twilio';
import dotenv from 'dotenv';

dotenv.config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const verifyServiceSid = process.env.TWILIO_VERIFY_SERVICE_SID;

const client = twilio(accountSid, authToken);

export const sendOTP = async (phoneNumber: string) => {
  if (!verifyServiceSid) {
    throw new Error('TWILIO_VERIFY_SERVICE_SID is not configured');
  }

  try {
    const verification = await client.verify.v2.services(verifyServiceSid)
      .verifications
      .create({ to: phoneNumber, channel: 'sms' });
    
    return verification;
  } catch (error) {
    console.error('Error sending OTP via Twilio:', error);
    throw error;
  }
};

export const verifyOTP = async (phoneNumber: string, code: string) => {
  if (!verifyServiceSid) {
    throw new Error('TWILIO_VERIFY_SERVICE_SID is not configured');
  }

  try {
    const verificationCheck = await client.verify.v2.services(verifyServiceSid)
      .verificationChecks
      .create({ to: phoneNumber, code });
    
    return verificationCheck;
  } catch (error) {
    console.error('Error verifying OTP via Twilio:', error);
    throw error;
  }
};
