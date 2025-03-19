# Football Match Scheduling Website

A full-stack web application for booking football matches at Premier League stadiums and viewing live scores.

## Features

- **User Authentication**: Email/password login using Supabase Auth
- **Match Scheduling**: Book matches at Premier League stadiums
- **Match Schedule Management**: View and filter match schedules
- **Live Scores & Match Results**: View live scores and match statistics
- **Match Predictions**: Get predictions for upcoming matches
- **Dark Mode Support**: Toggle between light and dark themes

## Tech Stack

- **Frontend**: React with Tailwind CSS
- **Backend**: Node.js with Express.js
- **Database**: Supabase (PostgreSQL)
- **State Management**: React Context API and Zustand
- **Form Handling**: React Hook Form
- **Routing**: React Router

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Set up Supabase:
   - Create a Supabase project
   - Run the SQL migrations in the `supabase/migrations` folder
   - Update the Supabase URL and anon key in `client/src/lib/supabase.js`

4. Start the development server:

```bash
npm run dev
```

## Project Structure

- `/client`: React frontend
  - `/src`: Source code
    - `/components`: Reusable UI components
    - `/contexts`: React context providers
    - `/pages`: Application pages
    - `/lib`: Utility functions and libraries
- `/server`: Express.js backend
  - `/routes`: API routes
- `/supabase`: Supabase configuration
  - `/migrations`: SQL migrations

## API Endpoints

- `GET /api/stadiums`: Get all stadiums
- `GET /api/matches`: Get all matches
- `POST /api/matches`: Create a new match booking
- `GET /api/scores`: Get live scores
- `GET /api/predictions`: Get match predictions

## License

MIT