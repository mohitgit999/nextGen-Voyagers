require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Destination = require('./models/Destination');
const connectDB = require('./config/db');

// Read the js/data.js file to extract DESTINATIONS
const dataFilePath = path.join(__dirname, '..', 'js', 'data.js');
const dataFileContent = fs.readFileSync(dataFilePath, 'utf-8');

// Use a simple function to extract the DESTINATIONS array from the frontend script
let DESTINATIONS = [];
try {
  // We'll evaluate the data.js file content in a local scope
  const scriptContent = dataFileContent + '\n return DESTINATIONS;';
  const getDestinations = new Function(scriptContent);
  DESTINATIONS = getDestinations();
} catch (error) {
  console.error('Error parsing js/data.js:', error);
  process.exit(1);
}

const seedDatabase = async () => {
  try {
    await connectDB();

    console.log('Clearing existing destinations...');
    await Destination.deleteMany();

    console.log(`Seeding ${DESTINATIONS.length} destinations...`);
    
    // Process destinations to match the schema
    const destinationsToInsert = DESTINATIONS.map(dest => {
      return {
        id: dest.id,
        name: dest.name,
        state: dest.state,
        tags: dest.tags,
        icon: dest.icon,
        emoji: dest.emoji,
        rating: dest.rating,
        reviews: dest.reviews,
        cost: dest.cost,
        bestFor: dest.bestFor,
        blurb: dest.blurb,
        safety: dest.safety,
        dayThemes: dest.dayThemes,
        activities: dest.activities,
        weather: dest.weather,
        transport: dest.transport,
        localEmergency: dest.localEmergency,
        packingExtras: dest.packingExtras
      };
    });

    await Destination.insertMany(destinationsToInsert);

    console.log('Database seeded successfully!');
    process.exit();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
