import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  isLoading, 
  className = '', 
  disabled,
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center font-bold uppercase transition-all focus:outline-none";
  
  const variants = {
    primary: "bg-yellow-400 text-black hover:bg-yellow-500 shadow-lg hover:shadow-xl disabled:bg-gray-600 disabled:text-gray-400",
    secondary: "bg-cyan-500 text-black hover:bg-cyan-600 shadow-lg hover:shadow-xl disabled:bg-gray-600 disabled:text-gray-400",
    danger: "bg-red-500 text-white hover:bg-red-600 shadow-lg hover:shadow-xl disabled:bg-gray-600 disabled:text-gray-400",
    outline: "border-2 border-gray-800 text-white bg-black hover:border-yellow-400 disabled:opacity-50",
    ghost: "text-white hover:bg-gray-900 disabled:opacity-50",
  };

  const sizes = {
    sm: "px-4 py-2 text-xs",
    md: "px-6 py-3 text-xs",
    lg: "px-8 py-4 text-sm",
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${isLoading || disabled ? 'cursor-not-allowed' : ''} ${className}`}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
      {children}
    </button>
  );
};