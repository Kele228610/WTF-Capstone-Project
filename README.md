# WTF-Capstone-Project

Offline-first React learning platform built with Vite.

## Tech Stack
- React 19
- React Router
- Vite
- vite-plugin-pwa (Workbox)
- CSS Modules
- react-hook-form

## Getting Started
### Prerequisites
- Node.js 18+
- npm 9+

### Install
```bash
npm install
```

### Run Development Server
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Lint
```bash
npm run lint
```

## Current Routes
Defined in `src/app/routes.jsx`:
- `/` -> Home page
- `/signin` -> Sign in page

## PWA / Offline Support
Configured in `vite.config.js` using `vite-plugin-pwa`:
- Auto service worker registration and updates
- App manifest (`EduLearn Offline`)
- Installed app icons from `/public`
- Workbox fallback to `/index.html`

## Project Structure
```text
src/
  app/                # app bootstrapping and routing
  components/         # reusable UI and layout components
  features/           # feature pages (home, auth, lessons, settings, etc.)
  assets/             # icons and images
  styles/             # global/reset/theme variables
public/               # static PWA assets
```

## Repository
Remote: `https://github.com/Kele228610/WTF-Capstone-Project.git`
