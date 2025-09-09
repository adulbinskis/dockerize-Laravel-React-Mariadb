module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // all your React source files
    "./public/index.html"         // also scan index.html if needed
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1DA1F2',
        secondary: '#14171A',
      },
      spacing: {
        128: '32rem',
      },
    },
  },
  plugins: [],
}

