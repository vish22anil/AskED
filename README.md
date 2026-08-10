# AskED Platform

AskED is a question-answering platform connecting students and teachers.

## Setup Instructions

### Backend
1. Ensure you have PostgreSQL installed and running on port 5432.
2. Navigate to the `backend` directory.
3. Check the `.env` file and make sure the `DATABASE_URL` matches your local PostgreSQL configuration.
4. Run `npm install`
5. Run `npx prisma db push` to push the schema to the database.
6. Run `npm run db:seed` to seed the initial data.
7. Run `npm run dev` to start the backend server on port 3000.

### Frontend
1. Navigate to the root directory.
2. Run `npm install`
3. Run `npm run dev` to start the frontend on port 5173.

## Test Credentials (Seeded Data)

The backend includes a seed script that generates demo accounts with the password `password123`.

### Admin
- **Email:** admin@asked.com
- **Password:** password123

### Teachers
- **Email:** smith@asked.com
- **Password:** password123

### Students
- **Email:** student1@asked.com
- **Password:** password123
