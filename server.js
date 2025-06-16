import os from 'os';
import app from './src/app.js'; // assuming app.js is in the same directory
import { connectDB } from './src/config/database.js';


const PORT = 3000;
const HOST = '0.0.0.0';

// Function to get local IPv4 address
function getLocalIPAddress() {
  const interfaces = os.networkInterfaces();
  for (const iface of Object.values(interfaces)) {
    for (const details of iface) {
      if (details.family === 'IPv4' && !details.internal) {
        return details.address;
      }
    }
  }
  return 'localhost';
}

// Start server
app.listen(PORT, HOST, async () => {
    await connectDB();
  const ip = getLocalIPAddress();
  console.log(` Server running at: http://${ip}:${PORT}`);
});
