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

// Send shortlist notification email
export const sendShortlistEmail = async (applicantEmail, applicantName, jobTitle, companyName) => {
    return sendEmail({
        to: applicantEmail,
        subject: `🎉 Great News! You've Been Shortlisted - ${jobTitle}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); padding: 30px; border-radius: 10px 10px 0 0;">
                    <h1 style="color: white; margin: 0; text-align: center;">Congratulations!</h1>
                </div>
                <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
                    <h2 style="color: #333;">Hi ${applicantName}!</h2>
                    <p style="color: #666; line-height: 1.6;">
                        We're thrilled to inform you that your application for the position of 
                        <strong style="color: #28a745;">${jobTitle}</strong> at 
                        <strong>${companyName}</strong> has been <strong style="color: #28a745;">shortlisted</strong>!
                    </p>
                    <div style="background: #d4edda; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #28a745;">
                        <p style="color: #155724; margin: 0;">
                            🌟 You're one step closer to your dream job! The employer will reach out to you soon with more details about the next steps.
                        </p>
                    </div>
                    <p style="color: #666; line-height: 1.6;">
                        Please log in to your portal to view more details about your application status.
                    </p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/jobseeker/applications" 
                           style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); 
                                  color: white; 
                                  padding: 15px 30px; 
                                  text-decoration: none; 
                                  border-radius: 5px;
                                  display: inline-block;
                                  font-weight: bold;">
                            View Your Applications
                        </a>
                    </div>
                    <p style="color: #999; font-size: 12px; text-align: center;">
                        Best of luck with your application! - The Job Portal Team
                    </p>
                </div>
            </div>
        `,
        text: `Congratulations ${applicantName}! Your application for ${jobTitle} at ${companyName} has been shortlisted. Please log in to your portal to view more details.`
    });
};

// Send interview scheduled notification email
export const sendInterviewScheduledEmail = async (applicantEmail, applicantName, jobTitle, companyName, interviewDetails) => {
    const { type, dateTime, location, meetingLink } = interviewDetails;
    const formattedDate = new Date(dateTime).toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    const locationInfo = type === 'online'
        ? `<strong>Meeting Link:</strong> <a href="${meetingLink}" style="color: #667eea;">${meetingLink}</a>`
        : `<strong>Location:</strong> ${location}`;

    return sendEmail({
        to: applicantEmail,
        subject: `📅 Interview Scheduled - ${jobTitle} at ${companyName}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0;">
                    <h1 style="color: white; margin: 0; text-align: center;">Interview Scheduled!</h1>
                </div>
                <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
                    <h2 style="color: #333;">Hi ${applicantName}!</h2>
                    <p style="color: #666; line-height: 1.6;">
                        Great news! Your interview for the position of 
                        <strong style="color: #667eea;">${jobTitle}</strong> at 
                        <strong>${companyName}</strong> has been scheduled.
                    </p>
                    <div style="background: #e7e3ff; padding: 25px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea;">
                        <h3 style="color: #667eea; margin-top: 0;">📋 Interview Details</h3>
                        <p style="color: #333; margin: 10px 0;"><strong>Date & Time:</strong> ${formattedDate}</p>
                        <p style="color: #333; margin: 10px 0;"><strong>Type:</strong> ${type === 'online' ? '💻 Online Interview' : '🏢 On-site Interview'}</p>
                        <p style="color: #333; margin: 10px 0;">${locationInfo}</p>
                    </div>
                    <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0;">
                        <p style="color: #856404; margin: 0;">
                            ⏰ <strong>Reminder:</strong> Please be ready at least 10-15 minutes before the scheduled time.
                        </p>
                    </div>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/jobseeker/applications" 
                           style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                                  color: white; 
                                  padding: 15px 30px; 
                                  text-decoration: none; 
                                  border-radius: 5px;
                                  display: inline-block;
                                  font-weight: bold;">
                            View Full Details
                        </a>
                    </div>
                    <p style="color: #999; font-size: 12px; text-align: center;">
                        Good luck with your interview! - The Job Portal Team
                    </p>
                </div>
            </div>
        `,
        text: `Hi ${applicantName}! Your interview for ${jobTitle} at ${companyName} has been scheduled for ${formattedDate}. ${type === 'online' ? 'Meeting Link: ' + meetingLink : 'Location: ' + location}. Please log in to your portal for more details.`
    });
};

export default { sendEmail, sendApprovalEmail, sendRejectionEmail, sendShortlistEmail, sendInterviewScheduledEmail };
