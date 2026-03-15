// // start server
// require('dotenv').config();
// const app = require('./src/app');
// const connectDB = require('./src/db/db');

// connectDB();

// app.listen(3000, () => {
//     console.log('Server is running on port 3000');
// })

require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/db/db');

const PORT = process.env.PORT || 3000;

async function startServer() {
    try {
        await connectDB();
        console.log("Database connected successfully");

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });

    } catch (error) {
        console.error("Server failed to start:", error);
        process.exit(1);
    }
}

startServer();