import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, User, Mail, Lock, ArrowRight, CheckCircle, Github } from 'lucide-react';
import '../index.css';

const Auth = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });
  
  const [signupData, setSignupData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });

  const [errors, setErrors] = useState({});

  // Validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 8;
  };

  const validateSignup = () => {
    const newErrors = {};
    
    if (!signupData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    
    if (!validateEmail(signupData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!validatePassword(signupData.password)) {
      newErrors.password = 'Password must be at least 8 characters long';
    }
    
    if (signupData.password !== signupData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!signupData.agreeToTerms) {
      newErrors.agreeToTerms = 'Please agree to the terms and privacy policy';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateLogin = () => {
    const newErrors = {};
    
    if (!validateEmail(loginData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!loginData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submissions
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateLogin()) return;
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // Store user session (in real app, you'd use proper auth)
      localStorage.setItem('goalmaster_user', JSON.stringify({
        email: loginData.email,
        name: loginData.email.split('@')[0]
      }));
      
      // Redirect to onboarding or main app
      navigate('/habits');
    }, 1500);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!validateSignup()) return;
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // Store user session
      localStorage.setItem('goalmaster_user', JSON.stringify({
        email: signupData.email,
        name: signupData.fullName
      }));
      
      // Redirect to onboarding
      navigate('/habits');
    }, 1500);
  };

  const handleThirdPartyAuth = (provider) => {
    setIsLoading(true);
    // Simulate third-party auth
    setTimeout(() => {
      setIsLoading(false);
      localStorage.setItem('goalmaster_user', JSON.stringify({
        email: `user@${provider}.com`,
        name: `${provider} User`
      }));
      navigate('/habits');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="max-w-6xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-screen">
          {/* Left Side - Welcome Message */}
          <div className="text-center lg:text-left">
            {/* GoalMaster Title */}
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">G</span>
              </div>
              <span className="text-white font-bold text-2xl">GoalMaster</span>
              <button
                onClick={() => navigate('/')}
                className="ml-auto text-blue-200 hover:text-white transition-colors text-sm"
              >
                ← Back to Home
              </button>
            </div>
            
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Welcome to Your
              <span className="block bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                Personal Productivity Space
              </span>
            </h1>
            
            <p className="text-blue-200 text-lg mb-8">
              Creating an account allows you to track goals, manage habits, access planners, 
              and earn rewards seamlessly across all your devices. Your journey to better 
              productivity starts here.
            </p>

            {/* Benefits List */}
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3">
                <CheckCircle className="text-green-400 w-5 h-5" />
                <span className="text-blue-200">Track progress across all goals</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="text-green-400 w-5 h-5" />
                <span className="text-blue-200">Stay consistent with habit tracking</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="text-green-400 w-5 h-5" />
                <span className="text-blue-200">Earn rewards for achievements</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="text-green-400 w-5 h-5" />
                <span className="text-blue-200">Sync data across devices</span>
              </div>
            </div>

            {/* Motivational Quote */}
            <div className="glass-card-strong p-6 text-center">
              <p className="text-white text-lg font-medium mb-2">
                "Success is the sum of small efforts repeated day in and day out."
              </p>
              <p className="text-blue-300 text-sm">— Robert Collier</p>
            </div>
          </div>

          {/* Right Side - Auth Forms */}
          <div className="glass-card-strong p-8">
            {/* Toggle Buttons */}
            <div className="flex bg-white/10 rounded-lg p-1 mb-8">
              <button
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-3 text-center rounded-md transition-all duration-300 ${
                  isLogin 
                    ? 'bg-blue-500 text-white shadow-lg' 
                    : 'text-blue-200 hover:text-white'
                }`}
              >
                Login
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-3 text-center rounded-md transition-all duration-300 ${
                  !isLogin 
                    ? 'bg-blue-500 text-white shadow-lg' 
                    : 'text-blue-200 hover:text-white'
                }`}
              >
                Sign Up
              </button>
            </div>

            {/* Login Form */}
            {isLogin ? (
              <form onSubmit={handleLogin} className="space-y-6">
                <h2 className="text-2xl font-bold text-white text-center mb-6">
                  Welcome Back!
                </h2>

                {/* Email Field */}
                <div>
                  <label className="block text-white/80 mb-2 font-medium">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-300 w-5 h-5" />
                    <input
                      type="email"
                      value={loginData.email}
                      onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                      className={`w-full pl-12 pr-4 py-3 bg-white/10 border rounded-lg text-white placeholder-blue-200 focus:outline-none transition-all ${
                        errors.email ? 'border-red-400' : 'border-white/30 focus:border-blue-400'
                      }`}
                      placeholder="Enter your email"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-400 text-sm mt-1">{errors.email}</p>
                  )}
                </div>

                {/* Password Field */}
                <div>
                  <label className="block text-white/80 mb-2 font-medium">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-300 w-5 h-5" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={loginData.password}
                      onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                      className={`w-full pl-12 pr-12 py-3 bg-white/10 border rounded-lg text-white placeholder-blue-200 focus:outline-none transition-all ${
                        errors.password ? 'border-red-400' : 'border-white/30 focus:border-blue-400'
                      }`}
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-300 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-400 text-sm mt-1">{errors.password}</p>
                  )}
                </div>

                {/* Forgot Password */}
                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => navigate('/password-reset')}
                    className="text-blue-400 hover:text-blue-300 text-sm transition-colors"
                  >
                    Forgot Password?
                  </button>
                </div>

                {/* Login Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-500/50 text-white rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      Login
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>

                {/* Switch to Signup */}
                <p className="text-center text-blue-200">
                  New to GoalMaster?{' '}
                  <button
                    type="button"
                    onClick={() => setIsLogin(false)}
                    className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
                  >
                    Sign up instead
                  </button>
                </p>
              </form>
            ) : (
              /* Signup Form */
              <form onSubmit={handleSignup} className="space-y-6">
                <h2 className="text-2xl font-bold text-white text-center mb-6">
                  Create Your Account
                </h2>

                {/* Full Name Field */}
                <div>
                  <label className="block text-white/80 mb-2 font-medium">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-300 w-5 h-5" />
                    <input
                      type="text"
                      value={signupData.fullName}
                      onChange={(e) => setSignupData({...signupData, fullName: e.target.value})}
                      className={`w-full pl-12 pr-4 py-3 bg-white/10 border rounded-lg text-white placeholder-blue-200 focus:outline-none transition-all ${
                        errors.fullName ? 'border-red-400' : 'border-white/30 focus:border-blue-400'
                      }`}
                      placeholder="Enter your full name"
                    />
                  </div>
                  {errors.fullName && (
                    <p className="text-red-400 text-sm mt-1">{errors.fullName}</p>
                  )}
                </div>

                {/* Email Field */}
                <div>
                  <label className="block text-white/80 mb-2 font-medium">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-300 w-5 h-5" />
                    <input
                      type="email"
                      value={signupData.email}
                      onChange={(e) => setSignupData({...signupData, email: e.target.value})}
                      className={`w-full pl-12 pr-4 py-3 bg-white/10 border rounded-lg text-white placeholder-blue-200 focus:outline-none transition-all ${
                        errors.email ? 'border-red-400' : 'border-white/30 focus:border-blue-400'
                      }`}
                      placeholder="Enter your email"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-400 text-sm mt-1">{errors.email}</p>
                  )}
                </div>

                {/* Password Field */}
                <div>
                  <label className="block text-white/80 mb-2 font-medium">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-300 w-5 h-5" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={signupData.password}
                      onChange={(e) => setSignupData({...signupData, password: e.target.value})}
                      className={`w-full pl-12 pr-12 py-3 bg-white/10 border rounded-lg text-white placeholder-blue-200 focus:outline-none transition-all ${
                        errors.password ? 'border-red-400' : 'border-white/30 focus:border-blue-400'
                      }`}
                      placeholder="Create a password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-300 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  <p className="text-blue-300 text-xs mt-1">Minimum 8 characters required</p>
                  {errors.password && (
                    <p className="text-red-400 text-sm mt-1">{errors.password}</p>
                  )}
                </div>

                {/* Confirm Password Field */}
                <div>
                  <label className="block text-white/80 mb-2 font-medium">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-300 w-5 h-5" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={signupData.confirmPassword}
                      onChange={(e) => setSignupData({...signupData, confirmPassword: e.target.value})}
                      className={`w-full pl-12 pr-12 py-3 bg-white/10 border rounded-lg text-white placeholder-blue-200 focus:outline-none transition-all ${
                        errors.confirmPassword ? 'border-red-400' : 'border-white/30 focus:border-blue-400'
                      }`}
                      placeholder="Confirm your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-300 hover:text-white"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-red-400 text-sm mt-1">{errors.confirmPassword}</p>
                  )}
                </div>

                {/* Terms Agreement */}
                <div>
                  <label className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={signupData.agreeToTerms}
                      onChange={(e) => setSignupData({...signupData, agreeToTerms: e.target.checked})}
                      className="mt-1 w-4 h-4 rounded border-white/30 bg-white/10 text-blue-500 focus:ring-blue-500"
                    />
                    <span className="text-blue-200 text-sm">
                      I agree to the{' '}
                      <button type="button" className="text-blue-400 hover:text-blue-300 underline">
                        Terms of Service
                      </button>
                      {' '}and{' '}
                      <button type="button" className="text-blue-400 hover:text-blue-300 underline">
                        Privacy Policy
                      </button>
                    </span>
                  </label>
                  {errors.agreeToTerms && (
                    <p className="text-red-400 text-sm mt-1">{errors.agreeToTerms}</p>
                  )}
                </div>

                {/* Signup Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-500/50 text-white rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      Create Account
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>

                {/* Switch to Login */}
                <p className="text-center text-blue-200">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setIsLogin(true)}
                    className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
                  >
                    Sign in instead
                  </button>
                </p>
              </form>
            )}

            {/* Divider */}
            <div className="flex items-center gap-4 my-8">
              <div className="flex-1 h-px bg-white/20"></div>
              <span className="text-blue-200 text-sm">or continue with</span>
              <div className="flex-1 h-px bg-white/20"></div>
            </div>

            {/* Third-party Login */}
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleThirdPartyAuth('google')}
                className="flex items-center justify-center gap-2 py-3 bg-white/10 hover:bg-white/20 border border-white/30 rounded-lg text-white transition-all"
              >
                <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
                  <span className="text-red-500 text-xs font-bold">G</span>
                </div>
                Google
              </button>
              
              <button
                onClick={() => handleThirdPartyAuth('github')}
                className="flex items-center justify-center gap-2 py-3 bg-white/10 hover:bg-white/20 border border-white/30 rounded-lg text-white transition-all"
              >
                <Github className="w-5 h-5" />
                GitHub
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
