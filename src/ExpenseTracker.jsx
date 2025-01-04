import { useRef, useState, useEffect } from "react";
import "./Expense.css";

const ExpenseTracker = () => {
  const inputRef = useRef(null);
  const expenseNameRef = useRef(null);
  const expenseAmountRef = useRef(null);

  const [budget, setBudget] = useState(() => {
    // Retrieve the budget from local storage, default to 0
    const savedBudget = localStorage.getItem("budget");
    return savedBudget ? parseFloat(savedBudget) : 0;
  });

  const [transactions, setTransactions] = useState(() => {
    // Retrieve transactions from local storage, default to an empty array
    const savedTransactions = localStorage.getItem("transactions");
    return savedTransactions ? JSON.parse(savedTransactions) : [];
  });

  // Save budget to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem("budget", budget);
  }, [budget]);

  // Save transactions to local storage whenever they change
  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [transactions]);

  const addBudget = () => {
    const newBudget = parseFloat(inputRef.current.value);
    if (!isNaN(newBudget) && newBudget > 0) {
      setBudget(newBudget);
      inputRef.current.value = "";
    }
  };

  const addExpense = () => {
    const name = expenseNameRef.current.value.trim();
    const amount = parseFloat(expenseAmountRef.current.value);

    if (name && !isNaN(amount) && amount > 0) {
      setTransactions([
        ...transactions,
        { name, amount },
      ]);
      expenseNameRef.current.value = "";
      expenseAmountRef.current.value = "";
    }
  };

  const deleteTransaction = (index) => {
    const updatedTransactions = transactions.filter((_, i) => i !== index);
    setTransactions(updatedTransactions);
  };

  const totalExpenses = transactions.reduce((total, item) => total + item.amount, 0);
  const balance = budget - totalExpenses;

  return (
    <div className="expenses">
      <div className="header">
        <h1>Expense Tracker</h1>
      </div>
      <div className="middle">
        <div className="income">
          <h2>My Income / Budget</h2>
          <p className="total-income" id="income">${budget.toFixed(2)}</p>
        </div>
        <div className="income">
          <h2>Balance</h2>
          <p className="balance-remaining">${balance.toFixed(2)}</p>
        </div>
        <div className="income">
          <h2>Expenses</h2>
          <p className="expenses-total-amount" id="expenses">${totalExpenses.toFixed(2)}</p>
        </div>
      </div>
      <div className="forms">
        <div className="set-budget-form">
          <h2 className="title">Set Budget / Income</h2>
          <label>Budget / Income:</label>
          <input
            type="number"
            id="budget"
            ref={inputRef}
            placeholder="Enter Budget..."
          />
          <button className="set-budget-btn" onClick={addBudget}>
            Set Budget
          </button>
        </div>
        <div className="set-expenses-form">
          <h2 className="title">Set Expenses</h2>
          <label>Name:</label>
          <input
            type="text"
            id="expense-name"
            ref={expenseNameRef}
            placeholder="Enter Expense Name"
          />
          <label>Amount:</label>
          <input
            type="number"
            id="expense-amount"
            ref={expenseAmountRef}
            placeholder="Enter Expense Amount"
          />
          <button className="set-budget-btn" onClick={addExpense}>
            Add Expense
          </button>
        </div>
        <div className="Transactions">
          <h2>Transactions</h2>
          <ol>
            {transactions.map((transaction, index) => (
              <li className="transaction-item" key={index}>
                <p>{transaction.name}</p>
                <span>${transaction.amount.toFixed(2)}</span>
                <button onClick={() => deleteTransaction(index)}>Delete</button>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
};

export default ExpenseTracker;
