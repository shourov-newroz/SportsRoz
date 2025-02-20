export const lightTheme = {
  // Colors
  '--primary-color': '#52c41a',
  '--primary-color-hover': '#40a9ff',
  '--primary-color-active': '#096dd9',
  '--success-color': '#52c41a',
  '--warning-color': '#faad14',
  '--error-color': '#f5222d',
  '--heading-color': '#262626',
  '--text-color': '#595959',
  '--text-color-secondary': '#8c8c8c',
  '--disabled-color': '#bfbfbf',
  '--border-color': '#d9d9d9',
  '--box-shadow': '0 2px 8px rgba(0, 0, 0, 0.15)',

  // Background colors
  '--background-color-light': '#ffffff',
  '--background-color-base': '#f5f5f5',
  '--background-color-dark': '#141414',

  // Component specific
  '--header-bg': '#ffffff',
  '--footer-bg': '#f5f5f5',
  '--body-bg': '#ffffff',
  '--card-bg': '#ffffff',
  '--modal-bg': '#ffffff',
  '--popover-bg': '#ffffff',
  '--menu-bg': '#ffffff',
  '--menu-item-active-bg': '#e6f7ff',

  // Typography
  '--font-family':
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  '--font-size-base': '14px',
  '--font-size-lg': '16px',
  '--font-size-sm': '12px',
  '--line-height-base': '1.5715',

  // Layout
  '--border-radius-base': '2px',
  '--border-width-base': '1px',
  '--padding-lg': '24px',
  '--padding-md': '16px',
  '--padding-sm': '12px',
  '--padding-xs': '8px',
  '--margin-lg': '24px',
  '--margin-md': '16px',
  '--margin-sm': '12px',
  '--margin-xs': '8px',
};

export const darkTheme = {
  // Colors
  '--primary-color': '#177ddc', // Slightly adjusted blue for dark mode
  '--primary-color-hover': '#40a9ff',
  '--primary-color-active': '#096dd9',
  '--success-color': '#49aa19',
  '--warning-color': '#d89614',
  '--error-color': '#d32029',
  '--heading-color': '#e6e6e6',
  '--text-color': '#d9d9d9',
  '--text-color-secondary': '#8c8c8c',
  '--disabled-color': '#595959',
  '--border-color': '#434343',
  '--box-shadow': '0 2px 8px rgba(0, 0, 0, 0.45)',

  // Background colors
  '--background-color-light': '#1f1f1f',
  '--background-color-base': '#141414',
  '--background-color-dark': '#000000',

  // Component specific
  '--header-bg': '#1f1f1f',
  '--footer-bg': '#141414',
  '--body-bg': '#141414',
  '--card-bg': '#1f1f1f',
  '--modal-bg': '#1f1f1f',
  '--popover-bg': '#1f1f1f',
  '--menu-bg': '#1f1f1f',
  '--menu-item-active-bg': '#111b26',

  // Typography and other values remain the same
  ...Object.fromEntries(
    Object.entries(lightTheme).filter(([key]) =>
      key.match(/^--(font|border-radius|border-width|padding|margin)/)
    )
  ),
};

export const applyTheme = (theme: Record<string, string>) => {
  const root = document.documentElement;
  Object.entries(theme).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });
};

// Optional: Add theme utility functions
export const isDarkMode = () => document.documentElement.getAttribute('data-theme') === 'dark';

export const toggleTheme = () => {
  const currentTheme = isDarkMode() ? lightTheme : darkTheme;
  document.documentElement.setAttribute('data-theme', isDarkMode() ? 'light' : 'dark');
  applyTheme(currentTheme);
};
