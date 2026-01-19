import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
    // Force Light Mode as per user request
    const [theme] = useState('light');

    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove('dark');
        localStorage.removeItem('theme');
    }, []);

    const toggleTheme = () => { }; // No-op

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export const useTheme = () => useContext(ThemeContext);
