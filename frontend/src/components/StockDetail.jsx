import React, { useState, useEffect } from 'react';
import { ArrowUp, ArrowDown, ArrowLeft } from 'lucide-react';
import PriceChart from './PriceChart';

const StockDetail = ({ symbol, onClose }) => {
  const [stockData, setStockData] = useState({
    price: null,
    change: null,
    volume: null,
    high: null,
    low: null,
  });

  useEffect(() => {
    const fetchCurrentPrice = async () => {
      try {
        const response = await fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol}USDT`);
        if (!response.ok) throw new Error('Failed to fetch data');
        
        const data = await response.json();
        setStockData({
          price: parseFloat(data.lastPrice),
          change: parseFloat(data.priceChangePercent),
          volume: parseFloat(data.volume).toLocaleString(),
          high: parseFloat(data.highPrice),
          low: parseFloat(data.lowPrice),
        });
      } catch (error) {
        console.error('Error fetching price:', error);
        setStockData({
          price: 150.25,
          change: 2.5,
          volume: "1.2M",
          high: 152.30,
          low: 148.90,
        });
      }
    };

    fetchCurrentPrice();
    const interval = setInterval(fetchCurrentPrice, 10000);
    return () => clearInterval(interval);
  }, [symbol]);

  return (
<div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center p-4 z-50 overflow-y-auto">
<div className="bg-white rounded-lg w-full max-w-4xl p-4 my-8"> {/* Changed max-w-6xl to max-w-4xl and p-6 to p-4 */}
        {/* Header with Back Button */}
        <div className="flex items-center justify-between mb-4">  {/* Changed mb-6 to mb-4 */}
          <div className="flex items-center gap-4">
            <button 
              onClick={onClose}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              <span>Back</span>
            </button>
            <h2 className="text-xl font-bold">{symbol}</h2>  {/* Changed text-2xl to text-xl */}
          </div>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl"
          >
            ×
          </button>
        </div>
  
        {/* Price and Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">  {/* Changed gap-4 to gap-3 and mb-6 to mb-4 */}
          <div className="bg-gray-50 p-3 rounded-lg">  {/* Changed p-4 to p-3 */}
            <div className="text-sm text-gray-600">Current Price</div>
            <div className="text-xl font-bold">  {/* Changed text-2xl to text-xl */}
              ${stockData.price?.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}
            </div>
            <div className={`flex items-center ${stockData.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {stockData.change >= 0 ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
              <span>{Math.abs(stockData.change)}%</span>
            </div>
          </div>
  
          <div className="bg-gray-50 p-3 rounded-lg">  {/* Changed p-4 to p-3 */}
            <div className="text-sm text-gray-600">Volume</div>
            <div className="text-xl font-bold">{stockData.volume}</div>  {/* Changed text-2xl to text-xl */}
          </div>
  
          <div className="bg-gray-50 p-3 rounded-lg">  {/* Changed p-4 to p-3 */}
            <div className="text-sm text-gray-600">24h Range</div>
            <div className="text-base">  {/* Changed text-lg to text-base */}
              <span className="text-red-500">
                ${stockData.low?.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}
              </span>
              <span className="mx-2">-</span>
              <span className="text-green-500">
                ${stockData.high?.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}
              </span>
            </div>
          </div>
        </div>
  
        {/* Chart */}
        <div className="h-[500px] mt-2"> {/* Adjusted height and added small top margin */}
          <PriceChart 
            symbol={symbol} 
            showBackButton={true}
            onBack={onClose}
            standalone={false}
          />
        </div>
      </div>
    </div>
  );
};

export default StockDetail;