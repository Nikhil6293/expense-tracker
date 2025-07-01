const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Middleware
app.use(cors({
  origin: '*', // Allow all origins for development (use specific domain in production)
  methods: ['GET', 'POST' , 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));
app.use(bodyParser.json());

// ✅ MongoDB Connection
mongoose.connect('mongodb+srv://knikhil6293:D16ABAo7LnmGtpwY@cluster0.kpggf7v.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB connected'))
.catch((err) => console.error('❌ MongoDB connection error:', err));

// ✅ Define Expense schema and model

const expenseSchema = new mongoose.Schema({
  title: String,
  amount: Number,
  date: {
    type: Date,
    default: Date.now
  }
});

const Expense = mongoose.model('Expense', expenseSchema);

// ✅ Routes

// Get all expenses
app.get('/expenses', async (req, res) => {
  try {
    const expenses = await Expense.find().sort({ date: -1 });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// Add a new expense
app.post('/expenses', async (req, res) => {
  try {
    const { title, amount } = req.body;

    if (!title || !amount) {
      return res.status(400).json({ message: "Title and amount are required" });
    }

    const expense = new Expense({ title, amount });
    await expense.save();

    res.status(201).json(expense);
  } catch (error) {
    console.error("❌ Error saving expense:", error.message);
    res.status(500).json({ message: "Failed to save expense", error: error.message });
  }
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});