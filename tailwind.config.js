/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                brand: {
                    base: '#FDF0D5',    // Cream - Background
                    surface: '#ffffff', // White - Cards
                    accent: '#C1121F',  // Red - Primary Action
                    'accent-dark': '#780000', // Dark Red - Hover
                    primary: '#003049', // Prussian Blue - Sidebar/Text
                    secondary: '#669BBC', // Air Blue - Secondary
                }
            }
        },
    },
    plugins: [],
}
