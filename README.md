# Quantx - Trading Dashboard

A modern, feature-rich trading dashboard built with React, TypeScript, Vite, and Tailwind CSS.

## Features

- **Dashboard**: Real-time market overview and portfolio summary
- **Markets**: Browse and analyze market leaders
- **Portfolio**: Track and manage your investment positions
- **Stock Screener**: Find trading opportunities with customizable filters
- **Analytics**: Advanced charting and technical analysis tools
- **Terminal**: Command-line interface for quick operations
- **Real-time Updates**: WebSocket support for live data
- **Dark Theme**: Professional dark-themed UI for extended viewing

## Project Structure

```
quantx/
├── src/
│   ├── components/
│   │   ├── charts/     # Chart components (Candlestick, Area, Heatmap, Gauge)
│   │   ├── layout/     # Layout components (Navbar, Sidebar, StatusBar)
│   │   └── ui/         # Reusable UI components (Button, Card, Modal, etc)
│   ├── context/        # React Context for theme management
│   ├── hooks/          # Custom React hooks
│   ├── pages/          # Page components
│   ├── types/          # TypeScript type definitions
│   ├── utils/          # Utility functions and mock data
│   ├── App.tsx         # Main App component
│   ├── main.tsx        # Entry point
│   └── index.css       # Global styles with Tailwind
├── index.html          # HTML entry point
├── package.json        # Project dependencies
├── tsconfig.json       # TypeScript configuration
├── vite.config.ts      # Vite configuration
├── tailwind.config.ts  # Tailwind CSS configuration
└── postcss.config.js   # PostCSS configuration
```

## Installation

1. Install Node.js (v16 or higher)
2. Install dependencies:
   ```bash
   npm install
   ```

## Development

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Build

Build for production:

```bash
npm run build
```

## Preview

Preview the production build:

```bash
npm run preview
```

## Technologies

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **PostCSS** - CSS processing

## License

MIT
