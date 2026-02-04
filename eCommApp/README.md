# The Daily Harvest

A small React + TypeScript + Vite demo storefront. It loads a product catalog from static JSON, supports adding items to a cart via React Context, and includes a simple admin portal flow for running a store-wide sale.

## ✨ Features

- Multi-page SPA routing (React Router): Home, Products, Cart, Admin Login, Admin Portal
- Product catalog loaded from `public/products/*.json`
- Product grid with stock status (Add to Cart disabled when out of stock)
- Cart state via React Context (add-to-cart increments quantity; checkout clears cart)
- Checkout confirmation modal and “order processed” summary view
- Product reviews modal (client-side only) for viewing and submitting reviews
- Admin demo flow: login with hardcoded credentials and set/end a “sale percent” value

## 🧭 Routes

| Route | Component | What it does |
| --- | --- | --- |
| `/` | `HomePage` | Landing page with linkable nav |
| `/products` | `ProductsPage` | Loads product JSON from `/products/*.json`, shows product grid, add to cart, opens reviews modal |
| `/cart` | `CartPage` | Shows cart contents, opens checkout confirmation modal, shows “order processed” summary after confirming |
| `/login` | `LoginPage` | Demo admin login (hardcoded credentials) |
| `/admin` | `AdminPage` | Demo admin portal for setting/ending a “sale percent” |

## 🏛️ How it works (architecture)

- **Runtime & routing**: `BrowserRouter` wraps the app, and routes are defined in `src/App.tsx`.
- **Data**: Products are static JSON files under `public/products/` and are fetched from the client (no backend).
- **State**:
   - Cart state lives in `CartContext` (`src/context/CartContext.tsx`) and is provided via `CartProvider`.
   - Reviews are stored in component state in `ProductsPage` (submissions update local state only).
   - Checkout “order processed” view takes a snapshot of cart items before clearing the cart.
- **Modals**: Checkout and Reviews use conditional rendering with a backdrop and content container.

## 🖼️ Screenshots

Add screenshots here to help new developers and reviewers quickly understand the UI:

- Home page
- Products grid
- Reviews modal
- Cart + checkout confirmation modal
- Order processed view
- Admin portal

## ✅ Scope / Limitations

- Demo app: data is static and changes are not persisted to a backend
- Authentication is intentionally simplistic for lab exercises

## 🚀 Getting Started

### Prerequisites

- Node.js (recommended: current LTS, Node 20+)
- npm (comes with Node) or yarn

> Note for Windows/PowerShell: if you see an error like “running scripts is disabled” when using `npm`, you can either:
> - Use `npm.cmd` instead of `npm` (example: `npm.cmd run dev`), or
> - Run `Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass -Force` once per terminal session.

### Installation

1. Navigate to the eCommApp directory:
   ```bash
   cd eCommApp
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

   For a clean, reproducible install (recommended when a lockfile is present):
   ```bash
   npm ci
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and visit `http://localhost:3000`

## 🏗️ Build & Preview

- Production build (outputs to `dist/`):
   ```bash
   npm run build
   ```

- Preview the production build locally (defaults to port 4173):
   ```bash
   npm run preview
   ```
   Then open `http://localhost:4173`

## 📁 Project Structure

```
eCommApp/
├── public/              # Static assets
├── src/
│   ├── components/      # Reusable React components
│   ├── types/          # TypeScript type definitions
│   ├── utils/          # Utility functions
│   ├── App.tsx         # Main App component
│   ├── App.css         # App styles
│   ├── main.tsx        # Application entry point
│   └── index.css       # Global styles
├── index.html          # HTML template
├── package.json        # Project dependencies
├── tsconfig.json       # TypeScript configuration
├── vite.config.ts      # Vite configuration
└── README.md          # This file
```

## 🛠️ Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run test` - Run tests in watch mode (Vitest)
- `npm run test:run` - Run tests once (CI-style)
- `npm run test:ui` - Run tests with the Vitest UI
- `npm run test:coverage` - Run tests and generate coverage output

## 🧪 Testing

This project uses:

- Vitest (test runner)
- React Testing Library (component testing)
- JSDOM (browser-like DOM environment for tests)

Test setup is configured in `vite.config.ts` and initialized via `src/test/setup.ts`.

### Test command examples

Run tests in watch mode (good while developing):

```bash
npm run test
```

Run tests once (good for CI / pre-push checks):

```bash
npm run test:run
```

Run a single test file:

```bash
npm run test:run -- src/components/CartPage.test.tsx
```

Run tests matching a name/pattern (the `-t` filter matches test names):

```bash
npm run test:run -- -t "displays cart items"
```

Open the Vitest UI:

```bash
npm run test:ui
```

Generate coverage output (text + `coverage/` HTML report):

```bash
npm run test:coverage
```

> Windows/PowerShell tip: if `npm` fails due to script execution policy, use `npm.cmd` instead, for example:
> ```bash
> npm.cmd run test:run
> ```

## 🧰 Troubleshooting

- **PowerShell says “running scripts is disabled” when running `npm`**
   - Use `npm.cmd` (example: `npm.cmd run test:run`), or
   - Run `Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass -Force` once per terminal session.

- **Install fails with “Unsupported engine” or native tool errors (Node too old)**
   - Upgrade Node to a current LTS (Node 20+ recommended) and retry.

- **Weird install/build issues after switching Node versions**
   - Do a clean reinstall:
      ```bash
      rmdir /s /q node_modules
      del package-lock.json
      npm install
      ```
