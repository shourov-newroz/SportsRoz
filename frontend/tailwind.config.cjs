/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './index.html',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'var(--primary-color)',
          hover: 'var(--primary-color-hover)',
          active: 'var(--primary-color-active)',
        },
        success: 'var(--success-color)',
        warning: 'var(--warning-color)',
        error: 'var(--error-color)',
        heading: 'var(--heading-color)',
        text: {
          DEFAULT: 'var(--text-color)',
          secondary: 'var(--text-color-secondary)',
        },
        disabled: 'var(--disabled-color)',
        border: 'var(--border-color)',
      },
      backgroundColor: {
        light: 'var(--background-color-light)',
        base: 'var(--background-color-base)',
        dark: 'var(--background-color-dark)',
        header: 'var(--header-bg)',
        footer: 'var(--footer-bg)',
        body: 'var(--body-bg)',
        card: 'var(--card-bg)',
        modal: 'var(--modal-bg)',
        popover: 'var(--popover-bg)',
        menu: 'var(--menu-bg)',
        'menu-active': 'var(--menu-item-active-bg)',
        background: 'var(--body-bg)',
        'background-light': 'var(--background-color-light)',
        'background-base': 'var(--background-color-base)',
        'background-dark': 'var(--background-color-dark)',
      },
      fontFamily: {
        sans: 'var(--font-family)',
      },
      fontSize: {
        base: 'var(--font-size-base)',
        lg: 'var(--font-size-lg)',
        sm: 'var(--font-size-sm)',
      },
      lineHeight: {
        base: 'var(--line-height-base)',
      },
      borderRadius: {
        base: 'var(--border-radius-base)',
      },
      borderWidth: {
        base: 'var(--border-width-base)',
      },
      padding: {
        lg: 'var(--padding-lg)',
        md: 'var(--padding-md)',
        sm: 'var(--padding-sm)',
        xs: 'var(--padding-xs)',
      },
      margin: {
        lg: 'var(--margin-lg)',
        md: 'var(--margin-md)',
        sm: 'var(--margin-sm)',
        xs: 'var(--margin-xs)',
      },
      boxShadow: {
        DEFAULT: 'var(--box-shadow)',
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  },
}; 