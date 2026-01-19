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
                    base: '#f0f9ff',    // Sky 50 - Very light, airy blue tint
                    surface: '#ffffff', // White - Clean cards
                    accent: '#4f46e5',  // Indigo 600 - Vibrant, energetic
                    dark: '#e0e7ff',    // Indigo 100 - Soft borders
                    darker: '#1e1b4b',  // Indigo 950 - Deep rich text
                }
            }
        },
    },
    plugins: [],
}
