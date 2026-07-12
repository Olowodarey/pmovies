/** @type {import('tailwindcss').Config} */
const tailwindConfig = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        bannerImg: "url('/public/banner.png')",
      },
      colors: {
        bg: "var(--bg)",
        surface: "var(--surface)",
        "surface-hover": "var(--surface-hover)",
        "surface-alt": "var(--surface-alt)",
        edge: "var(--border)",
        ink: "var(--text)",
        "ink-muted": "var(--text-muted)",
        brand: "var(--brand)",
        "brand-hover": "var(--brand-hover)",
        "brand-contrast": "var(--brand-contrast)",
        danger: "var(--danger)",
        "danger-hover": "var(--danger-hover)",
      },
      borderColor: {
        DEFAULT: "var(--border)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "Georgia", "serif"],
      },
    },
  },
  plugins: [],
};

export default tailwindConfig;
