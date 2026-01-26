import nodemailer from 'nodemailer';

let transporter = null;
let transporterInitialized = false;

// Create transporter - using environment variables for configuration
const getTransporter = () => {
    if (transporterInitialized) {
        return transporter;
    }

    transporterInitialized = true;

    // Check if email configuration exists
    if (process.env.EMAIL_HOST && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        console.log('✅ Email service configured with:', process.env.EMAIL_USER);
        transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT || 587,
            secure: process.env.EMAIL_SECURE === 'true',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });
        return transporter;
    }

    // Fallback: Log emails to console (development mode)
    console.log('⚠️  Email service not configured. Emails will be logged to console.');
    return null;
};

// Send email function
export const sendEmail = async ({ to, subject, html, text }) => {
    const emailData = {
        from: process.env.EMAIL_FROM || 'Job Portal <noreply@jobportal.com>',
        to,
        subject,
        html,
        text
    };

    const emailTransporter = getTransporter();

    if (emailTransporter) {
        try {
            const info = await emailTransporter.sendMail(emailData);
            console.log('✅ Email sent:', info.messageId);
            return { success: true, messageId: info.messageId };
        } catch (error) {
            console.error('❌ Email send error:', error);
            return { success: false, error: error.message };
        }
    } else {
        // Development mode - log to console
        console.log('\n📧 ========== EMAIL (CONSOLE MODE) ==========');
        console.log('To:', to);
        console.log('Subject:', subject);
        console.log('Body:', text || html);
        console.log('============================================\n');
        return { success: true, mode: 'console' };
    }
};

// Email templates
export const sendApprovalEmail = async (companyEmail, companyName) => {
    return sendEmail({
        to: companyEmail,
        subject: '🎉 Your Company Account Has Been Approved - Job Portal',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0;">
                    <h1 style="color: white; margin: 0; text-align: center;">Welcome to Job Portal!</h1>
                </div>
                <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
                    <h2 style="color: #333;">Congratulations, ${companyName}!</h2>
                    <p style="color: #666; line-height: 1.6;">
                        Great news! Your company account has been reviewed and approved by our admin team.
                    </p>
                    <p style="color: #666; line-height: 1.6;">
                        You can now log in to your account and start posting jobs to find the best talent for your organization.
                    </p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/login" 
                           style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                                  color: white; 
                                  padding: 15px 30px; 
                                  text-decoration: none; 
                                  border-radius: 5px;
                                  display: inline-block;">
                            Login to Your Account
                        </a>
                    </div>
                    <p style="color: #999; font-size: 12px; text-align: center;">
                        If you have any questions, please contact our support team.
                    </p>
                </div>
            </div>
        `,
        text: `Congratulations ${companyName}! Your company account has been approved. You can now log in at ${process.env.FRONTEND_URL || 'http://localhost:5173'}/login`
    });
};

export const sendRejectionEmail = async (companyEmail, companyName, reason = '') => {
    return sendEmail({
        to: companyEmail,
        subject: 'Company Account Application Status - Job Portal',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="background: #6c757d; padding: 30px; border-radius: 10px 10px 0 0;">
                    <h1 style="color: white; margin: 0; text-align: center;">Account Application Update</h1>
                </div>
                <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
                    <h2 style="color: #333;">Dear ${companyName},</h2>
                    <p style="color: #666; line-height: 1.6;">
                        Thank you for your interest in joining our Job Portal platform.
                    </p>
                    <p style="color: #666; line-height: 1.6;">
                        After careful review, we regret to inform you that your company account application could not be approved at this time.
                    </p>
                    ${reason ? `
                    <div style="background: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0;">
                        <strong>Reason:</strong> ${reason}
                    </div>
                    ` : ''}
                    <p style="color: #666; line-height: 1.6;">
                        If you believe this was a mistake or would like to submit additional documentation, 
                        please feel free to register again with updated information.
                    </p>
                    <p style="color: #999; font-size: 12px; text-align: center; margin-top: 30px;">
                        If you have any questions, please contact our support team.
                    </p>
                </div>
            </div>
        `,
        text: `Dear ${companyName}, Your company account application could not be approved. ${reason ? 'Reason: ' + reason : ''}`
    });
};

export default { sendEmail, sendApprovalEmail, sendRejectionEmail };
