import User from '../models/User.js';
import Job from '../models/Job.js';
import CompanyProfile from '../models/CompanyProfile.js';

// @desc    Get all companies (employers)
// @route   GET /api/companies
// @access  Public
export const getCompanies = async (req, res) => {
    try {
        const { search } = req.query;
        let query = { role: 'employer' };

        // Get all employers
        const companies = await User.find(query)
            .select('name email phone createdAt')
            .sort({ createdAt: -1 });

        // Get job counts and profile data for each company
        const companiesWithJobs = await Promise.all(
            companies.map(async (company) => {
                const totalJobs = await Job.countDocuments({ employer: company._id });
                const activeJobs = await Job.countDocuments({
                    employer: company._id,
                    status: 'active'
                });

                // Fetch company profile
                const profile = await CompanyProfile.findOne({ user: company._id });

                const companyData = {
                    _id: company._id,
                    name: profile?.companyName || company.name,
                    email: profile?.email || company.email,
                    phone: profile?.phone || company.phone,
                    memberSince: company.createdAt,
                    totalJobs,
                    activeJobs,
                    profilePicture: profile?.profilePicture,
                    industry: profile?.industry,
                    location: profile?.location,
                    about: profile?.about
                };

                return companyData;
            })
        );

        // Apply search filter after fetching profiles
        let filteredCompanies = companiesWithJobs;
        if (search) {
            filteredCompanies = companiesWithJobs.filter(company =>
                company.name.toLowerCase().includes(search.toLowerCase())
            );
        }

        res.json(filteredCompanies);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get company profile with jobs
// @route   GET /api/companies/:id
// @access  Public
export const getCompanyById = async (req, res) => {
    try {
        const company = await User.findById(req.params.id)
            .select('name email phone createdAt role');

        if (!company || company.role !== 'employer') {
            return res.status(404).json({ message: 'Company not found' });
        }

        // Fetch company profile
        const profile = await CompanyProfile.findOne({ user: company._id });

        // Get job counts
        const totalJobs = await Job.countDocuments({ employer: company._id });
        const activeJobs = await Job.countDocuments({ employer: company._id, status: 'active' });

        // Get company's active jobs
        const jobs = await Job.find({ employer: company._id, status: 'active' })
            .sort({ createdAt: -1 });

        res.json({
            _id: company._id,
            name: profile?.companyName || company.name,
            email: profile?.email || company.email,
            phone: profile?.phone || company.phone,
            memberSince: company.createdAt,
            profilePicture: profile?.profilePicture,
            industry: profile?.industry,
            location: profile?.location,
            about: profile?.about,
            description: profile?.description,
            website: profile?.website,
            companySize: profile?.companySize,
            foundedYear: profile?.foundedYear,
            mission: profile?.mission,
            vision: profile?.vision,
            culture: profile?.culture,
            benefits: profile?.benefits,
            totalJobs,
            activeJobs,
            jobs
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
