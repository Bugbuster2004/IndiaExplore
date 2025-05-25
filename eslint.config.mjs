import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // Add an ignores configuration
  {
    ignores: [
      'node_modules/**',
      '.next/**',
      'public/**',
      'src/app/generated/**',
      'dist/**',
      'build/**'
    ]
  },
  
  // Keep your existing configuration
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  
  // Add custom rules to turn some errors into warnings
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': 'warn',
      'react-hooks/exhaustive-deps': 'warn',
      '@next/next/no-img-element': 'warn'
    }
  }
];

export default eslintConfig;