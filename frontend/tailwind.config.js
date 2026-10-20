/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        sratome: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
      },
      colors: {
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
          hover: "#125656",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        // WorkFlow Pro Brand Design Tokens
        workflow: {
          beige: '#F4EFE5',
          ivory: '#F8F5EE',
          teal: '#176B6B',
          mutedTeal: '#438A87',
          charcoal: '#292929',
          warmGray: '#77736B',
          borderBeige: '#DDD7CB',
          success: '#2E7D5E',
          warning: '#C88A2E',
          terracotta: '#C25B4E',
        },
      },
      boxShadow: {
        'neu-sm': '2px 2px 6px rgba(41, 41, 41, 0.04), -2px -2px 6px rgba(255, 255, 255, 0.7)',
        'neu': '4px 4px 12px rgba(41, 41, 41, 0.05), -3px -3px 10px rgba(255, 255, 255, 0.85)',
        'neu-raised': '6px 6px 16px rgba(41, 41, 41, 0.06), -4px -4px 12px rgba(255, 255, 255, 0.9)',
        'neu-inset': 'inset 2px 2px 5px rgba(41, 41, 41, 0.04), inset -2px -2px 5px rgba(255, 255, 255, 0.7)',
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
    },
  },
  plugins: [],
}
