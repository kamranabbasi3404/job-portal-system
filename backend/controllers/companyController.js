import User from '../models/User.js';
import Job from '../models/Job.js';

// @desc    Get all companies (employers)
// @route   GET /api/companies
// @access  Public
export const getCompanies = async (req, res) => {
    try {
        const { search } = req.query;
        let query = { role: 'employer' };

        // Search by company name
        if (search) {
            query.name = { $regex: search, $options: 'i' };
        }

        // Get all employers
        const companies = await User.find(query)
            .select('name email phone createdAt')
            .sort({ createdAt: -1 });

        // Get job counts for each company
        const companiesWithJobs = await Promise.all(
            companies.map(async (company) => {
                const totalJobs = await Job.countDocuments({ employer: company._id });
                const activeJobs = await Job.countDocuments({
                    employer: company._id,
                    status: 'active'
                });

                return {
                    _id: company._id,
                    name: company.name,
                    email: company.email,
                    phone: company.phone,
                    memberSince: company.createdAt,
                    totalJobs,
                    activeJobs
                };
            })
        );

        res.json(companiesWithJobs);
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
            .select('name email phone createdAt');

        if (!company || company.role !== 'employer') {
            return res.status(404).json({ message: 'Company not found' });
        }

        // Get company's jobs
        const jobs = await Job.find({ employer: company._id, status: 'active' })
            .sort({ createdAt: -1 });

        res.json({
            _id: company._id,
            name: company.name,
            email: company.email,
            phone: company.phone,
            memberSince: company.createdAt,
            jobs
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
