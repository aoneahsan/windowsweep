// @ts-check
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import react from '@eslint-react/eslint-plugin';
import globals from 'globals';

/**
 * 🔴 `eslint-plugin-react` never gained an ESLint 10 peer range, so this project
 * uses `@eslint-react/eslint-plugin` instead and pins eslint to ~9.39.5. That is
 * one plugin's problem, not a blanket block on ESLint 10.
 */
export default tseslint.config(
  { ignores: ['dist', 'src-tauri/target', 'design/**', 'public/prepaint.js'] },
  {
    // 🔴 Type-checked linting covers `src` ONLY. `eslint.config.js` and the build
    // scripts are not in a tsconfig project, and a type-aware rule loaded against
    // them fails ESLint outright rather than skipping the file.
    files: ['src/**/*.{ts,tsx}'],
    extends: [...tseslint.configs.recommendedTypeChecked],
    languageOptions: {
      ecmaVersion: 2023,
      globals: globals.browser,
      parserOptions: { projectService: true, tsconfigRootDir: import.meta.dirname },
    },
    plugins: { 'react-hooks': reactHooks },
    rules: {
      ...reactHooks.configs.recommended.rules,

      /* 🔴 `@eslint/js` is BANNED fleet-wide for broken versioning, so the core
         recommendations are not spread in from it. These are the ones this
         codebase actually needs; typescript-eslint's type-checked set covers the
         rest and supersedes several core rules outright. */
      eqeqeq: ['error', 'always', { null: 'ignore' }],
      'no-var': 'error',
      'prefer-const': 'error',
      'no-implicit-coercion': 'error',
      'no-throw-literal': 'off',
      '@typescript-eslint/only-throw-error': 'error',

      // 🔴 The house floor: one central logger, never console.
      'no-console': 'error',

      // Unused code is deleted, not renamed with an underscore. The three
      // exceptions the rule allows are the argsIgnorePattern below.
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_', caughtErrors: 'none' },
      ],
    },
  },
  {
    ...react.configs['recommended-typescript'],
    files: ['**/*.tsx'],
  },
  {
    /**
     * 🔴 THE i18n GATE.
     *
     * i18n debt is invisible to typecheck, lint, build and review - a project once
     * shipped three waves with `t()` called from ZERO files while a correct typed
     * i18n setup sat in the tree. So the project carries a gate that fails the
     * build, built from `no-restricted-syntax` AST selectors: no new dependency
     * for one rule.
     *
     * It is `error` from the first commit rather than `warn` first, because there
     * is no existing code to sweep - the app is being written against it.
     */
    files: ['src/**/*.tsx'],
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          // Literal text between JSX tags. Punctuation and single symbols are fine.
          selector: 'JSXText[value=/[A-Za-z]{2,}/]',
          message:
            'User-visible text must go through t(). Add a key to src/i18n/locales/en.json and render {t("key")}.',
        },
        {
          // A hard-coded string in an attribute a person actually reads or hears.
          selector:
            'JSXAttribute[name.name=/^(title|placeholder|alt|aria-label|aria-description|aria-placeholder|aria-roledescription|aria-valuetext)$/] > Literal[value=/[A-Za-z]{2,}/]',
          message:
            'This attribute is read aloud or shown. Use t() rather than a literal string.',
        },
        {
          selector:
            'JSXAttribute[name.name=/^(title|placeholder|alt|aria-label)$/] > JSXExpressionContainer > Literal[value=/[A-Za-z]{2,}/]',
          message:
            'This attribute is read aloud or shown. Use t() rather than a literal string.',
        },
      ],
    },
  },
  {
    files: ['scripts/**/*.mjs', 'eslint.config.js', 'vite.config.ts'],
    extends: [tseslint.configs.disableTypeChecked],
    languageOptions: { globals: globals.node },
    rules: { 'no-console': 'off' },
  },
);
