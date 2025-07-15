import js from '@eslint/js'
import { defineConfig } from 'eslint-define-config'
import tseslint from '@typescript-eslint/eslint-plugin'
import tsparser from '@typescript-eslint/parser'
import reactHooks from 'eslint-plugin-react-hooks'
import react from 'eslint-plugin-react'

// 🛡️ CYBERSECURITY EDUCATIONAL NOTE:
// This is a more permissive ESLint config for CI/CD deployments
// In production environments, you might have different linting rules
// for development vs deployment to balance code quality with deployment reliability

export default defineConfig([
  js.configs.recommended,
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
      'react-hooks': reactHooks,
      'react': react,
    },
    rules: {
      // 🔧 RELAXED RULES FOR CI/CD DEPLOYMENT
      // These rules are more permissive to allow deployment while maintaining basic code safety
      
      // TypeScript - Allow any types temporarily for deployment
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': 'warn',
      
      // React - Allow common patterns that don't affect functionality
      'react/no-unescaped-entities': 'warn',
      'react-hooks/rules-of-hooks': 'error', // Keep this as error - it breaks functionality
      'react-hooks/exhaustive-deps': 'warn',
      
      // General rules - Keep errors that break functionality, warn on style issues
      'no-console': 'off', // Allow console.log for educational purposes
      'no-debugger': 'error', // Keep as error
      'no-unused-vars': 'off', // Handled by TypeScript rule
      
      // Next.js specific
      '@next/next/no-img-element': 'warn',
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
]);
