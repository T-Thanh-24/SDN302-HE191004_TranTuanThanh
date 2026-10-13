require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const bookRoutes = require('./routes/bookRoutes');
const memberRoutes = require('./routes/memberRoutes');
const loanRoutes = require('./routes/loanRoutes');

const app = express();
app.use(express.json());

app.get('/', (req, res) => res.json({ message: 'Lab2 Library API is running' }));
app.use('/api/books', bookRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/loans', loanRoutes);

app.use((req, res) => res.status(404).json({ success: false, message: 'API endpoint not found' }));
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

const PORT = process.env.PORT || 9999;
connectDB().then(() => app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`)));
