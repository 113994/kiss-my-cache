/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'brand': {
          'primary': '#10B981', // Fresh green
          'light': '#ECFDF5',   // Light green
          'dark': '#047857',    // Dark green
          'accent': '#8B5CF6',  // Purple for interactions
        },
        'neutral': {
          'bg': '#F9FAFB',      // Off-white
          'border': '#E5E7EB',  // Soft gray
          'text': '#1F2937',    // Dark gray
          'muted': '#6B7280',   // Muted gray
        },
      },
      spacing: {
        'safe-b': 'max(1rem, env(safe-area-inset-bottom))',
      },
    },
  },
  plugins: [],
};
