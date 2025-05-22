import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  // Remove darkMode setting
  theme: {
    extend: {
      colors: {
        // You can customize your color palette here
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: "none",
            color: "#333",
            h1: {
              color: "#111",
            },
            h2: {
              color: "#1a1a1a",
              fontWeight: "700",
              marginTop: "2em",
            },
            h3: {
              color: "#333",
              fontWeight: "600",
            },
            a: {
              color: "#3182ce",
              "&:hover": {
                color: "#2c5282",
              },
            },
            strong: {
              fontWeight: "600",
            },
          },
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      animation: {
        fadeIn: "fadeIn 1s ease-in-out",
        fadeInFast: "fadeIn 0.5s ease-in-out",
        slideDown: "slideDown 0.7s ease-in-out",
        slideUp: "slideUp 0.7s ease-in-out",
        slideRight: "slideRight 0.7s ease-in-out",
        slideLeft: "slideLeft 0.7s ease-in-out",
        scaleIn: "scaleIn 0.5s ease-in-out",
        bounce: "bounce 1s infinite",
        pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        wiggle: "wiggle 1s ease-in-out",
        float: "float 3s ease-in-out infinite",
      },
      keyframes: {
        // Keep existing keyframes
      },
      transitionDelay: {
        "200": "200ms",
        "300": "300ms",
        "400": "400ms",
        "500": "500ms",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;
