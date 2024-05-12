const http = require('http');
const WebSocket = require('ws');
const { Client, Intents } = require('discord.js');
const fs = require('fs');


const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

// Discord bot token
const token = "MTIzODExNDEyMjQ3MDc4OTE4Mg.G67ZFR.1AlCDPontrngKKNSCJudIs0IpCmW-JQmu7yliY";

// Channel ID of the allowed channel
const allowedChannelId = "1238128042799271936";

// Variable to store the messages
const messages = [];

// Create an HTTP server
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.write('<!DOCTYPE html>');
  res.write('<html lang="en">');
  res.write('<head>');
  res.write('<meta charset="UTF-8">');
  res.write('<meta name="viewport" content="width=device-width, initial-scale=1.0">');
  res.write('<title>Discord Bot Web Interface</title>');
  res.write('</head>');
  res.write('<body>');
  res.write('<h1>Discord Bot Web Interface</h1>');
  res.write('<div id="message"></div>');
  res.write('<script>');
  res.write('const socket = new WebSocket("ws://localhost:8080");');
  res.write('socket.onmessage = function(event) {');
  res.write('document.getElementById("message").innerText = event.data;');
  res.write('};');
  res.write('</script>');
  res.write('</body>');
  res.write('</html>');
  res.end();
});

// Listen on port 8080
server.listen(8080, () => {
  console.log('HTTP server is running on port 8080');
});

// Create a WebSocket server
const wss = new WebSocket.Server({ server });

// Event listener for WebSocket connections
wss.on('connection', (ws) => {
  console.log('WebSocket client connected');
  // Send all stored messages to the connected client
  messages.forEach((msg) => {
    ws.send(msg);
  });
});

// Event listener for when the client is ready
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

// Event listener for incoming messages
// Event listener for incoming messages

client.on('messageCreate', (message) => {
        console.log("Message received:", message.content);
  
    // Check if the message is from the allowed channel
    if (message.channelId === allowedChannelId) {
      // Store the message content
      const content = (`shalom ${message.content}  hi `);
      messages.push(content);
      // Send the message to all connected WebSocket clients
      wss.clients.forEach(ws => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(content);
        }
      });
    }
  });
  

// Log in to Discord
client.login(token);
