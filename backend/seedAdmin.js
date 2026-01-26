import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import connectDB from './config/db.js';

dotenv.config();

const seedAdmin = async () => {
    try {
        await connectDB();

        // Check if admin already exists
        const adminExists = await User.findOne({ email: 'admin@jobportal.com' });

        if (adminExists) {
            console.log('Admin user already exists');
            process.exit(0);
        }

        // Create admin user
        const admin = await User.create({
            name: 'Admin',
            email: 'admin@jobportal.com',
            password: 'Admin@123456',
            role: 'admin',
            phone: '0000000000',
            isVerified: true
        });

        console.log('Admin user created successfully');
        console.log('Email: admin@jobportal.com');
        console.log('Password: Admin@123456');

        process.exit(0);
    } catch (error) {
        console.error('Error seeding admin:', error);
        process.exit(1);
    }
};

seedAdmin();
