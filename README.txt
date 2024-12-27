# Secure Journal Template
A TypeScript-based secure journaling platform template with user management and SQLite integration.

## Features
- User Authentication & Authorization
- Type-safe Database Integration
- Test Infrastructure
- Performance Monitoring
- Error Handling
- Logging System

## Quick Start
1. Clone the repository
2. Install dependencies:
   npm install

3. Initialize database:
   npm run db:generate
   npm run db:migrate

4. Run tests:
   npm test

5. Start development server:
   npm run dev

## Project Structure
src/
├── db/         # Database configuration and schemas
├── services/   # Business logic services
├── utils/      # Utility functions and helpers
├── tests/      # Test files
└── types/      # TypeScript type definitions

## Development
- npm run dev         - Start development server
- npm run build      - Build for production
- npm run test       - Run tests
- npm run db:generate - Generate database migrations
- npm run db:migrate  - Run database migrations

## Testing
Tests are written using Vitest. Run with:
npm test

## Database
Uses SQLite with Drizzle ORM for type-safe database access.

## Contributing
See CONTRIBUTING.txt for details. 