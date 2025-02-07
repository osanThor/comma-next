import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/layouts/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/containers/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        main: "url('/assets/images/bg/main-bg.jpg')",
        login: "url('/assets/images/bg/login-bg.jpg')",
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        transparent: "transparent",
        white: "#ffffff",
        kakao: "#FAE100",
        main: {
          100: "#D2D1D9",
          200: "#A5A2B2",
          300: "#77748C",
          400: "#4A4565",
          500: "#1D173F",
          600: "#171232",
          700: "#110E26",
          800: "#0C0919",
          900: "#06050D",
        },
        point: {
          100: "#F5CEEB",
          200: "#EB9DD7",
          300: "#E26CC4",
          400: "#D83BB0",
          500: "#CE0A9C",
          600: "#A5087D",
          700: "#7C065E",
          800: "#52043E",
          900: "#29021F",
        },
      },
      fontFamily: {
        pretendard: ["Pretendard", "san-serif"],
        dnf: ["DNFBitBitv2", "san-serif"],
        pixelNes: ["Pixel_NES", "san-serif"],
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [
    ({ addUtilities }: { addUtilities: any }) => {
      addUtilities({
        ".contents-box": {
          "@apply flex flex-col items-center justify-center border-4 border-white bg-main-600/20 rounded-[30px] backdrop-blur-md":
            "",
        },
        ".bg-size": {
          "@apply w-full min-h-screen bg-cover bg-no-repeat": "",
        },
        ".main-swiper": {
          "@apply !overflow-visible": "",
        },
        ".skeleton": {
          "@apply animate-pulse rounded bg-main-200 opacity-70": "",
        },
      });
    },
  ],
  future: {
    hoverOnlyWhenSupported: true,
  },
} satisfies Config;
