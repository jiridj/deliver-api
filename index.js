// Configure the environment.
// Environment variables defined in .env file.
const dotenv = require('dotenv');
dotenv.config();

// Launch the DELIVER API app.
const App = require('./lib/app');
new App(process.env.DELIVER_API_PORT);
