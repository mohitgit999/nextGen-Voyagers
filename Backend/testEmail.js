require('dotenv').config();
const { sendEmail } = require('./server/utils/emailService');

(async () => {
  try {
    console.log('Attempting to send test email to:', process.env.EMAIL_FROM_ADDRESS);
    const info = await sendEmail({
      to: process.env.EMAIL_FROM_ADDRESS,
      subject: 'Test Email from NextGen Voyagers',
      text: 'This is a test email to verify that the Nodemailer configuration is working properly.',
      html: '<p>This is a test email to verify that the <strong>Nodemailer</strong> configuration is working properly.</p>'
    });
    console.log('✅ Email sent successfully:', info.messageId);
  } catch (error) {
    console.error('❌ Failed to send email:', error);
  }
})();
