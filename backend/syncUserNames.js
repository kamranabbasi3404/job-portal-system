import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import CompanyProfile from './models/CompanyProfile.js';
import connectDB from './config/db.js';

dotenv.config();

const syncUserNamesWithCompanyNames = async () => {
    try {
        await connectDB();

        console.log('\n=== SYNCING USER NAMES WITH COMPANY NAMES ===\n');

        // Get all employers
        const employers = await User.find({ role: 'employer' });
        console.log(`Found ${employers.length} employers\n`);

        for (const employer of employers) {
            const profile = await CompanyProfile.findOne({ user: employer._id });

            if (profile && profile.companyName && profile.companyName.trim() !== '') {
                const oldName = employer.name;
                const newName = profile.companyName;

                if (oldName !== newName) {
                    employer.name = newName;
                    await employer.save();
                    console.log(`✅ Synced: "${oldName}" → "${newName}"`);
                } else {
                    console.log(`⏭️  Already synced: "${oldName}"`);
                }
            } else {
                console.log(`⏭️  No company profile name for: ${employer.name}`);
            }
        }

        console.log('\n=== SYNC COMPLETE ===\n');
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

syncUserNamesWithCompanyNames();
