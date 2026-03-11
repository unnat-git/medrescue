import { Request, Response } from 'express';
import db from '../db';

export const createPatient = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, age, gender, blood_group, allergies, chronic_conditions, current_medications, past_surgeries, emergency_contact, doctor_name } = req.body;

    const result = await db.query(
      `INSERT INTO patients (name, age, gender, blood_group, allergies, chronic_conditions, current_medications, past_surgeries, emergency_contact, doctor_name)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
      [name, age, gender, blood_group, allergies, chronic_conditions, current_medications, past_surgeries, emergency_contact, doctor_name]
    );

    res.status(201).json({ message: 'Patient profile created successfully', patient: result.rows[0] });
  } catch (error) {
    console.error('Error creating patient:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const getPatient = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const result = await db.query(`SELECT * FROM patients WHERE id = $1`, [id]);

    if (result.rows.length === 0) {
      res.status(404).json({ message: 'Patient not found' });
      return;
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching patient:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
