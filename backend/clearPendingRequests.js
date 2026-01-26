import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import PendingCompanyRequest from './models/PendingCompanyRequest.js';

dotenv.config();

const clearPendingRequests = async () => {
    try {
        await connectDB();

        console.log('\n=== CLEARING PENDING COMPANY REQUESTS ===\n');

        const count = await PendingCompanyRequest.countDocuments();
        console.log(`Found ${count} requests to delete...`);

        const result = await PendingCompanyRequest.deleteMany({});
        console.log(`✅ Deleted ${result.deletedCount} pending company requests`);

        console.log('\n=== DONE ===\n');
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

clearPendingRequests();
