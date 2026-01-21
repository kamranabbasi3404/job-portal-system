# Job Portal Platform

A modern, fully responsive job portal built with the MERN stack (MongoDB, Express.js, React, Node.js) and Tailwind CSS.

## Features

### For Job Seekers
- 🔍 Advanced job search with filters
- 📝 One-click job applications
- 📊 Application tracking dashboard
- 👤 Professional profile management
- 💼 Personalized job recommendations
- 📈 Profile completion tracker

### For Employers
- ✍️ Easy job posting
- 👥 Application management
- 📊 Analytics dashboard
- 🔧 Job editing and management
- ✅ Accept/reject applications
- 📈 View tracking

## Tech Stack

**Frontend:**
- React 18 with Vite
- Tailwind CSS
- React Router
- Axios
- Context API
- Lucide React Icons

**Backend:**
- Node.js with Express
- MongoDB with Mongoose
- JWT Authentication
- Bcrypt for password hashing
- CORS enabled

## Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)

### Installation

**1. Clone the repository**
```bash
git clone <repository-url>
cd Job-Portal
```

**2. Setup Backend**
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
npm run dev
```

**3. Setup Frontend**
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

**4. Access the application**
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## Environment Variables

### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/job-portal
JWT_SECRET=your-secret-key-here
NODE_ENV=development
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Jobs
- `GET /api/jobs` - Get all jobs (with filters)
- `GET /api/jobs/:id` - Get job by ID
- `POST /api/jobs` - Create job (Employer only)
- `PUT /api/jobs/:id` - Update job (Owner only)
- `DELETE /api/jobs/:id` - Delete job (Owner only)
- `GET /api/jobs/my-jobs` - Get employer's jobs

### Applications
- `POST /api/applications` - Apply for job (Job Seeker only)
- `GET /api/applications/my-applications` - Get user's applications
- `GET /api/applications/employer` - Get applications for employer
- `PATCH /api/applications/:id` - Update application status
- `DELETE /api/applications/:id` - Withdraw application

## Project Structure

```
Job-Portal/
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/        # Page components
│   │   ├── context/      # Context providers
│   │   ├── services/     # API services
│   │   └── App.jsx       # Main app component
│   └── package.json
│
└── backend/               # Express backend
    ├── models/           # Mongoose models
    ├── controllers/      # Route controllers
    ├── routes/          # API routes
    ├── middleware/      # Custom middleware
    ├── config/          # Configuration files
    ├── utils/           # Utility functions
    └── server.js        # Entry point
```

## Features in Detail

### Authentication & Authorization
- JWT-based authentication
- Role-based access control (Job Seeker / Employer)
- Protected routes
- Persistent sessions

### Responsive Design
- Mobile-first approach
- Fully responsive on all devices
- Modern, clean UI with Tailwind CSS
- Smooth animations and transitions

### Job Management
- Create, read, update, delete jobs
- Advanced search and filtering
- Status management (active/closed)
- View and applicant tracking

### Application System
- One-click applications
- Application status tracking
- Accept/reject functionality
- Duplicate application prevention

## Next Steps

This platform is ready for:
- AI-powered job recommendations
- Resume parsing and analysis
- Skill gap identification
- Advanced analytics
- Email notifications
- Real-time chat

## License

MIT

## Author

Built with ❤️ using MERN Stack
