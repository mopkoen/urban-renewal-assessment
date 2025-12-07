import React from 'react';

interface InputFieldProps {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  type?: 'text' | 'number';
  suffix?: string;
  placeholder?: string;
  className?: string;
  onBlur?: (value: string) => void;
}

export const InputField: React.FC<InputFieldProps> = ({ 
  label, 
  value, 
  onChange, 
  type = 'text', 
  suffix, 
  placeholder,
  className = '',
  onBlur
}) => {
  return (
    <div className={`mb-4 ${className}`}>
      <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 transition-colors">
        {label}
      </label>
      <div className="relative rounded-md shadow-sm">
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={(e) => onBlur?.(e.target.value)}
          placeholder={placeholder}
          className="block w-full rounded-md border-0 py-2.5 pl-3 pr-10 text-slate-900 dark:text-white ring-1 ring-inset ring-slate-300 dark:ring-slate-600 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-inset focus:ring-primary-600 dark:focus:ring-primary-500 bg-white dark:bg-slate-800 transition-all sm:text-sm sm:leading-6"
        />
        {suffix && (
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <span className="text-slate-400 dark:text-slate-500 sm:text-sm font-medium">{suffix}</span>
          </div>
        )}
      </div>
    </div>
  );
};
