import React, { useState, useEffect, useCallback } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  ReferenceDot
} from 'recharts';
import { ArrowLeft } from 'lucide-react';

const timeframes = {
  '1d': { interval: '5m', limit: 288, label: '1 Day' },
  '1w': { interval: '1h', limit: 168, label: '1 Week' },
  '1m': { interval: '4h', limit: 180, label: '1 Month' },
  '1y': { interval: '1d', limit: 365, label: '1 Year' },
  '5y': { interval: '1w', limit: 260, label: '5 Years' }
};

const PriceChart = ({ 
  symbol = 'BTC', 
  showBackButton = true, 
  onBack,
  standalone = true
}) => {
  const [timeframe, setTimeframe] = useState('1d');
  const [chartData, setChartData] = useState([]);
  const [peaks, setPeaks] = useState({ high: null, low: null });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedPoints, setSelectedPoints] = useState([]);
  
  const findPeaks = (data) => {
    if (!data.length) return { high: null, low: null };
    
    let highestPoint = data.reduce((max, point) => 
      point.price > max.price ? point : max
    , data[0]);
    
    let lowestPoint = data.reduce((min, point) => 
      point.price < min.price ? point : min
    , data[0]);

    return { high: highestPoint, low: lowestPoint };
  };

  const calculatePercentageChange = (startPoint, endPoint) => {
    const percentageChange = ((endPoint.price - startPoint.price) / startPoint.price) * 100;
    return percentageChange.toFixed(2);
  };

  const handleChartClick = (data) => {
    if (!data || !data.activePayload) return;
    
    const clickedPoint = data.activePayload[0].payload;
    
    setSelectedPoints(prevPoints => {
      if (prevPoints.length === 2) {
        return [clickedPoint];
      } else if (prevPoints.length === 1) {
        return [...prevPoints, clickedPoint].sort((a, b) => 
          a.timestamp - b.timestamp
        );
      } else {
        return [clickedPoint];
      }
    });
  };

  const fetchHistoricalData = useCallback(async (selectedTimeframe) => {
    try {
      setLoading(true);
      setError(null);
      setSelectedPoints([]);
      const { interval, limit } = timeframes[selectedTimeframe];
      
      const response = await fetch(
        `https://api.binance.com/api/v3/klines?symbol=${symbol}USDT&interval=${interval}&limit=${limit}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      const formattedData = data.map(item => ({
        timestamp: parseInt(item[0]),  // Store as number
        price: parseFloat(item[4])
      }));

      setChartData(formattedData);
      setPeaks(findPeaks(formattedData));
    } catch (err) {
      setError(`Failed to fetch historical data: ${err.message}`);
      setChartData([]);
      setPeaks({ high: null, low: null });
    } finally {
      setLoading(false);
    }
  }, [symbol]);

  useEffect(() => {
    fetchHistoricalData(timeframe);
    return () => {
      setChartData([]);
      setPeaks({ high: null, low: null });
      setSelectedPoints([]);
    };
  }, [timeframe, fetchHistoricalData]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price);
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    if (timeframe === '1d') {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString([], { 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit', 
        minute: '2-digit'
      });
    }
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white rounded-lg shadow-lg p-4 border border-gray-100">
          <p className="text-gray-600 mb-2">{formatDate(label)}</p>
          <p className="text-blue-600 font-semibold">
            {formatPrice(payload[0].value)}
          </p>
          <p className="text-gray-500 text-sm mt-2">Click to select point</p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className={`${standalone ? 'bg-white rounded-xl shadow-lg' : ''} p-8`}>
        <div className="flex items-center justify-center h-96">
          <div className="animate-pulse text-lg text-gray-600">Loading chart data...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${standalone ? 'bg-white rounded-xl shadow-lg' : ''} p-8`}>
        <div className="flex items-center justify-center h-96">
          <div className="text-red-500 text-center">
            <p className="text-lg font-semibold mb-2">Error Loading Chart</p>
            <p className="text-gray-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${standalone ? 'bg-white rounded-xl shadow-lg' : ''} p-8`}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            {showBackButton && onBack && (
              <button 
                onClick={onBack}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors mb-4"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                <span>Back</span>
              </button>
            )}
            <h2 className="text-2xl font-bold text-gray-800">{symbol} Price History</h2>
            <div className="space-y-1">
              {peaks.high && peaks.low && (
                <>
                  <p className="text-sm">
                    <span className="text-green-600 font-medium">
                      High: {formatPrice(peaks.high.price)}
                    </span>
                    <span className="text-gray-400 ml-2">
                      ({formatDate(peaks.high.timestamp)})
                    </span>
                  </p>
                  <p className="text-sm">
                    <span className="text-red-600 font-medium">
                      Low: {formatPrice(peaks.low.price)}
                    </span>
                    <span className="text-gray-400 ml-2">
                      ({formatDate(peaks.low.timestamp)})
                    </span>
                  </p>
                </>
              )}
              {selectedPoints.length === 2 && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-700">Selected Points Analysis:</p>
                  <div className="mt-2 space-y-1">
                    <p className="text-sm">
                      <span className="text-gray-600">Start: </span>
                      <span className="font-medium">
                        {formatPrice(selectedPoints[0].price)}
                      </span>
                      <span className="text-gray-400 ml-2">
                        ({formatDate(selectedPoints[0].timestamp)})
                      </span>
                    </p>
                    <p className="text-sm">
                      <span className="text-gray-600">End: </span>
                      <span className="font-medium">
                        {formatPrice(selectedPoints[1].price)}
                      </span>
                      <span className="text-gray-400 ml-2">
                        ({formatDate(selectedPoints[1].timestamp)})
                      </span>
                    </p>
                    <p className="text-sm font-medium mt-2">
                      <span className="text-gray-600">Change: </span>
                      <span className={`${
                        calculatePercentageChange(selectedPoints[0], selectedPoints[1]) > 0 
                          ? 'text-green-600' 
                          : 'text-red-600'
                      }`}>
                        {calculatePercentageChange(selectedPoints[0], selectedPoints[1])}%
                      </span>
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">Timeframe:</span>
            <div className="flex gap-2">
              {Object.entries(timeframes).map(([tf, { label }]) => (
                <button
                  key={tf}
                  onClick={() => setTimeframe(tf)}
                  className={`
                    px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200
                    ${timeframe === tf 
                      ? 'bg-blue-500 text-white shadow-sm' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }
                  `}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="h-96 w-full">
          <ResponsiveContainer>
            <LineChart 
              data={chartData}
              onClick={handleChartClick}
            >
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="#E5E7EB"
              />
              <XAxis 
                dataKey="timestamp"
                tick={{ fontSize: 10, fill: '#6B7280' }}
                angle={-45}
                textAnchor="end"
                height={80}
                interval={20}
                tickFormatter={formatDate}
                stroke="#9CA3AF"
              />
              <YAxis 
                tickFormatter={formatPrice}
                domain={['auto', 'auto']}
                tick={{ fontSize: 12, fill: '#6B7280' }}
                stroke="#9CA3AF"
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                wrapperStyle={{
                  paddingTop: '1rem'
                }}
              />
              <Line
                type="monotone"
                dataKey="price"
                stroke="#3B82F6"
                strokeWidth={2}
                dot={false}
                name="Price"
                activeDot={{ r: 4, fill: '#3B82F6', stroke: '#FFFFFF', strokeWidth: 2 }}
              />
              {peaks.high && (
                <ReferenceDot
                  x={peaks.high.timestamp}
                  y={peaks.high.price}
                  r={6}
                  fill="#10B981"
                  stroke="#FFFFFF"
                  strokeWidth={2}
                />
              )}
              {peaks.low && (
                <ReferenceDot
                  x={peaks.low.timestamp}
                  y={peaks.low.price}
                  r={6}
                  fill="#EF4444"
                  stroke="#FFFFFF"
                  strokeWidth={2}
                />
              )}
              {selectedPoints.map((point, index) => (
                <ReferenceDot
                  key={point.timestamp}
                  x={point.timestamp}
                  y={point.price}
                  r={6}
                  fill="#6366F1"
                  stroke="#FFFFFF"
                  strokeWidth={2}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default PriceChart;