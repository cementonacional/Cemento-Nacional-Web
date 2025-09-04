'use client';

import React, { forwardRef } from 'react';

interface ValidatedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  required?: boolean;
  helperText?: string;
}

const ValidatedInput = forwardRef<HTMLInputElement, ValidatedInputProps>(
  ({ label, error, required, helperText, className = '', ...props }, ref) => {
    const inputId = `input-${label.toLowerCase().replace(/\s+/g, '-')}`;
    
    return (
      <div className="space-y-2">
        <label 
          htmlFor={inputId}
          className="block text-sm font-medium text-brand-black"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        
        <input
          ref={ref}
          id={inputId}
          className={`
            w-full px-4 py-3 border-2 rounded-lg
            focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent
            transition-colors duration-200
            ${error 
              ? 'border-red-500 bg-red-50' 
              : 'border-brand-black focus:border-brand-red'
            }
            ${className}
          `}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
          {...props}
        />
        
        {error && (
          <p 
            id={`${inputId}-error`}
            className="text-sm text-red-600"
            role="alert"
          >
            {error}
          </p>
        )}
        
        {helperText && !error && (
          <p 
            id={`${inputId}-helper`}
            className="text-sm text-gray-600"
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

ValidatedInput.displayName = 'ValidatedInput';

export default ValidatedInput;
