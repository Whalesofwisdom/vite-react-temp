# Vite React TypeScript Template with Full Stack Setup

A modern, full-stack template for building secure web applications using:
- Vite + React + TypeScript
- Express.js backend
- SQLite with Drizzle ORM
- TailwindCSS
- ESLint
- Full TypeScript support
- Proper project structure

## Features
- ⚡️ Lightning fast HMR with Vite
- 🔒 Type-safe database operations with Drizzle ORM
- 🎨 Styling with TailwindCSS
- 📱 Responsive design ready
- 🔍 ESLint configuration
- 🗄️ SQLite database setup
- 🚀 Express.js API server
- 📁 Organized project structure

## Quick Start
1. Clone this template
2. Install dependencies:
   ```bash
   npm install
   ```
3. Initialize the database:
   ```bash
   npm run db:generate
   npm run db:migrate
   ```
4. Start development:
   ```bash
   # Terminal 1 - Frontend
   npm run dev
   
   # Terminal 2 - Backend
   npm run server
   ```

## Scripts
- `npm run dev` - Start frontend development server
- `npm run server` - Start backend server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run db:generate` - Generate database migrations
- `npm run db:migrate` - Run database migrations
- `npm run test` - Run tests

## Project Structure
```
├── src/              # Frontend source
├── server/           # Backend source
├── drizzle/          # Database migrations
├── public/           # Static assets
└── [config files]    # Various configuration files
```

## Customization
1. Update `package.json` with your project details
2. Modify `vite.config.ts` for build configuration
3. Adjust `tailwind.config.cjs` for styling
4. Update database schema in `src/db/schema.ts`

## License
MIT 