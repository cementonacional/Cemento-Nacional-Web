'use client';

import React, { forwardRef } from 'react';

interface AccessibleFormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  title?: string;
  description?: string;
  errorSummary?: string;
  errors?: Record<string, string>;
}

const AccessibleForm = forwardRef<HTMLFormElement, AccessibleFormProps>(
  ({ 
    title, 
    description, 
    errorSummary, 
    errors = {},
    className = '',
    children,
    ...props 
  }, ref) => {
    const hasErrors = Object.keys(errors).length > 0;
    
    return (
      <form
        ref={ref}
        className={`space-y-4 ${className}`}
        noValidate
        {...props}
      >
        {title && (
          <h2 className="text-2xl font-bold text-brand-black">
            {title}
          </h2>
        )}
        
        {description && (
          <p className="text-gray-600">
            {description}
          </p>
        )}
        
        {hasErrors && errorSummary && (
          <div 
            className="bg-red-50 border border-red-200 rounded-lg p-4"
            role="alert"
            aria-live="polite"
          >
            <h3 className="text-sm font-medium text-red-800 mb-2">
              {errorSummary}
            </h3>
            <ul className="text-sm text-red-700 space-y-1">
              {Object.entries(errors).map(([field, message]) => (
                <li key={field}>
                  <a 
                    href={`#${field}`}
                    className="underline hover:no-underline"
                  >
                    {message}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {children}
      </form>
    );
  }
);

AccessibleForm.displayName = 'AccessibleForm';

export default AccessibleForm;
