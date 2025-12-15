const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Create email transporter
const createTransporter = () => {
    const smtp_host = process.env.SMTP_HOST || 'smtp.mailtrap.io';
    const smtp_port = process.env.SMTP_PORT || 2525;
    const smtp_user = process.env.SMTP_USER;
    const smtp_password = process.env.SMTP_PASSWORD;

    if (!smtp_user || !smtp_password) {
        console.warn('⚠️  Email credentials not configured. Email service will not work.');
        return null;
    }

    return nodemailer.createTransport({
        host: smtp_host,
        port: smtp_port,
        auth: {
            user: smtp_user,
            pass: smtp_password
        }
    });
};

let transporter = createTransporter();

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        service: 'email-service',
        timestamp: new Date().toISOString(),
        emailConfigured: !!transporter
    });
});

// Send password reset email endpoint
app.post('/send-reset-password-email', async (req, res) => {
    try {
        const { email, reset_link } = req.body;

        // Validate inputs
        if (!email || !reset_link) {
            return res.status(400).json({
                success: false,
                message: 'Email and reset_link are required'
            });
        }

        // Check if transporter is configured
        if (!transporter) {
            console.warn('Email transporter not configured');
            return res.status(503).json({
                success: false,
                message: 'Email service not configured'
            });
        }

        // Prepare email
        const mailOptions = {
            from: process.env.SENDER_EMAIL || 'noreply@vietnamurbanquest.com',
            to: email,
            subject: 'Password Reset Request - Vietnam UrbanQuest',
            html: `
            <html>
              <body style="font-family: Arial, sans-serif; background-color: #f5f5f5;">
                <div style="max-width: 600px; margin: 20px auto; background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                  <div style="text-align: center; margin-bottom: 30px;">
                    <h1 style="color: #667eea; margin: 0;">Vietnam UrbanQuest</h1>
                    <p style="color: #666; margin: 10px 0 0 0;">Password Reset Request</p>
                  </div>
                  
                  <p style="color: #333; font-size: 16px; line-height: 1.6;">Hello,</p>
                  
                  <p style="color: #333; font-size: 16px; line-height: 1.6;">
                    We received a request to reset your password. Click the button below to proceed:
                  </p>
                  
                  <div style="text-align: center; margin: 30px 0;">
                    <a href="${reset_link}" style="background-color: #667eea; color: white; padding: 14px 40px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block; font-size: 16px;">
                      Reset Password
                    </a>
                  </div>
                  
                  <p style="color: #666; font-size: 14px; line-height: 1.6;">
                    Or copy and paste this link in your browser:
                  </p>
                  
                  <p style="color: #667eea; font-size: 13px; word-break: break-all; background-color: #f9f9f9; padding: 10px; border-radius: 4px;">
                    <a href="${reset_link}" style="color: #667eea; text-decoration: none;">
                      ${reset_link}
                    </a>
                  </p>
                  
                  <hr style="border: none; border-top: 1px solid #eee; margin: 25px 0;">
                  
                  <p style="color: #999; font-size: 13px; line-height: 1.6;">
                    This password reset link will expire in <strong>10 minutes</strong>. If you did not request a password reset, please ignore this email and your password will remain unchanged.
                  </p>
                  
                  <p style="color: #999; font-size: 13px; line-height: 1.6;">
                    If you have any questions, please contact our support team.
                  </p>
                  
                  <div style="border-top: 1px solid #eee; padding-top: 20px; margin-top: 20px; text-align: center;">
                    <p style="color: #999; font-size: 12px; margin: 0;">
                      © 2025 Vietnam UrbanQuest. All rights reserved.
                    </p>
                  </div>
                </div>
              </body>
            </html>
            `
        };

        // Send email
        const info = await transporter.sendMail(mailOptions);

        console.log(`✅ Email sent to ${email}:`, info.messageId);

        res.json({
            success: true,
            message: 'Password reset email sent successfully',
            messageId: info.messageId
        });

    } catch (error) {
        console.error('❌ Email sending error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to send email',
            error: error.message
        });
    }
});

// Send custom email endpoint (for future use)
app.post('/send-email', async (req, res) => {
    try {
        const { to, subject, html } = req.body;

        if (!to || !subject || !html) {
            return res.status(400).json({
                success: false,
                message: 'to, subject, and html are required'
            });
        }

        if (!transporter) {
            return res.status(503).json({
                success: false,
                message: 'Email service not configured'
            });
        }

        const info = await transporter.sendMail({
            from: process.env.SENDER_EMAIL || 'noreply@vietnamurbanquest.com',
            to,
            subject,
            html
        });

        console.log(`✅ Email sent to ${to}:`, info.messageId);

        res.json({
            success: true,
            message: 'Email sent successfully',
            messageId: info.messageId
        });

    } catch (error) {
        console.error('❌ Email sending error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to send email',
            error: error.message
        });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Email Service running on http://localhost:${PORT}`);
    console.log(`📧 Health check: GET http://localhost:${PORT}/health`);
    console.log(`📬 Send reset email: POST http://localhost:${PORT}/send-reset-password-email`);
    if (transporter) {
        console.log('✅ Email transporter configured');
    } else {
        console.log('⚠️  Email transporter NOT configured - set SMTP credentials');
    }
});
