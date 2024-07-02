/** @type {import('tailwindcss').Config} */
export const content = [
  "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
  "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
];
export const theme = {
  theme: {
    darkmode: true,
  },
  extend: {
    backgroundImage: {
      "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
    },
    padding: {
      '3/4': '75%',
    },
    // image dimensions
    width: {
      '120': '30rem',
    },
  },
  variants: {
    extend: {},
    
  },
};
export const plugins = [
  require('@tailwindcss/typography'),
];
