module.exports = {
  plugins: [
    require('tailwindcss'),
    require('autoprefixer'),
    process.env.NODE_ENV === 'production'
      ? require('@fullhuman/postcss-purgecss')({
          content: ['./src/**/*.{js,jsx,ts,tsx}', './index.html'],
          defaultExtractor: (content) => content.match(/[\w-/:]+(?<!:)/g) || [],
          safelist: {
            standard: [/^ant-/, /^dark:/, /^light:/, /^hover:/, /^focus:/, /^active:/],
            deep: [/ant-.*/, /dark:.*/, /light:.*/, /hover:.*/, /focus:.*/, /active:.*/],
          },
        })
      : false,
  ].filter(Boolean),
}; 