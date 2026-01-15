# Pet Clinic Management Application

A Next.js application for managing pets in a clinic, built with React, MongoDB Atlas, and Tailwind CSS.

## Live Demo
The app can be found here:
[**https://pet-clinic-management.vercel.app**](https://pet-clinic-management.vercel.app)

## Features

- Single-page application with a responsive table of pets
- Modal for adding and editing pet records
- CRUD operations via Next.js API routes
- MongoDB Atlas for database storage
- Material-UI components for UI
- React Query for data fetching and caching
- React Table for displaying data
- Tailwind CSS for styling
- Keyboard accessible and responsive design

## Tech Stack

- **Framework:** Next.js (App Router)
- **Database:** MongoDB Atlas
- **Styling:** Tailwind CSS
- **UI Library:** Material-UI
- **Data Fetching:** React Query
- **Tables:** React Table
- **Language:** TypeScript

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB Atlas account (free tier available)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up MongoDB Atlas:
   - Create a cluster on [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Get your connection string
   - Create a `.env.local` file in the root directory:
     ```
     MONGODB_URI=your_mongodb_atlas_connection_string
     ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

- `src/app/` - Next.js App Router pages and API routes
- `src/components/` - React components (PetTable, PetModal, Providers)
- `src/lib/` - Utility functions (MongoDB connection)
- `src/models/` - Mongoose models
- `src/types/` - TypeScript type definitions

## API Routes

- `GET /api/pets` - Fetch all pets
- `POST /api/pets` - Create a new pet
- `GET /api/pets/[id]` - Fetch a specific pet
- `PUT /api/pets/[id]` - Update a pet
- `DELETE /api/pets/[id]` - Delete a pet

## Building for Production

```bash
npm run build
npm start
```

## Accessibility

The application is designed to be fully accessible:
- Keyboard navigation support
- ARIA labels and roles
- Responsive design for mobile and desktop
- High contrast colors

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

This project is licensed under the MIT License.
