export const designSystem = {
  // Color Palette - Light Mode
  light: {
    // Primary Colors
    primary: {
      main: '#2563eb',      // Blue 600
      hover: '#1d4ed8',     // Blue 700
      light: '#dbeafe',     // Blue 50
      dark: '#1e40af',      // Blue 800
    },
    // Neutral Colors
    neutral: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827',
    },
    // Semantic Colors
    success: {
      main: '#059669',      // Green 600
      light: '#d1fae5',     // Green 50
      dark: '#047857',      // Green 700
    },
    warning: {
      main: '#d97706',      // Amber 600
      light: '#fef3c7',     // Amber 50
      dark: '#b45309',      // Amber 700
    },
    error: {
      main: '#dc2626',      // Red 600
      light: '#fee2e2',     // Red 50
      dark: '#b91c1c',      // Red 700
    },
    info: {
      main: '#0891b2',      // Cyan 600
      light: '#cffafe',     // Cyan 50
      dark: '#0e7490',      // Cyan 700
    },
    // Background & Surface
    background: '#ffffff',
    surface: '#f9fafb',
    border: '#e5e7eb',
    // Text
    text: {
      primary: '#111827',
      secondary: '#6b7280',
      disabled: '#9ca3af',
    }
  },

  // Color Palette - Dark Mode
  dark: {
    // Primary Colors
    primary: {
      main: '#3b82f6',      // Blue 500
      hover: '#2563eb',     // Blue 600
      light: '#1e3a8a',     // Blue 900
      dark: '#1e40af',      // Blue 800
    },
    // Neutral Colors (inverted)
    neutral: {
      50: '#111827',
      100: '#1f2937',
      200: '#374151',
      300: '#4b5563',
      400: '#6b7280',
      500: '#9ca3af',
      600: '#d1d5db',
      700: '#e5e7eb',
      800: '#f3f4f6',
      900: '#f9fafb',
    },
    // Semantic Colors
    success: {
      main: '#10b981',      // Green 500
      light: '#064e3b',     // Green 900
      dark: '#059669',      // Green 600
    },
    warning: {
      main: '#f59e0b',      // Amber 500
      light: '#78350f',     // Amber 900
      dark: '#d97706',      // Amber 600
    },
    error: {
      main: '#ef4444',      // Red 500
      light: '#7f1d1d',     // Red 900
      dark: '#dc2626',      // Red 600
    },
    info: {
      main: '#06b6d4',      // Cyan 500
      light: '#164e63',     // Cyan 900
      dark: '#0891b2',      // Cyan 600
    },
    // Background & Surface
    background: '#0f172a',  // Slate 900
    surface: '#1e293b',     // Slate 800
    border: '#334155',      // Slate 700
    // Text
    text: {
      primary: '#f1f5f9',
      secondary: '#94a3b8',
      disabled: '#64748b',
    }
  },

  // Typography
  typography: {
    fontFamily: {
      sans: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      mono: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace',
    },
    fontSize: {
      xs: '0.75rem',      // 12px
      sm: '0.875rem',     // 14px
      base: '1rem',       // 16px
      lg: '1.125rem',     // 18px
      xl: '1.25rem',      // 20px
      '2xl': '1.5rem',    // 24px
      '3xl': '1.875rem',  // 30px
      '4xl': '2.25rem',   // 36px
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    lineHeight: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.75,
    }
  },

  // Spacing (4px grid)
  spacing: {
    0: '0',
    1: '0.25rem',   // 4px
    2: '0.5rem',    // 8px
    3: '0.75rem',   // 12px
    4: '1rem',      // 16px
    5: '1.25rem',   // 20px
    6: '1.5rem',    // 24px
    8: '2rem',      // 32px
    10: '2.5rem',   // 40px
    12: '3rem',     // 48px
    16: '4rem',     // 64px
    20: '5rem',     // 80px
    24: '6rem',     // 96px
  },

  // Border Radius
  borderRadius: {
    none: '0',
    sm: '0.25rem',    // 4px
    DEFAULT: '0.5rem', // 8px
    md: '0.625rem',   // 10px
    lg: '0.75rem',    // 12px
    xl: '1rem',       // 16px
    '2xl': '1.5rem',  // 24px
    full: '9999px',
  },

  // Shadows
  shadow: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  }
};

export type Theme = 'light' | 'dark';
