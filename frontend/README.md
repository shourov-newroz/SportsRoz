# SportsRoz Frontend

A modern React application built with TypeScript, Ant Design, and Tailwind CSS, featuring a robust theming system and optimized performance.

## Features

- 🎨 Dynamic theme switching (Light/Dark mode)
- 🎯 Ant Design components with custom theming
- 🌈 Tailwind CSS for utility-first styling
- 📱 Responsive design
- ⚡ Optimized performance with code splitting
- 🔒 Type-safe development with TypeScript
- 🧩 Modular component architecture
- 🛡️ Error boundaries for graceful error handling

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn

## Getting Started

1. Clone the repository:

   ```bash
   git clone [repository-url]
   cd frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

The application will be available at `http://localhost:5173`.

## Project Structure

```
src/
├── components/        # Reusable UI components
│   ├── common/       # Shared components
│   ├── ui/           # Base UI components
│   ├── loading/      # Loading states
│   └── modals/       # Modal components
├── pages/            # Page components
├── contexts/         # React contexts
├── config/           # Configuration files
├── utils/            # Utility functions
├── hooks/            # Custom React hooks
└── styles/           # Global styles
```

## Theming System

The application uses a combination of CSS variables and Ant Design's theme tokens for consistent styling:

1. CSS Variables:

   - Defined in `src/config/theme.ts`
   - Supports both light and dark modes
   - Easily customizable through the theme configuration

2. Tailwind Integration:

   - Custom colors and styles mapped to CSS variables
   - Responsive utility classes
   - Dark mode support with `dark:` prefix

3. Ant Design Theme:
   - Customized through ConfigProvider
   - Synchronized with CSS variables
   - Supports component-level theming

To customize the theme:

1. Update variables in `src/config/theme.ts`
2. Modify `tailwind.config.js` for Tailwind-specific changes
3. Adjust Ant Design tokens in `src/App.tsx`

## Performance Optimization

- Code splitting with React.lazy and Suspense
- Image optimization with responsive images and WebP support
- Tree shaking enabled by default (Vite)
- CSS optimization with PurgeCSS
- Lazy loading for below-the-fold content

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## Dependencies

- React
- TypeScript
- Vite
- Ant Design
- Tailwind CSS (coming soon)
- ESLint with Airbnb config
- Prettier

## Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_URL=your_api_url_here
```

## Contributing

Please read our [Contributing Guide](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## Known Limitations

1. Image Optimization:

   - WebP support requires a proper image service in production
   - Local development uses URL parameters for demonstration

2. Theme Switching:
   - Theme changes trigger a brief flash during switching
   - Local storage used for theme persistence

## License

[Your License Here]

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
});
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from 'eslint-plugin-react';

export default tseslint.config({
  // Set the react version
  settings: { react: { version: '18.3' } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
  },
});
```
