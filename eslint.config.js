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
//
//module.exports = {
//    extends: "@typescript-eslint/recommended",
//    parser: "@typescript-eslint/parser",
//    parserOptions: {
//        ecmaVersion: 2018,
//        sourceType: "module"
//    },
//    plugins: ["@typescript-eslint", "import"],
//    env: {
//        commonjs: true,
//        node: true,
//        es6: true
//    },
//    rules: {
//        "react/prop-types": 0,
//        "import/no-unresolved": 0, // [2, { commonjs: true, amd: true }],
//        "@typescript-eslint/explicit-function-return-type": "off",
//        "@typescript-eslint/explicit-module-boundary-types": "off",
//        "@typescript-eslint/ban-ts-comment": "off",
//        "@typescript-eslint/ban-ts-ignore": "off",
//        "@typescript-eslint/ban-types": "off",
//        "@typescript-eslint/no-use-before-define": 0,
//        "@typescript-eslint/no-unused-vars": getNoUnusedVars(),
//        "@typescript-eslint/no-var-requires": 0,
//        "@typescript-eslint/no-explicit-any": 0,
//        // Temporarily disable this rule
//        "@typescript-eslint/no-non-null-assertion": 0,
//        curly: ["error"]
//    },
//    settings: {
//        react: {
//            pragma: "React",
//            version: "detect"
//        }
//    },
//    ignores: [
//        "**/node_modules/",
//        "**/dist/",
//        "**/lib/",
//        "**/build/",
//        "**/.out/",
//        "**/*.d.ts",
//        "idea.js",
//        "scripts/**/*.js"
//    ],
//    globals: {
//        window: true,
//        document: true
//    }
//};
