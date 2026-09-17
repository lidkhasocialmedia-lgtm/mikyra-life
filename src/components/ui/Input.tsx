'use client'

import { forwardRef, useId } from 'react'
import { cn } from '@/lib/utils'

/** Input de formulario con label + error integrado (React Hook Form friendly) */
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  etiqueta?: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, etiqueta, error, id, type = 'text', ...props }, ref) => {
    const idGenerado = useId()
    const inputId = id ?? idGenerado

    return (
      <div className="w-full">
        {etiqueta && (
          <label htmlFor={inputId} className="mb-1.5 block text-sm font-medium text-neutral-300">
            {etiqueta}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          type={type}
          aria-invalid={Boolean(error)}
          className={cn(
            'h-11 w-full rounded-xl border bg-black/40 px-4 text-sm text-neutral-100 placeholder:text-neutral-600',
            'transition-colors focus:outline-none focus:ring-2',
            error
              ? 'border-red-500/60 focus:border-red-500 focus:ring-red-500/30'
              : 'border-neutral-800 focus:border-marca-ambar focus:ring-marca-ambar/25',
            className
          )}
          {...props}
        />
        {error && <p className="mt-1.5 text-xs text-red-400">{error}</p>}
      </div>
    )
  }
)

Input.displayName = 'Input'

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  etiqueta?: string
  error?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, etiqueta, error, id, ...props }, ref) => {
    const idGenerado = useId()
    const inputId = id ?? idGenerado
    return (
      <div className="w-full">
        {etiqueta && (
          <label htmlFor={inputId} className="mb-1.5 block text-sm font-medium text-neutral-300">
            {etiqueta}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          className={cn(
            'w-full rounded-xl border bg-black/40 p-4 text-sm text-neutral-100 placeholder:text-neutral-600',
            'transition-colors focus:outline-none focus:ring-2',
            error
              ? 'border-red-500/60 focus:border-red-500 focus:ring-red-500/30'
              : 'border-neutral-800 focus:border-marca-ambar focus:ring-marca-ambar/25',
            className
          )}
          {...props}
        />
        {error && <p className="mt-1.5 text-xs text-red-400">{error}</p>}
      </div>
    )
  }
)
Textarea.displayName = 'Textarea'
