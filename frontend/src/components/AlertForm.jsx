import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Bell, X } from 'lucide-react';

const AlertForm = ({ symbol, onSetAlert, currentPrice }) => {
  const [alertType, setAlertType] = useState('above');
  const [price, setPrice] = useState('');
  const [activeAlerts, setActiveAlerts] = useState([]);
  const [triggeredAlerts, setTriggeredAlerts] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (price) {
      // Check if an alert of this type already exists
      const existingAlert = activeAlerts.find(alert => alert.type === alertType);
      if (existingAlert) {
        // Replace existing alert
        const updatedAlerts = activeAlerts.filter(alert => alert.type !== alertType);
        const newAlert = {
          id: Date.now(),
          type: alertType,
          price: parseFloat(price),
          symbol,
          createdAt: new Date(),
          status: 'active'
        };
        setActiveAlerts([...updatedAlerts, newAlert]);
      } else {
        // Add new alert if we don't have 2 alerts yet
        if (activeAlerts.length < 2) {
          const newAlert = {
            id: Date.now(),
            type: alertType,
            price: parseFloat(price),
            symbol,
            createdAt: new Date(),
            status: 'active'
          };
          setActiveAlerts(prev => [...prev, newAlert]);
        }
      }
      onSetAlert(symbol, price, alertType);
      setPrice('');
    }
  };

  // Check if any alerts should be triggered
  React.useEffect(() => {
    if (currentPrice && activeAlerts.length > 0) {
      activeAlerts.forEach(alert => {
        const shouldTrigger = 
          (alert.type === 'above' && currentPrice >= alert.price) ||
          (alert.type === 'below' && currentPrice <= alert.price);

        if (shouldTrigger && alert.status === 'active') {
          // Mark alert as triggered
          setActiveAlerts(prev => 
            prev.map(a => 
              a.id === alert.id ? { ...a, status: 'triggered' } : a
            )
          );

          // Add to triggered alerts history
          setTriggeredAlerts(prev => [...prev, {
            ...alert,
            triggeredAt: new Date(),
            triggerPrice: currentPrice
          }]);
        }
      });
    }
  }, [currentPrice, activeAlerts]);

  const removeAlert = (alertId) => {
    setActiveAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="flex flex-col w-full">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Set Price Alert
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Alert Type Selection */}
        <div className="flex justify-center gap-4">
          <button
            type="button"
            onClick={() => setAlertType('above')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              alertType === 'above'
              ? 'bg-green-500 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <TrendingUp className="w-5 h-5" />
            Above
          </button>
          
          <button
            type="button"
            onClick={() => setAlertType('below')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              alertType === 'below'
              ? 'bg-red-500 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <TrendingDown className="w-5 h-5" />
            Below
          </button>
        </div>

        {/* Price Input */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Alert Price ($)
          </label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Enter price"
            className={`w-full px-4 py-2 rounded-lg border text-gray-900 placeholder-gray-400 ${
              alertType === 'above'
              ? 'focus:ring-green-500 focus:border-green-500'
              : 'focus:ring-red-500 focus:border-red-500'
            } outline-none transition-colors bg-white`}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!price}
          className={`w-full py-2 px-4 rounded-lg text-white font-medium transition-colors ${
            alertType === 'above'
            ? 'bg-green-500 hover:bg-green-600 disabled:bg-green-300'
            : 'bg-red-500 hover:bg-red-600 disabled:bg-red-300'
          } disabled:cursor-not-allowed`}
        >
          Set {alertType === 'above' ? 'Upper' : 'Lower'} Alert
        </button>
      </form>

      {/* Active Alerts */}
      {activeAlerts.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-800 mb-3">Active Alerts</h3>
          <div className="space-y-2">
            {activeAlerts.map(alert => (
              <div 
                key={alert.id}
                className={`flex items-center justify-between p-3 rounded-lg ${
                  alert.status === 'triggered' 
                    ? 'bg-gray-50 border border-gray-200 text-gray-900 font-bold'
                    : 'bg-gray-50 border border-gray-200 text-gray-600'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Bell className={`w-4 h-4 ${
                    alert.type === 'above' ? 'text-green-500' : 'text-red-500'
                  }`} />
                  <span>
                    Alert when price goes {alert.type} ${alert.price.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-500">
                    Set at {formatTime(alert.createdAt)} (${alert.price.toLocaleString()})
                  </span>
                  <button
                    onClick={() => removeAlert(alert.id)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Triggered Alerts History */}
      {triggeredAlerts.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-800 mb-3">Alert History</h3>
          <div className="space-y-2">
            {triggeredAlerts.slice().reverse().map(alert => (
              <div 
                key={alert.id}
                className="p-3 bg-gray-50 border border-gray-200 rounded-lg"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-blue-500" />
                    <span>
                      Price went {alert.type} ${alert.price.toLocaleString()}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500">
                    Triggered at {formatTime(alert.triggeredAt)}
                  </span>
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  Trigger price: ${alert.triggerPrice.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AlertForm;