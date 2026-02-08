/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./*.{js,ts,jsx,tsx}",
        "./src/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
        "./hooks/**/*.{js,ts,jsx,tsx}",
        "./contexts/**/*.{js,ts,jsx,tsx}",
        "./services/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Plus Jakarta Sans', 'sans-serif'],
                heading: ['Montserrat', 'sans-serif'],
            },
            colors: {
                glass: {
                    100: 'rgba(255, 255, 255, 0.1)',
                    200: 'rgba(255, 255, 255, 0.2)',
                    300: 'rgba(255, 255, 255, 0.3)',
                    400: 'rgba(255, 255, 255, 0.4)',
                    800: 'rgba(255, 255, 255, 0.8)',
                },
                doky: {
                    blue: 'var(--color-secondary, #003366)', // Using Secondary for the dark/brand color
                    'action-cyan': 'var(--color-primary, #00C2E0)', // Using Primary for the action color
                    'bright-cyan': '#00E5FF',
                    'success-green': '#00E676',
                    'dark-glass': 'rgba(0, 51, 102, 0.8)',
                    'light-glass': 'rgba(255, 255, 255, 0.7)',
                }
            },
        },
    },
    plugins: [],
}
