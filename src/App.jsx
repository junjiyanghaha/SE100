import React, { useState } from 'react';
import './App.css';

const App = () => {
  const [symbol, setSymbol] = useState('');
  const [quantity, setQuantity] = useState('');
  const [purchasePrice, setPurchasePrice] = useState('');
  const [stocks, setStocks] = useState([]);
  const [error, setError] = useState(null);

  const handleAddStock = async (e) => {
    e.preventDefault();

    if (!symbol || !quantity || !purchasePrice) {
      setError("Please fill out all fields");
      return;
    }

    setError(null);

    const apiKey = "FOVQUS1O91SK4SJY";
    const apiUrl = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=FOVQUS1O91SK4SJY`;

    try {
      const response = await fetch(apiUrl);
      const data = await response.json();

      if (data['Global Quote']) {
        const stockData = {
          symbol: symbol.toUpperCase(),
          quantity: Number(quantity),
          purchasePrice: Number(purchasePrice),
          currentPrice: Number(data['Global Quote']['05. price']),
        };

        setStocks([...stocks, stockData]);
        setSymbol('');
        setQuantity('');
        setPurchasePrice('');
      } else {
        setError('Stock symbol not found');
      }
    } catch (error) {
      setError('Error fetching stock data');
    }
  };

  const calculateProfitLoss = (quantity, purchasePrice, currentPrice) => {
    const totalPurchasePrice = quantity * purchasePrice;
    const totalCurrentValue = quantity * currentPrice;
    return totalCurrentValue - totalPurchasePrice;
  };

  return (
    <div className="app-container">
      <h1>Finance Dashboard</h1>
      <form onSubmit={handleAddStock} className="stock-form">
        <input
          type="text"
          placeholder="Stock Symbol"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Purchase Price"
          value={purchasePrice}
          onChange={(e) => setPurchasePrice(e.target.value)}
          required
        />
        <button type="submit">Add Stock</button>
      </form>

      {error && <p className="error">{error}</p>}

      <h2>Stock List</h2>
      {stocks.length === 0 ? (
        <p>No stocks added yet.</p>
      ) : (
        <ul className="stock-list">
          {stocks.map((stock, index) => {
            const profitLoss = calculateProfitLoss(
              stock.quantity,
              stock.purchasePrice,
              stock.currentPrice
            );
            const profitLossClass = profitLoss >= 0 ? 'profit' : 'loss';

            return (
              <li key={index}>
                <div className="stock-details">
                  <strong>Symbol: {stock.symbol}</strong>
                  <p>Quantity: {stock.quantity}</p>
                  <p>Purchase Price: ${stock.purchasePrice.toFixed(2)}</p>
                  <p>Current Price: ${stock.currentPrice.toFixed(2)}</p>
                  <p className={profitLossClass}>
                    Profit/Loss: {profitLoss >= 0 ? '+' : ''}${profitLoss.toFixed(2)}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default App;
