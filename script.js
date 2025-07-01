const form = document.getElementById('expense-form');
const titleInput = document.getElementById('title');
const amountInput = document.getElementById('amount');
const expenseList = document.getElementById('expense-list');
const totalSpan = document.getElementById('total');

let total = 0;

form.addEventListener('submit', async function (e) {
  e.preventDefault(); // ✅ Prevent page refresh

  const title = titleInput.value.trim();
  const amount = parseFloat(amountInput.value);

  if (!title || isNaN(amount)) {
    alert("Please enter both a title and a valid amount.");
    return;
  }

  try {
    const res = await
      fetch('https://expense-tracker-api-ugel.onrender.com/expenses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ title, amount })
    });

    const data = await res.json();
    console.log("Expense added:", data);
    
    addExpenseToDOM(data);

    // Reset inputs
    titleInput.value = '';
    amountInput.value = '';
  } catch (err) {
    console.error("Error:", err);
  }
});

function addExpenseToDOM(expense) {
  const li = document.createElement('li');
  li.textContent = `${expense.title} - ₹${expense.amount}`;
  expenseList.appendChild(li);

  total += parseFloat(expense.amount);
  totalSpan.textContent = total.toFixed(2);
}