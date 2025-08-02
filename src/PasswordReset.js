import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';
import './index.css';

const PasswordReset = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: email input, 2: success message
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleResetRequest = async (e) => {
    e.preventDefault();
    
    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setError('');
    setIsLoading(true);

    // Simulate API call for password reset
    setTimeout(() => {
      setIsLoading(false);
      setStep(2); // Move to success step
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Navigation */}
      <nav className="flex items-center justify-between p-6">
        <div 
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => navigate('/')}
        >
          <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">G</span>
          </div>
          <span className="text-white font-bold text-xl">GoalMaster</span>
        </div>
        
        <button
          onClick={() => navigate('/auth')}
          className="text-blue-200 hover:text-white transition-colors flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Login
        </button>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-12">
        <div className="glass-card-strong p-8">
          {step === 1 ? (
            /* Step 1: Email Input */
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Mail className="w-8 h-8 text-blue-400" />
              </div>
              
              <h1 className="text-3xl font-bold text-white mb-4">
                Reset Your Password
              </h1>
              
              <p className="text-blue-200 mb-8 text-lg">
                Enter your email address and we'll send you a link to reset your password.
              </p>

              <form onSubmit={handleResetRequest} className="space-y-6">
                <div className="text-left">
                  <label className="block text-white/80 mb-2 font-medium">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-300 w-5 h-5" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`w-full pl-12 pr-4 py-4 bg-white/10 border rounded-lg text-white placeholder-blue-200 focus:outline-none transition-all text-lg ${
                        error ? 'border-red-400' : 'border-white/30 focus:border-blue-400'
                      }`}
                      placeholder="Enter your email address"
                      autoFocus
                    />
                  </div>
                  {error && (
                    <p className="text-red-400 text-sm mt-2">{error}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-500/50 text-white rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2 text-lg"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending Reset Link...
                    </>
                  ) : (
                    <>
                      Send Reset Link
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-8 pt-6 border-t border-white/20">
                <p className="text-blue-200 text-sm">
                  Remember your password?{' '}
                  <button
                    onClick={() => navigate('/auth')}
                    className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
                  >
                    Back to Login
                  </button>
                </p>
              </div>
            </div>
          ) : (
            /* Step 2: Success Message */
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
              
              <h1 className="text-3xl font-bold text-white mb-4">
                Check Your Email
              </h1>
              
              <p className="text-blue-200 mb-2 text-lg">
                We've sent a password reset link to:
              </p>
              
              <p className="text-white font-semibold mb-6 text-lg">
                {email}
              </p>

              <div className="glass-card-strong p-6 mb-8">
                <h3 className="text-white font-semibold mb-4">Next Steps:</h3>
                <div className="space-y-3 text-left">
                  <div className="flex items-start gap-3">
                    <span className="text-blue-400 font-bold">1.</span>
                    <span className="text-blue-200">Check your email inbox (and spam folder)</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-blue-400 font-bold">2.</span>
                    <span className="text-blue-200">Click the password reset link</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-blue-400 font-bold">3.</span>
                    <span className="text-blue-200">Create a new secure password</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-blue-400 font-bold">4.</span>
                    <span className="text-blue-200">Sign in with your new password</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <button
                  onClick={() => navigate('/auth')}
                  className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-all duration-300"
                >
                  Back to Login
                </button>
                
                <button
                  onClick={() => setStep(1)}
                  className="w-full py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg font-medium transition-all duration-300"
                >
                  Send Another Email
                </button>
              </div>

              <div className="mt-6 pt-6 border-t border-white/20">
                <p className="text-blue-200 text-sm">
                  Didn't receive the email? Check your spam folder or{' '}
                  <button
                    onClick={() => setStep(1)}
                    className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
                  >
                    try again
                  </button>
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Help Section */}
        <div className="glass-card-strong p-6 mt-6">
          <h3 className="text-white font-semibold mb-4 text-center">Need Help?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="text-center">
              <p className="text-blue-200 mb-2">Can't access your email?</p>
              <button className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
                Contact Support
              </button>
            </div>
            <div className="text-center">
              <p className="text-blue-200 mb-2">Security concerns?</p>
              <button className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
                Learn About Security
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordReset;
