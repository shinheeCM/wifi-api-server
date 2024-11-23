const express = require('express');
const os = require('os');
const axios = require('axios');
const { exec } = require('child_process');

const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// API endpoint to get available Wi-Fi networks
app.get('/api/wifi-networks', (req, res) => {
  exec('nmcli -t -f SSID,SIGNAL dev wifi', (err, stdout, stderr) => {
    if (err || stderr) {
      return res.status(500).json({ error: 'Failed to scan networks', details: stderr });
    }

    const networks = stdout
      .trim()
      .split('\n')
      .map((line) => {
        const [ssid, signal] = line.split(':');
        return { ssid, signal: parseInt(signal) };
      });

    res.json({ networks });
  });
});

// API endpoint to connect to a Wi-Fi network
app.post('/api/connect-wifi', (req, res) => {
  const { ssid, password } = req.body;

  if (!ssid || !password) {
    return res.status(400).json({ error: 'SSID and password are required' });
  }

  exec(`nmcli dev wifi connect "${ssid}" password "${password}"`, (err, stdout, stderr) => {
    if (err || stderr) {
      return res.status(500).json({ error: 'Failed to connect to Wi-Fi', details: stderr });
    }

    res.json({ message: `Successfully connected to ${ssid}` });
  });
});

// API endpoint to get local and public IP addresses
app.get('/api/ip-addresses', async (req, res) => {
  try {
    // Get local IP address
    const localIp = getLocalIp();

    // Get public IP address using ipify API
    const response = await axios.get('https://api.ipify.org?format=json');
    const publicIp = response.data.ip;

    res.json({ localIp, publicIp });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get IP addresses' });
  }
});

// GET API for System Information
app.get('/api/system-info', (req, res) => {
  exec('sudo dmidecode | grep -A 9 "System Information"', (error, stdout, stderr) => {
      if (error) {
          return res.status(500).json({ error: error.message });
      }
      if (stderr) {
          return res.status(500).json({ error: stderr });
      }

      // Parse the dmidecode output into an object
      const systemInfo = {};
      const lines = stdout.split('\n').filter(line => line.trim() !== '');

      lines.forEach(line => {
          const [key, ...valueParts] = line.split(':');
          if (key && valueParts.length) {
              systemInfo[key.trim()] = valueParts.join(':').trim();
          }
      });

      res.json(systemInfo);
  });
});

// Function to get local IP address
function getLocalIp() {
  const interfaces = os.networkInterfaces();
  let localIp = '';

  for (const iface in interfaces) {
    for (const details of interfaces[iface]) {
      if (details.family === 'IPv4' && !details.internal) {
        localIp = details.address;
        break;
      }
    }
    if (localIp) break;
  }

  return localIp || 'No local IP found';
}

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
