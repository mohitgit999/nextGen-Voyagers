// server/utils/emailTemplates.js

const getWelcomeEmailTemplate = (name) => {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <style>
      body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7f6; margin: 0; padding: 0; }
      .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05); }
      .header { background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%); padding: 40px 20px; text-align: center; color: #ffffff; }
      .header h1 { margin: 0; font-size: 28px; letter-spacing: 1px; }
      .content { padding: 40px 30px; color: #333333; line-height: 1.6; }
      .content h2 { color: #1e3c72; margin-top: 0; }
      .btn { display: inline-block; padding: 12px 30px; margin-top: 20px; background-color: #ff6b6b; color: #ffffff; text-decoration: none; border-radius: 5px; font-weight: bold; }
      .footer { background-color: #f9f9f9; padding: 20px; text-align: center; font-size: 13px; color: #777777; border-top: 1px solid #eeeeee; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>NextGen Voyagers</h1>
      </div>
      <div class="content">
        <h2>Welcome aboard, ${name}! 🌍</h2>
        <p>We are absolutely thrilled to have you join the NextGen Voyagers community. Your journey towards safer, smarter, and more exciting travel begins right here.</p>
        <p>With our platform, you can explore new destinations, check real-time safety indices, and build personalized itineraries tailored just for you.</p>
        <center>
          <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}" class="btn">Explore Now</a>
        </center>
      </div>
      <div class="footer">
        <p>Stay Safe & Travel Far,<br>The NextGen Voyagers Team</p>
        <p><small>© ${new Date().getFullYear()} NextGen Voyagers. All rights reserved.</small></p>
      </div>
    </div>
  </body>
  </html>
  `;
};

const getLoginAlertTemplate = (name, time) => {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <style>
      body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7f6; margin: 0; padding: 0; }
      .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05); border-top: 5px solid #ffa502; }
      .content { padding: 40px 30px; color: #333333; line-height: 1.6; }
      .content h2 { color: #ffa502; margin-top: 0; }
      .details { background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #ffa502; }
      .footer { background-color: #f9f9f9; padding: 20px; text-align: center; font-size: 13px; color: #777777; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="content">
        <h2>New Login Detected</h2>
        <p>Hi ${name},</p>
        <p>We noticed a new login to your NextGen Voyagers account.</p>
        <div class="details">
          <p><strong>Time:</strong> ${time}</p>
        </div>
        <p>If this was you, you can safely ignore this email. If you don't recognize this activity, please contact our support team immediately.</p>
      </div>
      <div class="footer">
        <p>NextGen Voyagers Security Team</p>
      </div>
    </div>
  </body>
  </html>
  `;
};

const getItineraryEmailTemplate = (name, tripDetails) => {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <style>
      body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7f6; margin: 0; padding: 0; }
      .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05); }
      .header { background: linear-gradient(135deg, #10ac84 0%, #1dd1a1 100%); padding: 40px 20px; text-align: center; color: #ffffff; }
      .header h1 { margin: 0; font-size: 24px; }
      .content { padding: 40px 30px; color: #333333; line-height: 1.6; }
      .trip-card { background-color: #f8fbfa; border: 1px solid #e1f0ec; padding: 20px; border-radius: 8px; margin-top: 20px; }
      .trip-card h3 { color: #10ac84; margin-top: 0; border-bottom: 2px solid #1dd1a1; padding-bottom: 10px; display: inline-block;}
      .footer { background-color: #f9f9f9; padding: 20px; text-align: center; font-size: 13px; color: #777777; border-top: 1px solid #eeeeee; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>Your Itinerary is Ready! 🗺️</h1>
      </div>
      <div class="content">
        <p>Hi ${name},</p>
        <p>Great news! Your customized itinerary for <strong>${tripDetails.destination || 'your upcoming trip'}</strong> has been successfully saved to your account.</p>
        
        <div class="trip-card">
          <h3>Trip Details</h3>
          <p><strong>Destination:</strong> ${tripDetails.destination || 'N/A'}</p>
          <p><strong>Start Date:</strong> ${tripDetails.startDate ? new Date(tripDetails.startDate).toLocaleDateString() : 'N/A'}</p>
          <p><strong>End Date:</strong> ${tripDetails.endDate ? new Date(tripDetails.endDate).toLocaleDateString() : 'N/A'}</p>
          <p><strong>Group Size:</strong> ${tripDetails.travelers || 'N/A'}</p>
        </div>

        <p>Log in to NextGen Voyagers to view your full day-by-day plan, safety alerts, and activity recommendations.</p>
      </div>
      <div class="footer">
        <p>Happy Travels,<br>The NextGen Voyagers Team</p>
      </div>
    </div>
  </body>
  </html>
  `;
};

module.exports = {
  getWelcomeEmailTemplate,
  getLoginAlertTemplate,
  getItineraryEmailTemplate
};
