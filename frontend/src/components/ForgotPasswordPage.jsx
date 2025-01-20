import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';

const ForgotPasswordPage = ({ onBackToLogin, onResetPassword }) => {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    
    // Check if email exists in localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userExists = users.some(user => user.email === email);
    
    if (!userExists) {
      alert('No account found with this email address');
      return;
    }

    setIsEmailVerified(true);
  };

  const handleResetSubmit = (e) => {
    e.preventDefault();
    
    if (newPassword.length < 6) {
      alert('Password must be at least 6 characters long');
      return;
    }

    // Update password in localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const updatedUsers = users.map(user => {
      if (user.email === email) {
        return { ...user, password: newPassword };
      }
      return user;
    });
    
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    alert('Password has been reset successfully!');
    onBackToLogin();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full px-6 py-8 bg-white rounded-lg shadow-md">
        <button
          onClick={onBackToLogin}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Login
        </button>

        <h1 className="text-2xl font-bold text-center mb-8">
          {isEmailVerified ? 'Reset Password' : 'Forgot Password'}
        </h1>

        {!isEmailVerified ? (
          // Email verification form
          <form onSubmit={handleEmailSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <div className="mt-1 relative">
                <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your email"
                  required
                />
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Enter your email address to reset your password.
              </p>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors"
            >
              Continue
            </button>
          </form>
        ) : (
          // New password form
          <form onSubmit={handleResetSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                New Password
              </label>
              <div className="mt-1 relative">
                <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="pl-10 pr-10 w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter new password"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? 
                    <EyeOff className="w-5 h-5 text-gray-400" /> : 
                    <Eye className="w-5 h-5 text-gray-400" />
                  }
                </button>
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Password must be at least 6 characters long.
              </p>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors"
            >
              Reset Password
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;