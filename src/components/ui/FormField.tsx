import React from 'react'

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  helperText?: string
  icon?: React.ReactNode
  containerClassName?: string
}

export function FormInput({
  label,
  error,
  helperText,
  icon,
  containerClassName = '',
  id,
  required,
  ...props
}: FormInputProps) {
  const inputId = id || label.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className={`space-y-1 ${containerClassName}`}>
      <div
        className={`form-input-box ${
          error ? 'border-rose-400 bg-rose-50/40 focus-within:border-rose-500 focus-within:ring-rose-500/15' : ''
        }`}
      >
        <div className="flex items-center justify-between">
          <label htmlFor={inputId} className="form-label-tag">
            {label} {required && <span className="text-rose-500">*</span>}
          </label>
          {icon && <span className="text-gray-400 shrink-0">{icon}</span>}
        </div>
        <input id={inputId} required={required} className="form-field-input" {...props} />
      </div>
      {error && <p className="text-[11px] font-semibold text-rose-600 pl-1">{error}</p>}
      {helperText && !error && <p className="text-[11px] text-[#6B7280] pl-1">{helperText}</p>}
    </div>
  )
}

interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  error?: string
  helperText?: string
  children: React.ReactNode
  containerClassName?: string
}

export function FormSelect({
  label,
  error,
  helperText,
  children,
  containerClassName = '',
  id,
  required,
  ...props
}: FormSelectProps) {
  const selectId = id || label.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className={`space-y-1 ${containerClassName}`}>
      <div
        className={`form-input-box ${
          error ? 'border-rose-400 bg-rose-50/40 focus-within:border-rose-500 focus-within:ring-rose-500/15' : ''
        }`}
      >
        <label htmlFor={selectId} className="form-label-tag">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
        <select
          id={selectId}
          required={required}
          className="form-field-input cursor-pointer bg-transparent"
          {...props}
        >
          {children}
        </select>
      </div>
      {error && <p className="text-[11px] font-semibold text-rose-600 pl-1">{error}</p>}
      {helperText && !error && <p className="text-[11px] text-[#6B7280] pl-1">{helperText}</p>}
    </div>
  )
}

interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
  error?: string
  helperText?: string
  containerClassName?: string
}

export function FormTextarea({
  label,
  error,
  helperText,
  containerClassName = '',
  id,
  required,
  rows = 3,
  ...props
}: FormTextareaProps) {
  const textareaId = id || label.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className={`space-y-1 ${containerClassName}`}>
      <div
        className={`form-input-box ${
          error ? 'border-rose-400 bg-rose-50/40 focus-within:border-rose-500 focus-within:ring-rose-500/15' : ''
        }`}
      >
        <label htmlFor={textareaId} className="form-label-tag">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
        <textarea
          id={textareaId}
          required={required}
          rows={rows}
          className="form-field-input resize-none"
          {...props}
        />
      </div>
      {error && <p className="text-[11px] font-semibold text-rose-600 pl-1">{error}</p>}
      {helperText && !error && <p className="text-[11px] text-[#6B7280] pl-1">{helperText}</p>}
    </div>
  )
}

