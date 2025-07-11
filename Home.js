import React from 'react';
import { Link } from 'react-router-dom';
import dashboardImage from '../assets/gm-1.jpeg';

const Home = () => {
  return (
    <div className="min-h-screen flex items-start justify-center px-4 pt-24">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-start">
        {/* Left Content */}
        <div className="text-left space-y-8">
          <div className="space-y-6">
            <h1 className="text-5xl lg:text-7xl font-bold leading-tight relative drop-shadow-lg">
              <span className="text-white text-shadow-lg">Turn Ambitions </span>
              <span className="text-yellow-400 whitespace-nowrap drop-shadow-md">into Achievements</span>
              {/* Text bubbles */}
              <div className="absolute -top-2 left-32 w-3 h-3 bg-pink-400 rounded-full opacity-70 animate-bounce" style={{animationDelay: '0s'}}></div>
              <div className="absolute top-8 right-20 w-2 h-2 bg-yellow-300 rounded-full opacity-80 animate-bounce" style={{animationDelay: '0.5s'}}></div>
              <div className="absolute -bottom-4 left-16 w-2.5 h-2.5 bg-cyan-400 rounded-full opacity-60 animate-bounce" style={{animationDelay: '1s'}}></div>
            </h1>
            <p className="text-xl lg:text-2xl text-white/90 max-w-lg leading-relaxed drop-shadow-lg text-shadow">
              GoalMaster empowers your journey with
              <br />
              <span className="text-white/80 text-shadow">clarity, focus, and motivation.</span>
            </p>
          </div>
          
          <div className="mt-8">
            <Link to="/auth" className="inline-block">
              <button className="bg-cyan-600 hover:bg-cyan-700 text-white font-semibold px-8 py-4 rounded-2xl text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl shadow-lg">
                Start Your Journey
              </button>
            </Link>
          </div>
        </div>

        {/* Right Content - Dashboard Preview */}
        <div className="relative flex justify-start lg:ml-24">
          <div className="relative group">
            <img 
              src={dashboardImage} 
              alt="GoalMaster Dashboard" 
              className="w-full max-w-sm h-auto rounded-2xl shadow-2xl group-hover:shadow-3xl transition-all duration-500 transform-gpu group-hover:rotate-3 origin-top border border-white/10"
              style={{transformOrigin: 'top center'}}
            />
            
            {/* Dashboard edge bubbles */}
            <div className="absolute -top-3 -right-2 w-4 h-4 bg-pink-400 rounded-full opacity-70 animate-pulse"></div>
            <div className="absolute top-1/4 -left-3 w-3 h-3 bg-yellow-300 rounded-full opacity-80 animate-bounce" style={{animationDelay: '0.3s'}}></div>
            <div className="absolute bottom-10 -right-4 w-3.5 h-3.5 bg-cyan-400 rounded-full opacity-60 animate-pulse" style={{animationDelay: '0.8s'}}></div>
            <div className="absolute bottom-1/3 -left-2 w-2.5 h-2.5 bg-purple-400 rounded-full opacity-75 animate-bounce" style={{animationDelay: '1.2s'}}></div>
            
            {/* Floating Stats Cards */}
            <div className="absolute -top-4 -right-4 glass-card p-4 animate-bounce-slow border border-primary-300/20">
              <div className="text-center">
                <div className="text-2xl font-bold text-teal-300">85%</div>
                <div className="text-sm text-white/70">Completion</div>
              </div>
            </div>
            
            <div className="absolute -bottom-4 -left-4 glass-card p-4 animate-pulse-slow border border-yellow-300/20">
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-300">🔥 12</div>
                <div className="text-sm text-white/70">Day Streak</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
