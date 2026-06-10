import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  children,
  ...props
}) => {
  const baseStyles = 'font-mono font-bold uppercase tracking-wider rounded-md transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed border'

  const variants = {
    primary: 'border-qx-accent/40 bg-qx-accent/10 text-qx-accent hover:bg-qx-accent/20 hover:border-qx-accent/60',
    secondary: 'border-white/10 bg-white/5 text-white/70 hover:bg-white/8 hover:text-white',
    ghost: 'border-transparent bg-transparent text-white/45 hover:text-white hover:bg-white/5',
  }
  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  }

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? 'Loading...' : children}
    </button>
  )
}

export default Button
