const mongoose = require('mongoose');

// Backend/src/database.js
// Connect to MongoDB using mongoose. Exports an async connect function.

require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/';

async function connectDB() {
    try {
        // optional settings to avoid deprecation warnings
        await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected:', MONGO_URI);
    } catch (err) {
        console.error('MongoDB connection error:', err);
        // exit so process managers can restart if needed
        process.exit(1);
    }
}

// graceful shutdown
mongoose.connection.on('disconnected', () => {
    console.warn('MongoDB disconnected');
});

process.on('SIGINT', async () => {
    await mongoose.disconnect();
    process.exit(0);
});

module.exports = connectDB;