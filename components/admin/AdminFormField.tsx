"use client";

import { UseFormRegister, FieldError } from 'react-hook-form';

interface AdminFormFieldProps {
  label: string;
  name: string;
  type?: 'text' | 'email' | 'number' | 'url' | 'date' | 'textarea';
  register: UseFormRegister<any>;
  error?: FieldError;
  required?: boolean;
  placeholder?: string;
  rows?: number;
}

export default function AdminFormField({
  label,
  name,
  type = 'text',
  register,
  error,
  required = false,
  placeholder,
  rows = 4,
}: AdminFormFieldProps) {
  const inputClassName =
    'w-full px-4 py-3 bg-background border border-foreground/20 rounded-xl focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all';

  return (
    <div className="mb-6">
      <label className="text-sm font-medium text-foreground mb-2 block">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {type === 'textarea' ? (
        <textarea
          {...register(name, { required })}
          className={inputClassName}
          placeholder={placeholder}
          rows={rows}
        />
      ) : (
        <input
          {...register(name, { required })}
          type={type}
          className={inputClassName}
          placeholder={placeholder}
        />
      )}

      {error && <p className="text-red-500 text-xs mt-1">{error.message || 'This field is required'}</p>}
    </div>
  );
}
