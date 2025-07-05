const form = document.getElementById('expense-form');
const titleInput = document.getElementById('title');
const amountInput = document.getElementById('amount');
const expenseList = document.getElementById('expense-list');
const totalSpan = document.getElementById('total');

let total = 0;

// ✅ Function to render one expense with delete button
function renderExpense(expense) {
  const li = document.createElement('li');
  li.textContent = `${expense.title} - ₹${expense.amount}`;

  const delBtn = document.createElement('button');
  delBtn.textContent = '❌';
  delBtn.style.marginLeft = '10px';
  delBtn.style.color = 'red';
  delBtn.style.cursor = 'pointer';

  // ✅ Delete handler
  delBtn.addEventListener('click', async () => {
    try {
      const res = await fetch(`https://expense-tracker-api-ugel.onrender.com/expenses/${expense._id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        li.remove();
        total -= expense.amount;
        totalSpan.textContent = total.toFixed(2);
      } else {
        console.error("Failed to delete:", res.status);
      }
    } catch (err) {
      console.error("Error deleting:", err);
    }
  });

  li.appendChild(delBtn);
  expenseList.appendChild(li);
}

// ✅ Submit new expense
form.addEventListener('submit', async function (e) {
  e.preventDefault();

  const title = titleInput.value.trim();
  const amount = parseFloat(amountInput.value);

  if (!title || isNaN(amount)) {
    alert("Please enter a valid title and amount");
    return;
  }

  try {
    const res = await fetch('https://expense-tracker-api-ugel.onrender.com/expenses', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ title, amount })
    });

    const contentType = res.headers.get("content-type");

    if (!res.ok) {
      console.error("❌ Server returned error:", res.status);
      const errorText = await res.text();
      console.error("❌ Error response body:", errorText);
      return;
    }

    if (contentType && contentType.includes("application/json")) {
      const data = await res.json();
      renderExpense(data); // 👈 add new expense to UI
      total += parseFloat(data.amount);
      totalSpan.textContent = total.toFixed(2);
    }
  } catch (err) {
    console.error("❌ Error adding expense:", err);
  }
});

// ✅ Load all expenses on page load
window.addEventListener('DOMContentLoaded', async () => {
  try {
    const res = await fetch("https://expense-tracker-api-ugel.onrender.com/expenses");
    if (!res.ok) throw new Error("Failed to fetch expenses");

    const expenses = await res.json();
    total = 0;

    expenses.forEach(expense => {
      renderExpense(expense); // 👈 reuse render function
      total += expense.amount;
    });

    totalSpan.textContent = total.toFixed(2);
  } catch (err) {
    console.error("❌ Error loading expenses:", err);
  }
});