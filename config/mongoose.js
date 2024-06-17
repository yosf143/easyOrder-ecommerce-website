// config/mongoose.js
const mongoose = require('mongoose');

 
const dbLink = process.env.MONGODB_LINK 

mongoose.connect(dbLink, {
  dbName: 'easyOrder'
}).then(() => {
  console.log('Connected to MongoDB server');
}).catch((err) => {
  console.error('Failed to connect to MongoDB server:', err);
});

module.exports = mongoose;


 