// Paylockr Brutalist Fintech Professional Design System

export const colors = {
  // Primary
  black: '#000000',
  white: '#FFFFFF',
  yellow: '#FBBF24',
  cyan: '#06B6D4',
  
  // Neutrals
  darkGray: '#1F2937',
  mediumGray: '#6B7280',
  lightGray: '#D1D5DB',
  
  // Semantic
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#06B6D4',
};

export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  '2xl': '48px',
  '3xl': '64px',
};

export const typography = {
  h1: 'text-4xl md:text-5xl font-black uppercase tracking-tight',
  h2: 'text-2xl md:text-3xl font-bold uppercase tracking-tight',
  h3: 'text-xl md:text-2xl font-bold',
  body: 'text-sm md:text-base font-normal',
  label: 'text-xs font-bold uppercase tracking-wide',
  small: 'text-xs font-normal',
};

export const components = {
  button: {
    primary: 'bg-yellow-400 hover:bg-yellow-500 text-black font-bold uppercase px-6 py-3 transition-all hover:shadow-lg',
    secondary: 'border-2 border-gray-700 hover:border-yellow-400 bg-transparent text-white font-bold uppercase px-6 py-3 transition-all',
    text: 'text-gray-400 hover:text-yellow-400 font-bold uppercase transition-colors',
  },
  card: {
    base: 'bg-black border-b-4 border-gray-800 p-6 transition-all hover:border-yellow-400',
    metric: 'bg-black border-b-4 border-cyan-500 p-6',
  },
  input: {
    base: 'bg-transparent border-b-2 border-gray-700 focus:border-yellow-400 text-white px-0 py-3 outline-none transition-colors',
  },
};
