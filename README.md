# CycleSync - Menstruation Tracking App

CycleSync is a comprehensive menstruation tracking application built with Next.js, Tailwind CSS, and Supabase. This application allows users to track their menstrual cycles, symptoms, moods, and more, providing valuable insights into their menstrual health.

## Features

- **User Authentication**: Secure login and registration using Supabase Auth
- **Cycle Tracking**: Log period start and end dates
- **Symptom Tracking**: Record and monitor symptoms experienced during cycles
- **Mood Tracking**: Keep track of mood changes throughout the month
- **Notes**: Add personal notes related to your menstrual health
- **Statistics**: View insights and patterns in your menstrual cycle
- **Reminders**: Set reminders for upcoming periods and medications

## Getting Started

### Prerequisites

- Node.js 18.0.0 or later
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:
   \`\`\`bash
   git clone https://github.com/yourusername/cyclesync.git
   cd cyclesync
   \`\`\`

2. Install dependencies:
   \`\`\`bash
   npm install
   # or
   yarn install
   \`\`\`

3. Set up environment variables:
   Create a `.env.local` file in the root directory with the following variables:
   \`\`\`
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   \`\`\`

4. Run the development server:
   \`\`\`bash
   npm run dev
   # or
   yarn dev
   \`\`\`

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Database Setup

Run the SQL commands in the `schema.sql` file to set up your Supabase database schema. This will create all the necessary tables and set up row-level security policies.

## Project Structure

- `/app`: Next.js app router pages and layouts
- `/components`: Reusable React components
- `/lib`: Utility functions and helpers
- `/public`: Static assets

## Technologies Used

- **Next.js**: React framework for building the frontend
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Supabase**: Backend as a service for database and authentication
- **TypeScript**: Type-safe JavaScript
- **Radix UI**: Unstyled, accessible UI components

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
\`\`\`

This README provides a comprehensive overview of the CycleSync application, including features, installation instructions, and project structure.
