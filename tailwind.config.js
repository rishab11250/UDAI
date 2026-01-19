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
                    base: '#CFDBD5',    // Grayish Cyan - Background
                    surface: '#E8EDDF', // Off White - Cards
                    accent: '#F5CB5C',  // Saffron - Primary Action/Highlight
                    dark: '#333533',    // Jet - Secondary Text/Borders
                    darker: '#242423',  // Raisin Black - Sidebar/Headings
                }
            }
        },
    },
    plugins: [],
}
