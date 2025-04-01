module.exports = {
  plugins: ["prettier-plugin-tailwindcss"],
  overrides: [
    {
      files: "*.html",
      options: {
        parser: "html",
      },
    },
    {
      files: "*.component.html",
      options: {
        parser: "angular",
      },
    },
  ],
  endOfLine: "auto"
};
