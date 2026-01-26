import mongoose from 'mongoose';
import dotenv from 'dotenv';
import CompanyProfile from './models/CompanyProfile.js';
import User from './models/User.js';
import connectDB from './config/db.js';

dotenv.config();

const checkCompanyProfiles = async () => {
    try {
        await connectDB();

        console.log('\n=== CHECKING ALL COMPANY PROFILES ===\n');

        // Get all employers
        const employers = await User.find({ role: 'employer' }).select('name email');
        console.log(`Found ${employers.length} employers\n`);

        for (const employer of employers) {
            console.log(`\n--- Employer: ${employer.name} (${employer.email}) ---`);

            const profile = await CompanyProfile.findOne({ user: employer._id });

            if (profile) {
                console.log(`✅ Company Profile exists`);
                console.log(`   Company Name: "${profile.companyName}"`);
                console.log(`   Industry: ${profile.industry || 'Not set'}`);
                console.log(`   Location: ${profile.location || 'Not set'}`);
                console.log(`   Last Updated: ${profile.updatedAt}`);
            } else {
                console.log(`❌ No company profile found`);
            }
        }

        console.log('\n=== END ===\n');
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

checkCompanyProfiles();
