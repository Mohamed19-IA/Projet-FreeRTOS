const express = require('express');
const mqtt = require('mqtt');
const serverless = require('serverless-http');

const app = express();
const router = express.Router();

let latestData = 'No data yet'; // Stocke la dernière donnée reçue

// Configuration du client MQTT avec l'IP et le port du broker Mosquitto
const mqttClient = mqtt.connect('mqtt://broker.hivemq.com:1883');

// Connexion au broker MQTT
mqttClient.on('connect', () => {
  console.log('Connecté au broker MQTT');
  mqttClient.subscribe('esp32/data'); // Abonnement au topic des données envoyées par l'ESP32
  console.log('Abonné au topic: esp32/data');
});

// Réception des messages MQTT
mqttClient.on('message', (topic, message) => {
  if (topic === 'esp32/data') {
    latestData = message.toString();
    console.log(`Données reçues : ${latestData}`);
  }
});

// Endpoint pour envoyer des commandes MQTT à l'ESP32
router.get('/send-command/:command', (req, res) => {
  const command = req.params.command;
  mqttClient.publish('esp32/commands', command); // Publication de la commande sur le topic 'esp32/commands'
  console.log(`Commande "${command}" envoyée à l'ESP32`);
  res.send(`Commande "${command}" envoyée à l'ESP32`);
});

// Endpoint pour récupérer la dernière donnée reçue du topic 'esp32/data'
router.get('/esp32-data', (req, res) => {
  res.json({ message: latestData });
});

app.use('/.netlify/functions/api', router);

module.exports.handler = serverless(app);
