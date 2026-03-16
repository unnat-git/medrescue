"use client";

import React from 'react';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

interface PhoneInputCustomProps {
  value: string | undefined;
  onChange: (value: string | undefined) => void;
  placeholder?: string;
  required?: boolean;
}

const PhoneInputCustom: React.FC<PhoneInputCustomProps> = ({ value, onChange, placeholder = "Enter phone number", required = false }) => {
  return (
    <div className="phone-input-wrapper">
      <PhoneInput
        international
        defaultCountry="IN"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className="custom-phone-input"
      />
      <style jsx global>{`
        .phone-input-wrapper .custom-phone-input {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .phone-input-wrapper .PhoneInputCountry {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          padding: 10px 14px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          transition: all 0.2s;
        }
        .phone-input-wrapper .PhoneInputCountry:focus-within {
          border-color: #ef4444;
          ring: 2px;
          ring-color: #fee2e2;
        }
        .phone-input-wrapper .PhoneInputInput {
          flex: 1;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          padding: 14px 16px;
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 500;
          color: #0f172a;
          outline: none;
          transition: all 0.2s;
        }
        .phone-input-wrapper .PhoneInputInput:focus {
          border-color: #ef4444;
          background: white;
          box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.1);
        }
        .phone-input-wrapper .PhoneInputCountrySelect {
          cursor: pointer;
          font-weight: 600;
        }
        .phone-input-wrapper .PhoneInputCountryIcon {
          width: 24px;
          height: 16px;
          border-radius: 2px;
          box-shadow: 0 1px 2px rgba(0,0,0,0.1);
        }
      `}</style>
    </div>
  );
};

export default PhoneInputCustom;
