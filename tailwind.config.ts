import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          50: "#FAF7EE",
          100: "#F5EED8",
          200: "#ECDCB2",
          300: "#E2C889",
          400: "#D4AF37", // classic metallic gold
          500: "#B88E18",
          600: "#946F0F",
          700: "#71510C",
          800: "#4F3708",
          900: "#312204",
        },
        ivory: {
          50: "#FFFEFA",
          100: "#FAF8F2",
          200: "#F4EFE6",
          300: "#ECE2D4",
          400: "#DFD2BE",
          500: "#CBBBA3",
        },
        maroon: {
          50: "#FCF3F4",
          100: "#F8E5E7",
          600: "#801222",
          700: "#670A18",
          800: "#4D0711",
          900: "#36040A",
        },
        emerald: {
          800: "#064E3B",
          900: "#022C22",
          950: "#011B15",
        },
        midnight: {
          800: "#131B2E",
          900: "#0B1120",
          950: "#060A14",
        },
      },
      fontFamily: {
        serif: ["var(--font-cormorant)", "Georgia", "serif"],
        cinzel: ["var(--font-cinzel)", "serif"],
        sans: ["var(--font-jakarta)", "sans-serif"],
        script: ["var(--font-script)", "cursive"],
      },
      boxShadow: {
        luxury: "0 20px 45px -15px rgba(184, 142, 24, 0.15), 0 10px 25px -10px rgba(0, 0, 0, 0.08)",
        "card-3d": "0 25px 50px -12px rgba(49, 34, 4, 0.25), 0 0 0 1px rgba(212, 175, 55, 0.15)",
        emboss: "inset 1px 1px 2px rgba(255, 255, 255, 0.6), inset -1px -1px 2px rgba(0, 0, 0, 0.15)",
      },
      backgroundImage: {
        "gold-gradient": "linear-gradient(135deg, #ECC875 0%, #D4AF37 50%, #99781B 100%)",
        "gold-foil": "linear-gradient(45deg, #d4af37 0%, #fff2b2 25%, #d4af37 50%, #aa8012 75%, #ffeaa7 100%)",
        "rose-foil": "linear-gradient(45deg, #B76E79 0%, #F5D6CE 30%, #B76E79 70%, #87414A 100%)",
        "silver-foil": "linear-gradient(45deg, #CFD8DC 0%, #FFFFFF 30%, #90A4AE 70%, #ECEFF1 100%)",
        "dark-radial": "radial-gradient(circle at center, #1E1A29 0%, #0F0D15 100%)",
      },
    },
  },
  plugins: [],
};
export default config;

