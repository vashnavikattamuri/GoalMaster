import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Target, Volume2, VolumeX, Moon, Sun, Maximize } from 'lucide-react';

const FocusMode = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [sessionType, setSessionType] = useState('focus'); // focus, shortBreak, longBreak
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedSound, setSelectedSound] = useState('silence');
  
  const [focusTasks, setFocusTasks] = useState([
    { id: 1, text: 'Complete React component', completed: false },
    { id: 2, text: 'Review project documentation', completed: false },
    { id: 3, text: 'Prepare presentation slides', completed: false }
  ]);

  const [distractionLog, setDistractionLog] = useState([]);
  const [currentDistraction, setCurrentDistraction] = useState('');
  const [newTask, setNewTask] = useState('');
  const [showAddTask, setShowAddTask] = useState(false);

  const sessionTimes = {
    focus: 25 * 60,
    shortBreak: 5 * 60,
    longBreak: 15 * 60
  };

  const sounds = [
    { id: 'silence', name: '🔇 Silence', icon: VolumeX },
    { id: 'rain', name: '🌧 Rain', icon: Volume2 },
    { id: 'forest', name: '🌿 Forest', icon: Volume2 },
    { id: 'lofi', name: '🎶 Lo-fi', icon: Volume2 }
  ];

  const motivationalQuotes = [
    "Discipline is choosing between what you want now and what you want most.",
    "Focus is a matter of deciding what things you're not going to do.",
    "The successful warrior is the average person with laser-like focus.",
    "Concentration is the secret of strength.",
    "Focus on being productive instead of busy."
  ];

  const [currentQuote] = useState(motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]);

  useEffect(() => {
    let interval = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft => timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleSessionComplete();
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const handleSessionComplete = () => {
    setIsRunning(false);
    
    if (sessionType === 'focus') {
      setSessionsCompleted(prev => prev + 1);
      // Determine next session type
      const nextType = (sessionsCompleted + 1) % 4 === 0 ? 'longBreak' : 'shortBreak';
      setSessionType(nextType);
      setTimeLeft(sessionTimes[nextType]);
    } else {
      setSessionType('focus');
      setTimeLeft(sessionTimes.focus);
    }
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(sessionTimes[sessionType]);
  };

  const switchSession = (type) => {
    setSessionType(type);
    setTimeLeft(sessionTimes[type]);
    setIsRunning(false);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const addDistraction = () => {
    if (currentDistraction.trim()) {
      setDistractionLog([...distractionLog, {
        id: Date.now(),
        text: currentDistraction,
        time: new Date().toLocaleTimeString()
      }]);
      setCurrentDistraction('');
    }
  };

  const addFocusTask = () => {
    if (newTask.trim()) {
      setFocusTasks([...focusTasks, {
        id: Date.now(),
        text: newTask,
        completed: false
      }]);
      setNewTask('');
      setShowAddTask(false);
    }
  };

  const toggleFocusTask = (id) => {
    setFocusTasks(tasks => 
      tasks.map(task => 
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const progress = ((sessionTimes[sessionType] - timeLeft) / sessionTimes[sessionType]) * 100;

  return (
    <div 
      className={`min-h-screen transition-all duration-300 ${
        isDarkMode ? 'bg-gray-900' : ''
      } ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}
      style={{
        background: !isDarkMode ? 'linear-gradient(135deg, rgba(0,0,0,0.7), rgba(0,0,0,0.5)), url(/bg-image.png)' : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        {!isFullscreen && (
          <div className="glass-card p-6 mb-8 backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center">
                  <Target className="text-white" size={24} />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white mb-1">Focus Mode</h1>
                  <p className="text-white/70">Enter your zone and achieve deep work</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-white/10 rounded-lg p-2">
                  <button
                    onClick={() => setIsDarkMode(!isDarkMode)}
                    className="p-2 hover:bg-white/20 rounded-lg transition-all duration-300"
                    title={isDarkMode ? 'Light mode' : 'Dark mode'}
                  >
                    {isDarkMode ? <Sun className="text-yellow-400" size={18} /> : <Moon className="text-blue-400" size={18} />}
                  </button>
                  
                  <button
                    onClick={() => setIsFullscreen(!isFullscreen)}
                    className="p-2 hover:bg-white/20 rounded-lg transition-all duration-300"
                    title="Toggle fullscreen"
                  >
                    <Maximize className="text-white" size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Timer Section */}
          <div className={`${isFullscreen ? 'col-span-4 flex items-center justify-center min-h-screen' : 'xl:col-span-3'}`}>
            <div className="glass-card backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-8 text-center w-full max-w-2xl">
              {/* Session Type Tabs */}
              <div className="flex justify-center gap-1 mb-8 bg-white/10 p-1 rounded-xl">
                {Object.keys(sessionTimes).map(type => (
                  <button
                    key={type}
                    onClick={() => switchSession(type)}
                    className={`px-6 py-3 rounded-lg capitalize transition-all duration-300 font-medium text-sm ${
                      sessionType === type 
                        ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-lg' 
                        : 'text-white/70 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {type === 'shortBreak' ? 'Short Break' : type === 'longBreak' ? 'Long Break' : type}
                  </button>
                ))}
              </div>

              {/* Timer Display */}
              <div className="relative mb-8">
                <div className="w-72 h-72 mx-auto relative">
                  {/* Progress Ring */}
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      stroke="rgba(255,255,255,0.1)"
                      strokeWidth="2"
                      fill="none"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      stroke="url(#gradient)"
                      strokeWidth="3"
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray={283}
                      strokeDashoffset={283 - (283 * progress) / 100}
                      className="transition-all duration-1000 ease-linear"
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#14b8a6" />
                        <stop offset="50%" stopColor="#3b82f6" />
                        <stop offset="100%" stopColor="#d946ef" />
                      </linearGradient>
                    </defs>
                  </svg>
                  
                  {/* Time Display */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-6xl font-bold text-white mb-2 tracking-tight">
                        {formatTime(timeLeft)}
                      </div>
                      <div className="text-white/60 capitalize font-medium">
                        {sessionType === 'shortBreak' ? 'Short Break' : sessionType === 'longBreak' ? 'Long Break' : sessionType}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Timer Controls */}
              <div className="flex justify-center gap-4 mb-8">
                <button
                  onClick={toggleTimer}
                  className="bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600 text-white p-4 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                  title={isRunning ? 'Pause timer' : 'Start timer'}
                >
                  {isRunning ? <Pause size={28} /> : <Play size={28} />}
                </button>
                <button
                  onClick={resetTimer}
                  className="bg-white/10 hover:bg-white/20 text-white p-4 rounded-full transition-all duration-300 border border-white/20 hover:border-white/40"
                  title="Reset timer"
                >
                  <RotateCcw size={28} />
                </button>
              </div>

              {/* Session Stats */}
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white/10 rounded-xl p-4 border border-white/20">
                  <div className="text-3xl font-bold text-primary-300 mb-1">{sessionsCompleted}</div>
                  <div className="text-white/70 text-sm font-medium">Sessions Today</div>
                </div>
                <div className="bg-white/10 rounded-xl p-4 border border-white/20">
                  <div className="text-3xl font-bold text-accent-300 mb-1">{Math.floor(sessionsCompleted * 25 / 60)}h {(sessionsCompleted * 25) % 60}m</div>
                  <div className="text-white/70 text-sm font-medium">Focus Time</div>
                </div>
              </div>

              {/* Motivational Quote */}
              <div className="mt-8 p-6 bg-gradient-to-r from-white/10 to-white/5 rounded-xl border border-white/20">
                <p className="text-white/80 italic leading-relaxed">"{currentQuote}"</p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          {!isFullscreen && (
            <div className="xl:col-span-1 space-y-6">
              {/* Focus Tasks */}
              <div className="glass-card backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
                    <Target size={16} />
                  </div>
                  Focus Tasks
                </h3>
                <div className="space-y-3">
                  {focusTasks.map(task => (
                    <div key={task.id} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors duration-300">
                      <button
                        onClick={() => toggleFocusTask(task.id)}
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                          task.completed 
                            ? 'bg-gradient-to-r from-primary-500 to-accent-500 border-primary-500 text-white' 
                            : 'border-white/40 hover:border-primary-400'
                        }`}
                      >
                        {task.completed && '✓'}
                      </button>
                      <span className={`text-sm flex-1 ${
                        task.completed ? 'text-white/60 line-through' : 'text-white/80'
                      }`}>
                        {task.text}
                      </span>
                    </div>
                  ))}
                  
                  {showAddTask ? (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newTask}
                        onChange={(e) => setNewTask(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && addFocusTask()}
                        placeholder="Enter task..."
                        className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/50 focus:border-primary-400 focus:outline-none text-sm focus:bg-white/20 transition-colors duration-300"
                        autoFocus
                      />
                      <button
                        onClick={addFocusTask}
                        className="bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600 text-white px-4 py-2 rounded-lg transition-all duration-300 text-sm"
                      >
                        Add
                      </button>
                      <button
                        onClick={() => {setShowAddTask(false); setNewTask('');}}
                        className="bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-lg transition-all duration-300 text-sm"
                      >
                        ×
                      </button>
                    </div>
                  ) : (
                    <button 
                      onClick={() => setShowAddTask(true)}
                      className="w-full p-3 border-2 border-dashed border-white/30 rounded-lg text-white/60 hover:text-white hover:border-white/50 transition-all duration-300 text-sm hover:bg-white/5"
                    >
                      + Add Focus Task
                    </button>
                  )}
                </div>
              </div>

              {/* Ambient Sounds */}
              <div className="glass-card backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <Volume2 size={16} />
                  </div>
                  Ambient Sounds
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {sounds.map(sound => (
                    <button
                      key={sound.id}
                      onClick={() => setSelectedSound(sound.id)}
                      className={`p-3 rounded-lg text-sm transition-all duration-300 flex items-center gap-2 ${
                        selectedSound === sound.id 
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg' 
                          : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
                      }`}
                    >
                      <sound.icon size={16} />
                      <span className="text-xs">{sound.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Distraction Log */}
              <div className="glass-card backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                    📝
                  </div>
                  Distraction Log
                </h3>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={currentDistraction}
                      onChange={(e) => setCurrentDistraction(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addDistraction()}
                      placeholder="Note a distraction..."
                      className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/50 focus:border-primary-400 focus:outline-none text-sm focus:bg-white/20 transition-colors duration-300"
                    />
                    <button
                      onClick={addDistraction}
                      className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-4 py-2 rounded-lg transition-all duration-300 text-sm shadow-lg hover:shadow-xl"
                    >
                      Add
                    </button>
                  </div>
                  
                  <div className="max-h-32 overflow-y-auto space-y-2">
                    {distractionLog.length === 0 ? (
                      <div className="text-white/50 text-xs text-center py-4">
                        No distractions logged yet
                      </div>
                    ) : (
                      distractionLog.map(item => (
                        <div key={item.id} className="text-white/70 text-xs p-3 bg-white/5 rounded-lg border border-white/10">
                          <span className="text-white/90 block mb-1">{item.text}</span>
                          <span className="text-white/50">{item.time}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Weekly Stats */}
              <div className="glass-card backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
                    📊
                  </div>
                  This Week
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                    <span className="text-white/70">Sessions</span>
                    <span className="text-primary-300 font-bold text-lg">24</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                    <span className="text-white/70">Focus Time</span>
                    <span className="text-primary-300 font-bold text-lg">10h 15m</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                    <span className="text-white/70">Avg Session</span>
                    <span className="text-primary-300 font-bold text-lg">23m</span>
                  </div>
                  <div className="mt-4">
                    <div className="flex justify-between text-sm text-white/70 mb-2">
                      <span>Weekly Goal</span>
                      <span>75%</span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-3">
                      <div className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full w-3/4 shadow-lg"></div>
                    </div>
                  </div>
                  <div className="text-center p-3 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-lg border border-orange-500/30">
                    <p className="text-orange-300 text-sm font-medium">🔥 3 day focus streak!</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FocusMode;
