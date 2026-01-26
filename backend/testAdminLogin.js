import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import connectDB from './config/db.js';

dotenv.config();

const testAdminLogin = async () => {
    try {
        await connectDB();

        // Find admin user
        const admin = await User.findOne({ email: 'admin@jobportal.com' });

        if (!admin) {
            console.log('❌ Admin user not found!');
            process.exit(1);
        }

        console.log('✅ Admin user found:');
        console.log('   Email:', admin.email);
        console.log('   Role:', admin.role);
        console.log('   Name:', admin.name);
        console.log('   Has Password:', !!admin.password);

        // Test password
        const testPassword = 'Admin@123456';
        const isMatch = await admin.matchPassword(testPassword);

        console.log('\n🔐 Password Test:');
        console.log('   Test Password:', testPassword);
        console.log('   Password Match:', isMatch ? '✅ YES' : '❌ NO');

        if (!isMatch) {
            console.log('\n⚠️  Password does not match! Resetting admin password...');
            admin.password = testPassword;
            await admin.save();
            console.log('✅ Admin password has been reset to: Admin@123456');
        }

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
};

testAdminLogin();
