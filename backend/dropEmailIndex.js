import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

dotenv.config();

const dropEmailIndex = async () => {
    try {
        await connectDB();

        console.log('\n=== DROPPING EMAIL INDEX ===\n');

        const db = mongoose.connection.db;
        const collection = db.collection('pendingcompanyrequests');

        // List all indexes
        const indexes = await collection.indexes();
        console.log('Current indexes:', indexes.map(i => i.name));

        // Try to drop email index
        try {
            await collection.dropIndex('email_1');
            console.log('✅ Dropped email_1 index');
        } catch (err) {
            console.log('No email_1 index to drop or error:', err.message);
        }

        console.log('\n=== DONE ===\n');
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

dropEmailIndex();
