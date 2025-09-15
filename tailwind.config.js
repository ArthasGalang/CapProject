import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
            },
            colors: {
                background: "#FFFFFF",
                primary: "#2ECC71",    // Buttons, Highlights, Success State
                secondary: "#34980B",  // Links, Active State
                red: "#E74C3C",        // Warnings, Errors, Decline, Cancel
                orange: "#E7B53C",     // Secondary support color for red
                gray: {
                    DEFAULT: "#BDC3C7", // Borders
                    light: "#BDC3C7",
                    medium: "#5C6060",  // Borders/Text
                    dark: "#555555",    // Text
                },
            },
        },
    },

    plugins: [forms],
};
