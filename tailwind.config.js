/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  darkMode: ["class"],
  content: [
    "./resources/**/*.blade.php",
    "./resources/**/*.js",
    "./resources/**/*.jsx",
    "./resources/**/*.ts",
    "./resources/**/*.tsx",
    "./vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ['Noto Sans Arabic', ...defaultTheme.fontFamily.sans],
        arabic: ["Noto Sans Arabic", "system-ui", "sans-serif"], // Specific Arabic font stack
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        moroccan: {
          50: "#fef8f3",
          100: "#fceee0",
          200: "#f8d9bf",
          300: "#f3bd94",
          400: "#ec9866",
          500: "#e67e44",
          600: "#d76339",
          700: "#b34e31",
          800: "#90412f",
          900: "#743829",
          950: "#3e1c13",
        },
        terracotta: {
          50: "#fef5f2",
          100: "#fce8e2",
          200: "#f9d5ca",
          300: "#f4b8a6",
          400: "#ed9173",
          500: "#e2724a",
          600: "#d0572e",
          700: "#af4724",
          800: "#913d22",
          900: "#783622",
          950: "#401a0e",
        },
        olive: {
          50: "#f7f8f3",
          100: "#eef0e4",
          200: "#dde1cb",
          300: "#c4cc9f",
          400: "#aab876",
          500: "#91a258",
          600: "#708044",
          700: "#576239",
          800: "#475031",
          900: "#3d442c",
          950: "#202514",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        fadeIn: {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        slideInRight: {
          from: { opacity: "0", transform: "translateX(30px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        fadeIn: "fadeIn 0.6s ease-out",
        slideInRight: "slideInRight 0.6s ease-out",
        float: "float 3s ease-in-out infinite",
      },
      backgroundImage: {
        "moroccan-pattern":
          'url(\'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40"><rect width="40" height="40" fill="%23f4b8a6" opacity="0.1"/><path d="M20 0L30 10L20 20L10 10z" fill="%23e2724a" opacity="0.1"/><path d="M20 20L30 30L20 40L10 30z" fill="%23e2724a" opacity="0.1"/></svg>\')',
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    require('tailwindcss-rtl')
  ],
};
