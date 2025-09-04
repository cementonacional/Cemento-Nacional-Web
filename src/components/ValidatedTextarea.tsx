'use client';

import React, { forwardRef } from 'react';

interface ValidatedTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  required?: boolean;
  helperText?: string;
}

const ValidatedTextarea = forwardRef<HTMLTextAreaElement, ValidatedTextareaProps>(
  ({ label, error, required, helperText, className = '', ...props }, ref) => {
    const textareaId = `textarea-${label.toLowerCase().replace(/\s+/g, '-')}`;
    
    return (
      <div className="space-y-2">
        <label 
          htmlFor={textareaId}
          className="block text-sm font-medium text-brand-black"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        
        <textarea
          ref={ref}
          id={textareaId}
          className={`
            w-full px-4 py-3 border-2 rounded-lg
            focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent
            transition-colors duration-200
            resize-vertical min-h-[100px]
            ${error 
              ? 'border-red-500 bg-red-50' 
              : 'border-brand-black focus:border-brand-red'
            }
            ${className}
          `}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${textareaId}-error` : helperText ? `${textareaId}-helper` : undefined}
          {...props}
        />
        
        {error && (
          <p 
            id={`${textareaId}-error`}
            className="text-sm text-red-600"
            role="alert"
          >
            {error}
          </p>
        )}
        
        {helperText && !error && (
          <p 
            id={`${textareaId}-helper`}
            className="text-sm text-gray-600"
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

ValidatedTextarea.displayName = 'ValidatedTextarea';

export default ValidatedTextarea;
