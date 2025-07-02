const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// ✅ Middleware
app.use(cors());
app.use(bodyParser.json());

// ✅ MongoDB Connection
mongoose.connect("mongodb+srv://knikhil6293:D16ABAo7LnmGtpwY@cluster0.kpggf7v.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB connected'))
.catch((err) => console.error('❌ MongoDB connection error:', err));

// ✅ Expense Schema and Model
const expenseSchema = new mongoose.Schema({
  title: String,
  amount: Number,
});
const Expense = mongoose.model('Expense', expenseSchema);

// ✅ GET route to fetch all expenses


// ✅ POST route to add expense
app.post('/expenses', async (req, res) => {
  try {
    const { title, amount } = req.body;
    if (!title || isNaN(amount)) {
      return res.status(400).json({ message: 'Title and amount are required' });
    }
    const expense = new Expense({ title, amount });
    await expense.save();
    res.status(201).json(expense);
  } catch (error) {
    res.status(500).json({ message: 'Failed to save expense' });
  }
});

app.get('/expenses', async (req, res) => {
  try {
    const expenses = await Expense.find();
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch expenses' });
  }
});
// ✅ Start server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});

//mongodb+srv://knikhil6293:D16ABAo7LnmGtpwY@cluster0.kpggf7v.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {