/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
                navy: {
                    900: '#0B1120',
                    800: '#1a2336',
                },
                gold: {
                    500: '#C5A067',
                    600: '#b08d55',
                    100: '#fbf6ec'
                }
            },
            fontFamily: {
                serif: ['var(--font-playfair)', '"Playfair Display"', 'serif'],
                sans: ['var(--font-inter)', '"Inter"', 'sans-serif'],
            },
        },
    },
    plugins: [],
};
