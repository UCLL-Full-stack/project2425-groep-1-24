/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './app/**/*.{js,ts,jsx,tsx,mdx}', // Note the addition of the `app` directory.
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',

        // Or if using `src` directory:
        './src/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                'primary-yellow': '#F5BD04',
            },
            fontFamily: {
                sans: ['Rubik Mono One', 'sans-serif'],
                barlow: ['Barlow', 'sans-serif'],
            },
            backgroundImage: {},
            screens: {
                sm: '420px',
                md: '640px',
                lg: '920px',
                xl: '1120px',
            },
        },
    },
    plugins: [],
};
