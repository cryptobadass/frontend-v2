const defaultTheme = require('tailwindcss/defaultTheme');
module.exports = {
  purge: {
    content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
    options: {
      safelist: [
        /^shadow/,
        /^bg/,
        /^text/,
        /^border/,
        /^from/,
        /^to/,
        /^dark:/,
        /^hover:/,
        'dark',
        /^dark:/,
        /^mr/,
        /^w/
      ]
    }
  },
  darkMode: 'class', // false or 'media' or 'class'
  theme: {
    fontFamily: {
      body: [
        'Inter-Variable',
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Helvetica',
        'Arial',
        'sans-serif',
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"'
      ],
      display: [
        '"Tiempos Headline Medium"',
        'Times',
        '"Times New Roman"',
        'serif'
      ]
    },
    boxShadow: {
      sm: '0 2px 4px 0 rgba(0,0,0,0.05)',
      DEFAULT:
        '0px 4px 6px -1px rgba(0, 0, 0, 0.05), 0px 2px 4px -1px rgba(0, 0, 0, 0.05)',
      lg: '0 2px 4px 0 rgba(0,0,0,0.03), 0 10px 40px 0 rgba(0,0,0,0.05)',
      xl: '0 2px 4px 0 rgba(0,0,0,0.05), 0 0px 40px 0 rgba(0,0,0,0.1)',
      '2xl': '0px 25px 50px -12px rgba(0, 0, 0, 0.1)',
      '3xl':
        '0px 10px 10px -5px rgba(0, 0, 0, 0.02), 0px 20px 25px -5px rgba(0, 0, 0, 0.03)',
      '4xl': '25px 25px 50px -12px rgba(0, 0, 0, 0.03)',
      inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)',
      none: 'none'
    },
    borderColor: theme => ({
      ...theme('colors'),
      DEFAULT: theme('colors.gray.100', 'currentColor')
    }),
    screens: {
      xs: '440px',
      ...defaultTheme.screens
    },
    extend: {
      height: {
        '112': '28rem'
      },
      borderRadius: {
        '2xl': '1.25rem'
      },
      colors: {
        gunmetal: {
          DEFAULT: '#424658'
        },
        cyan: {
          DEFAULT: '#00ffff',
          50: '#00ffff',
          100: '#00ffff',
          200: '#00ffff',
          300: '#00ffff',
          400: '#00ffff',
          500: '#00ffff',
          600: '#00ffff',
          700: '#00ffff',
          800: '#00ffff',
          850: '#00ffff',
          900: '#00ffff'
        },
        cornflower: {
          DEFAULT: '#6188ff',
          50: '#6188ff',
          100: '#6188ff',
          200: '#6188ff',
          300: '#6188ff',
          400: '#6188ff',
          500: '#6188ff',
          600: '#6188ff',
          700: '#6188ff',
          800: '#6188ff',
          850: '#6188ff',
          900: '#6188ff'
        },
        dark: {
          DEFAULT: '#33384d',
          2: '#33384d',
          3: '1b1d24',
          50: '#33384d',
          100: '#33384d',
          200: '#33384d',
          300: '#33384d',
          400: '#33384d',
          500: '#33384d',
          600: '#33384d',
          700: '#33384d',
          800: '#33384d',
          850: '#33384d',
          900: '#33384d'
        },
        gray: {
          50: '#F8FAFC',
          100: '#EAF0F6',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
          700: '#334155',
          800: '#1E293B',
          850: '#162031',
          900: '#0F172A'
        },
        primary: {
          50: '#53555e',
          100: '#494b54',
          200: '#3f414a',
          300: '#353740',
          400: '#2b2d36',
          500: '#21232c',
          600: '#171922',
          700: '#0d0f18',
          800: '#03050e',
          900: '#000004'
        },
        'primary-dark': {
          50: '#6a7cff',
          100: '#6072ff',
          200: '#5668ff',
          300: '#4c5eff',
          400: '#4254ff',
          500: '#384aff',
          600: '#2e40f5',
          700: '#2436eb',
          800: '#1a2ce1',
          900: '#1022d7'
        },
        blue: {
          50: '#6a7cff',
          100: '#6072ff',
          200: '#5668ff',
          300: '#4c5eff',
          400: '#4254ff',
          500: '#384aff',
          600: '#2e40f5',
          700: '#2436eb',
          800: '#1a2ce1',
          900: '#1022d7',
          grey: '#a1a7bb'
        },
        pink: {
          50: '#ff4dff',
          100: '#ff43ff',
          200: '#ff39ff',
          300: '#ff2fff',
          400: '#fc25ff',
          500: '#f21bf6',
          600: '#e811ec',
          700: '#de07e2',
          800: '#d400d8',
          900: '#ca00ce'
        },
        yellow: {
          50: '#FFFBEA',
          100: '#FFF6D5',
          200: '#FFEEAD',
          300: '#FEE684',
          400: '#FEDD5C',
          500: '#FED533',
          600: '#F8C601',
          700: '#C09901',
          800: '#886D01',
          900: '#504000'
        }
      }
    }
  },
  variants: {
    extend: {
      margin: ['first'],
      borderRadius: ['first', 'last'],
      zIndex: ['hover'],
      borderWidth: ['dark', 'last']
    }
  },
  plugins: []
};
