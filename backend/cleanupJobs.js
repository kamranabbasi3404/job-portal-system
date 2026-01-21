import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Job from './models/Job.js';

// Load env vars
dotenv.config();

const cleanupJobs = async () => {
    try {
        console.log('Connecting to MongoDB...');

        // Connect to database with explicit options
        await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });

        console.log('✅ MongoDB Connected');

        // Get count before deletion
        const count = await Job.countDocuments();
        console.log(`\nFound ${count} jobs in database`);

        if (count > 0) {
            // List all jobs before deletion
            const jobs = await Job.find().populate('employer', 'name email');
            console.log('\nJobs to be deleted:');
            jobs.forEach((job, index) => {
                console.log(`${index + 1}. ${job.title} at ${job.company} (Employer: ${job.employer?.name || 'Unknown'})`);
            });

            // Delete all jobs
            const result = await Job.deleteMany({});
            console.log(`\n✅ Successfully deleted ${result.deletedCount} jobs`);
        } else {
            console.log('\n✅ No jobs found in database');
        }

        await mongoose.connection.close();
        console.log('\n✅ Database connection closed');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        await mongoose.connection.close();
        process.exit(1);
    }
};

cleanupJobs();

