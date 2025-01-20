import React, { useState } from 'react';
import { Star, Trash2 } from 'lucide-react';

const Watchlist = () => {
  const [watchlist, setWatchlist] = useState([
    { symbol: 'BTC', name: 'Bitcoin', isFavorite: false },
    { symbol: 'ETH', name: 'Ethereum', isFavorite: false },
    { symbol: 'AAPL', name: 'Apple Inc.', isFavorite: false },
    { symbol: 'GOOGL', name: 'Alphabet Inc.', isFavorite: false },
    { symbol: 'MSFT', name: 'Microsoft', isFavorite: false },
    { symbol: 'AMZN', name: 'Amazon', isFavorite: false },
    { symbol: 'TSLA', name: 'Tesla', isFavorite: false },
    { symbol: 'META', name: 'Meta Platforms', isFavorite: false },
    { symbol: 'NVDA', name: 'NVIDIA', isFavorite: false },
    { symbol: 'SOL', name: 'Solana', isFavorite: false },
    { symbol: 'ADA', name: 'Cardano', isFavorite: false },
    { symbol: 'DOT', name: 'Polkadot', isFavorite: false },
    { symbol: 'NFLX', name: 'Netflix', isFavorite: false },
    { symbol: 'DIS', name: 'Disney', isFavorite: false },
    { symbol: 'PYPL', name: 'PayPal', isFavorite: false },
    { symbol: 'AMD', name: 'AMD', isFavorite: false },
    { symbol: 'UBER', name: 'Uber', isFavorite: false },
    { symbol: 'SPOT', name: 'Spotify', isFavorite: false },
    { symbol: 'COIN', name: 'Coinbase', isFavorite: false },
    { symbol: 'SNAP', name: 'Snap Inc.', isFavorite: false }
  ]);
  
  const [newCoin, setNewCoin] = useState('');

  const addToWatchlist = (e) => {
    e.preventDefault();
    if (newCoin) {
      setWatchlist([...watchlist, { 
        symbol: newCoin, 
        name: newCoin,
        isFavorite: false 
      }]);
      setNewCoin('');
    }
  };

  const removeFromWatchlist = (symbol) => {
    setWatchlist(watchlist.filter(coin => coin.symbol !== symbol));
  };

  const toggleFavorite = (symbol) => {
    setWatchlist(watchlist.map(coin => 
      coin.symbol === symbol 
        ? { ...coin, isFavorite: !coin.isFavorite }
        : coin
    ));
  };

  const sortedWatchlist = [...watchlist].sort((a, b) => {
    if (a.isFavorite === b.isFavorite) return 0;
    return a.isFavorite ? -1 : 1;
  });

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">My Watchlist</h2>
      
      <form onSubmit={addToWatchlist} className="mb-4 flex gap-2">
        <input
          type="text"
          value={newCoin}
          onChange={(e) => setNewCoin(e.target.value)}
          placeholder="Add coin (e.g. BTC)"
          className="p-2 border rounded flex-1"
        />
        <button 
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add
        </button>
      </form>

      {/* Scrollable list with custom scrollbar */}
      <div className="space-y-2 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
        {sortedWatchlist.map((coin) => (
          <div 
            key={coin.symbol}
            className="flex items-center justify-between p-3 bg-blue-50 rounded hover:bg-blue-100"
          >
            <div className="flex items-center gap-2">
              <button
                onClick={() => toggleFavorite(coin.symbol)}
                className={`transition-colors duration-200 ${
                  coin.isFavorite ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500'
                }`}
              >
                <Star className="w-4 h-4" fill={coin.isFavorite ? "currentColor" : "none"} />
              </button>
              <span className="text-gray-500">{coin.name}</span>
              <span className="text-gray-500">({coin.symbol})</span>
            </div>
            <button
              onClick={() => removeFromWatchlist(coin.symbol)}
              className="text-red-500 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
      `}</style>
    </div>
  );
};

export default Watchlist;