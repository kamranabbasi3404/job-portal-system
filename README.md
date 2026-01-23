# HireFlow - Job Portal Platform

A modern, fully responsive job portal built with the MERN stack (MongoDB, Express.js, React, Node.js) and Tailwind CSS. HireFlow connects talented job seekers with employers through an intuitive, feature-rich platform.

## Features

### For Job Seekers
- 🔍 Advanced job search with filters
- 📝 One-click job applications
- 📊 Application tracking dashboard with interview details
- 👤 Professional profile management with resume upload
- ⭐ Save favorite jobs for later
- 📧 Application status notifications (Pending, Reviewing, Shortlisted, Interview Scheduled, Selected)
- � View company profiles and culture

### For Employers
- ✍️ Easy job posting and management
- 👥 Multi-stage applicant review workflow:
  - Shortlist candidates with internal notes
  - Schedule interviews (online or on-site)
  - Make final hiring decisions (Select/Reject)
- 🏢 Company profile with logo, mission, vision, and culture
- 📊 Analytics dashboard with job and application metrics
- 🔧 Full job editing capabilities
- 📈 View tracking and applicant counts

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
- Multer for file uploads
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
npm run dev
```

**4. Access the application**
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## Environment Variables

### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/hireflow
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
- `PATCH /api/applications/:id/shortlist` - Shortlist applicant
- `PATCH /api/applications/:id/schedule-interview` - Schedule interview
- `PATCH /api/applications/:id/final-decision` - Make final decision
- `DELETE /api/applications/:id` - Withdraw application

### Profile
- `GET /api/profile/me` - Get job seeker profile
- `PUT /api/profile/me` - Update job seeker profile
- `POST /api/profile/profile-picture` - Upload profile picture
- `POST /api/profile/resume` - Upload resume

### Company Profile
- `GET /api/company-profile/me` - Get company profile
- `PUT /api/company-profile/me` - Update company profile
- `POST /api/company-profile/profile-picture` - Upload company logo

### Companies
- `GET /api/companies` - Get all companies
- `GET /api/companies/:id` - Get company by ID

### Saved Jobs
- `GET /api/saved-jobs` - Get saved jobs
- `POST /api/saved-jobs/:jobId` - Save a job
- `DELETE /api/saved-jobs/:jobId` - Unsave a job

## Project Structure

```
Job-Portal/
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   │   └── common/   # Common UI components
│   │   ├── pages/        # Page components
│   │   │   ├── employer/ # Employer pages
│   │   │   └── jobseeker/ # Job seeker pages
│   │   ├── context/      # Context providers
│   │   ├── services/     # API services
│   │   └── App.jsx       # Main app component
│   └── package.json
│
└── backend/               # Express backend
    ├── models/           # Mongoose models
    │   ├── User.js
    │   ├── Job.js
    │   ├── Application.js
    │   ├── Profile.js
    │   └── CompanyProfile.js
    ├── controllers/      # Route controllers
    ├── routes/          # API routes
    ├── middleware/      # Custom middleware
    │   ├── auth.js
    │   ├── upload.js
    │   └── uploadImage.js
    ├── config/          # Configuration files
    ├── uploads/         # Uploaded files
    └── server.js        # Entry point
```

## Key Features in Detail

### Multi-Stage Hiring Workflow
HireFlow implements a professional recruitment process:
1. **Application Review** - Employers review submitted applications
2. **Shortlisting** - Add internal notes about promising candidates
3. **Interview Scheduling** - Set up online or on-site interviews with date/time
4. **Final Decision** - Select or reject candidates with optional notes

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
- Professional color schemes and gradients

### Job Management
- Create, read, update, delete jobs
- Advanced search and filtering
- Status management (active/closed)
- View and applicant tracking
- Dynamic company name updates

### Profile System
- **Job Seekers**: Skills, experience, education, resume upload
- **Employers**: Company info, logo, mission/vision, culture, benefits
- Profile picture uploads
- Rich profile data

### Application System
- One-click applications
- Application status tracking with detailed workflow states
- Interview detail notifications
- Accept/reject functionality
- Duplicate application prevention

## What Makes HireFlow Different

- ✅ **Professional Workflow** - Complete hiring lifecycle management
- ✅ **Rich Profiles** - Both job seekers and employers can showcase themselves
- ✅ **Interview Management** - Built-in interview scheduling system
- ✅ **Status Transparency** - Job seekers always know where they stand
- ✅ **Modern UI** - Beautiful, intuitive interface with smooth interactions
- ✅ **File Uploads** - Support for resumes and company logos

## Future Enhancements

This platform is ready for:
- 🤖 AI-powered job recommendations
- 📄 Resume parsing and analysis
- 📊 Skill gap identification
- 📈 Advanced analytics dashboard
- 📧 Email notifications system
- 💬 Real-time chat between employers and candidates
- 🔔 Push notifications
- 📱 Mobile app (React Native)

## License

MIT

## Author

Built with ❤️ using MERN Stack

---

**HireFlow** - Connecting Talent with Opportunity
