import { TrendingUp, TrendingDown } from 'lucide-react';

const PriceCard = ({ symbol, price, signal }) => {
  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-lg font-bold text-gray-800">{symbol}</h2>
      <div className="mt-2">
        <p className="text-2xl font-bold text-blue-600">
          ${price?.toFixed(2)}
        </p>
        <div className="flex items-center mt-2">
          {signal === 'buy' ? (
            <div className="flex items-center text-green-500">
              <TrendingUp className="w-5 h-5 mr-1" />
              <span>Buy Signal</span>
            </div>
          ) : (
            <div className="flex items-center text-red-500">
              <TrendingDown className="w-5 h-5 mr-1" />
              <span>Sell Signal</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PriceCard;