import React, { useState, useEffect } from 'react';
import MarketGrid from './components/MarketGrid';
import StockDetail from './components/StockDetail';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import ForgotPasswordPage from './components/ForgotPasswordPage';

function App() {
  const [user, setUser] = useState(null);
  const [selectedStock, setSelectedStock] = useState(null);
  const [currentView, setCurrentView] = useState('login'); // 'login', 'signup', or 'forgot-password'
  const [favorites, setFavorites] = useState(() => {
    const savedFavorites = localStorage.getItem('favorites');
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });
  
  const stocks = [
    { symbol: 'BTC', name: 'Bitcoin' },
    { symbol: 'ETH', name: 'Ethereum' },
    { symbol: 'AAPL', name: 'Apple Inc.' },
    { symbol: 'GOOGL', name: 'Alphabet Inc.' },
    { symbol: 'MSFT', name: 'Microsoft' },
    { symbol: 'AMZN', name: 'Amazon' },
    { symbol: 'TSLA', name: 'Tesla' },
    { symbol: 'META', name: 'Meta Platforms' },
    { symbol: 'NVDA', name: 'NVIDIA' },
    { symbol: 'SOL', name: 'Solana' },
    { symbol: 'ADA', name: 'Cardano' },
    { symbol: 'DOT', name: 'Polkadot' }
  ];

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = (email, password, isGoogleSignIn = false) => {
    if (isGoogleSignIn) {
      // For Google sign-in, we'll set the user directly
      setUser({ email });
      return true;
    }
  
    // For regular email/password login
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
      const userInfo = { email: user.email };
      setUser(userInfo);
      localStorage.setItem('currentUser', JSON.stringify(userInfo));
      return true;
    } else {
      alert('Invalid email or password');
      return false;
    }
  };

  const handleSignup = (email, password, confirmPassword) => {
    if (password.length < 6) {
      alert('Password must be at least 6 characters long');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert('Please enter a valid email address');
      return false;
    }

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    if (users.some(user => user.email === email)) {
      alert('An account with this email already exists');
      return false;
    }

    const newUser = { email, password };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    const userInfo = { email: newUser.email };
    setUser(userInfo);
    localStorage.setItem('currentUser', JSON.stringify(userInfo));
    return true;
  };

  const handleLogout = () => {
    setUser(null);
    setSelectedStock(null);
    localStorage.removeItem('currentUser');
  };

  const handleSelectStock = (symbol) => {
    setSelectedStock(symbol);
  };

  const handleCloseDetail = () => {
    setSelectedStock(null);
  };

  const handleToggleFavorite = (symbol) => {
    setFavorites(prev => {
      if (prev.includes(symbol)) {
        return prev.filter(s => s !== symbol);
      } else {
        return [...prev, symbol];
      }
    });
  };

  if (!user) {
    switch (currentView) {
      case 'login':
        return (
          <LoginPage 
            onLogin={handleLogin}
            onSwitchToSignup={() => setCurrentView('signup')}
            onForgotPassword={() => setCurrentView('forgot-password')}
          />
        );
      case 'signup':
        return (
          <SignupPage  // Changed to match the import
            onSignup={handleSignup}
            onSwitchToLogin={() => setCurrentView('login')}
          />
        );
      case 'forgot-password':
        return (
          <ForgotPasswordPage 
            onBackToLogin={() => setCurrentView('login')}
            onResetPassword={(email, newPassword) => {
              const users = JSON.parse(localStorage.getItem('users') || '[]');
              const updatedUsers = users.map(user => {
                if (user.email === email) {
                  return { ...user, password: newPassword };
                }
                return user;
              });
              localStorage.setItem('users', JSON.stringify(updatedUsers));
            }}
          />
        );
      default:
        return null;
    }
  }

  return (
    <div className="app-container bg-gray-100 min-h-screen">
      <div className="bg-white shadow">
        <div className="container mx-auto max-w-7xl px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">
              Market Overview
            </h1>
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600">
                {user.email}
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-gray-600 hover:text-gray-900"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl py-6">
        <MarketGrid 
          stocks={stocks} 
          onSelectStock={handleSelectStock}
          favorites={favorites}
          onToggleFavorite={handleToggleFavorite}
        />
        
        {selectedStock && (
          <StockDetail 
            symbol={selectedStock} 
            onClose={handleCloseDetail} 
          />
        )}
      </div>
    </div>
  );
}

export default App;