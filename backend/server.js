const express = require('express');
const cors = require('cors');
const fileRoutes = require('./route/file');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// Mount file routes
app.use('/api/files', fileRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});