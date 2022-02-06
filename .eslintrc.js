module.exports = {
    env: {
        browser: true,
        es6: true,
        node: true,
    },

    // the ts-eslint recommended ruleset sets the parser so we need to set it back
    parser: "vue-eslint-parser",

    parserOptions: {
        ecmaVersion: 2020,
        parser: "@typescript-eslint/parser",
        extraFileExtensions: [".vue"],
        ecmaFeatures: {
            jsx: true,
        },
        sourceType: "module",
    },

    plugins: ["@typescript-eslint"],

    extends: [
        "plugin:vue/vue3-essential",
        "eslint:recommended",
        "plugin:vue/vue3-strongly-recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:prettier/recommended",
        "plugin:vue/strongly-recommended",
        "plugin:vue/vue3-recommended",
        "plugin:vue/recommended",
    ],

    rules: {
        "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
        "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",

        // this rule, if on, would require explicit return type on the `render` function
        "@typescript-eslint/explicit-function-return-type": "off",
    },
    "vue/max-attributes-per-line": [
        2,
        {
            singleline: 20,
            multiline: {
                max: 1,
                allowFirstLine: false,
            },
        },
    ],
    overrides: [
        {
            files: ["*.js"],
            rules: {
                "@typescript-eslint/no-var-requires": "off",
            },
        },
    ],
};
