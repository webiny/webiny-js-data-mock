// eslint-disable-next-line
const eslint = require("@eslint/js");
// eslint-disable-next-line
const tseslint = require("typescript-eslint");

// eslint-disable-next-line
module.exports = tseslint.config(eslint.configs.recommended, ...tseslint.configs.recommended, {
    ignores: [
        "**/node_modules/",
        "**/dist/",
        "**/lib/",
        "**/build/",
        "**/.out/",
        "**/*.d.ts",
        "idea.js",
        "scripts/**/*.js"
    ]
});
