import twilio from 'twilio';
import dotenv from 'dotenv';

dotenv.config();

const getTwilioConfig = () => {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const verifyServiceSid = process.env.TWILIO_VERIFY_SERVICE_SID;

  if (!accountSid || !authToken || !verifyServiceSid) {
    const missing = [];
    if (!accountSid) missing.push('TWILIO_ACCOUNT_SID');
    if (!authToken) missing.push('TWILIO_AUTH_TOKEN');
    if (!verifyServiceSid) missing.push('TWILIO_VERIFY_SERVICE_SID');
    
    throw new Error(`Twilio configuration is incomplete. Missing: ${missing.join(', ')}. Please add these variables to your Render/Deployment environment.`);
  }

  return { accountSid, authToken, verifyServiceSid };
};


export const sendOTP = async (phoneNumber: string) => {
  const { accountSid, authToken, verifyServiceSid } = getTwilioConfig();
  const client = twilio(accountSid, authToken);

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
  const { accountSid, authToken, verifyServiceSid } = getTwilioConfig();
  const client = twilio(accountSid, authToken);

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

