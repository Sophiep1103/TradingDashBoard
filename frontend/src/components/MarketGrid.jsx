import React from 'react';
import { TrendingUp, TrendingDown, Star } from 'lucide-react';

const MarketGrid = ({ stocks, onSelectStock, favorites, onToggleFavorite }) => {
  // Mock price changes - in real app would come from API
  const getPriceChange = () => {
    const changes = [-2.5, 1.8, 3.2, -1.5, 0.8];
    return changes[Math.floor(Math.random() * changes.length)];
  };

  // Mock current prices - in real app would come from API
  const getCurrentPrice = (symbol) => {
    const basePrice = {
      'BTC': 45000,
      'ETH': 2800,
      'AAPL': 175,
      'GOOGL': 2600,
      'MSFT': 350,
    }[symbol] || 100 + Math.random() * 100;
    
    return basePrice * (1 + (Math.random() * 0.02 - 0.01));
  };

  // Sort stocks to show favorites first
  const sortedStocks = [...stocks].sort((a, b) => {
    const aFav = favorites.includes(a.symbol);
    const bFav = favorites.includes(b.symbol);
    if (aFav === bFav) return 0;
    return aFav ? -1 : 1;
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
      {sortedStocks.map((stock) => {
        const price = getCurrentPrice(stock.symbol);
        const priceChange = getPriceChange();
        const isFavorite = favorites.includes(stock.symbol);
        
        return (
          <div
            key={stock.symbol}
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-start gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavorite(stock.symbol);
                  }}
                  className={`transition-colors duration-200 ${
                    isFavorite ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500'
                  }`}
                >
                  <Star className="w-5 h-5" fill={isFavorite ? "currentColor" : "none"} />
                </button>
                <div
                  className="cursor-pointer"
                  onClick={() => onSelectStock(stock.symbol)}
                >
                  <h3 className="text-lg font-bold text-gray-800">{stock.name}</h3>
                  <p className="text-sm text-gray-500">{stock.symbol}</p>
                </div>
              </div>
              <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-sm ${
                priceChange >= 0 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {priceChange >= 0 ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
                {Math.abs(priceChange)}%
              </div>
            </div>
            
            <div 
              className="cursor-pointer"
              onClick={() => onSelectStock(stock.symbol)}
            >
              <div className="text-2xl font-bold text-gray-900">
                ${price.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}
              </div>
              
              <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                <div className="text-gray-500">24h Volume</div>
                <div className="text-right font-medium">
                  {(Math.random() * 1000).toFixed(1)}K
                </div>
                <div className="text-gray-500">Market Cap</div>
                <div className="text-right font-medium">
                  ${(Math.random() * 1000).toFixed(1)}B
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MarketGrid;