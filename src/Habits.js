import React, { useState } from 'react';
import { Plus, Edit, Trash2, Calendar, BarChart3, Target, CheckCircle, X, Filter } from 'lucide-react';

const Habits = () => {
  const [habits, setHabits] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [filter, setFilter] = useState('All');
  const [editingHabit, setEditingHabit] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);

  const emojis = ['🎯', '🌞', '🧘', '📚', '💪', '🏃', '💧', '🥗', '😴', '📝', '🎨', '🎵', '💰', '🧠', '❤️'];
  const categories = ['Health', 'Productivity', 'Self-Care', 'Finance', 'Learning', 'Wellness'];
  const priorities = ['Low', 'Medium', 'High'];
  const frequencies = ['Daily', 'Weekly', 'Monthly'];

  const [newHabit, setNewHabit] = useState({
    name: '',
    emoji: '🎯',
    category: 'Productivity',
    priority: 'Medium',
    frequency: 'Daily',
    reminderTime: '',
    target: 21
  });

  // Add new habit
  const addHabit = (e) => {
    e.preventDefault();
    const habit = {
      id: Date.now(),
      ...newHabit,
      name: `${newHabit.emoji} ${newHabit.name}`,
      streak: 0,
      longestStreak: 0,
      completedToday: false,
      completionRate: 0,
      completedDates: [],
      missedDays: 0,
      createdAt: new Date().toISOString()
    };
    setHabits([...habits, habit]);
    setNewHabit({
      name: '',
      emoji: '🎯',
      category: 'Productivity',
      priority: 'Medium',
      frequency: 'Daily',
      reminderTime: '',
      target: 21
    });
    setShowAddForm(false);
  };

  // Toggle habit completion
  const toggleHabit = (id) => {
    setHabits(habits.map(habit => {
      if (habit.id === id) {
        const today = new Date().toDateString();
        const isCompleted = !habit.completedToday;
        const completedDates = isCompleted 
          ? [...habit.completedDates, today]
          : habit.completedDates.filter(date => date !== today);
        
        const newStreak = isCompleted ? habit.streak + 1 : 0;
        const newLongestStreak = Math.max(habit.longestStreak, newStreak);
        const completionRate = completedDates.length > 0 
          ? Math.round((completedDates.length / Math.max(1, getDaysSinceCreation(habit.createdAt))) * 100)
          : 0;

        return {
          ...habit,
          completedToday: isCompleted,
          streak: newStreak,
          longestStreak: newLongestStreak,
          completedDates,
          completionRate: Math.min(100, completionRate),
          missedDays: isCompleted ? habit.missedDays : habit.missedDays + 1
        };
      }
      return habit;
    }));
  };

  // Delete habit
  const deleteHabit = (id) => {
    setHabits(habits.filter(habit => habit.id !== id));
  };

  // Edit habit
  const editHabit = (habit) => {
    setEditingHabit(habit);
    setNewHabit({
      name: habit.name.split(' ').slice(1).join(' '),
      emoji: habit.name.split(' ')[0],
      category: habit.category,
      priority: habit.priority,
      frequency: habit.frequency,
      reminderTime: habit.reminderTime || '',
      target: habit.target || 21
    });
    setShowAddForm(true);
  };

  // Update habit
  const updateHabit = (e) => {
    e.preventDefault();
    setHabits(habits.map(habit => 
      habit.id === editingHabit.id 
        ? { ...habit, ...newHabit, name: `${newHabit.emoji} ${newHabit.name}` }
        : habit
    ));
    setEditingHabit(null);
    setNewHabit({
      name: '',
      emoji: '🎯',
      category: 'Productivity',
      priority: 'Medium',
      frequency: 'Daily',
      reminderTime: '',
      target: 21
    });
    setShowAddForm(false);
  };

  const getDaysSinceCreation = (createdAt) => {
    const created = new Date(createdAt);
    const today = new Date();
    const diffTime = Math.abs(today - created);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Filter habits
  const filteredHabits = filter === 'All' 
    ? habits 
    : habits.filter(habit => habit.category === filter);

  // Get category stats
  const getCategoryStats = () => {
    const stats = {};
    habits.forEach(habit => {
      if (!stats[habit.category]) {
        stats[habit.category] = { total: 0, completed: 0 };
      }
      stats[habit.category].total++;
      if (habit.completedToday) {
        stats[habit.category].completed++;
      }
    });
    return stats;
  };

  // Calculate overall stats
  const totalHabits = habits.length;
  const completedToday = habits.filter(h => h.completedToday).length;
  const bestStreak = habits.length > 0 ? Math.max(...habits.map(h => h.longestStreak)) : 0;
  const avgCompletionRate = habits.length > 0 
    ? Math.round(habits.reduce((sum, h) => sum + h.completionRate, 0) / habits.length)
    : 0;
  return (
    <div className="min-h-screen p-6 space-y-6">
      {/* Habit Tracker Header */}
      <div className="glass-card-strong p-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
              <Target className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Habit Tracker</h1>
              <p className="text-gray-300 text-sm">Build consistency, one day at a time. Track your progress and celebrate your wins!</p>
            </div>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all"
          >
            <Plus className="w-4 h-4" />
            Add New Habit
          </button>
        </div>
      </div>

      {/* Overview & Analytics */}
      <div className="glass-card-strong p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded flex items-center justify-center">
            <BarChart3 className="w-4 h-4 text-white" />
          </div>
          <h2 className="text-xl font-bold text-white">Overview & Analytics</h2>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-blue-500/20 backdrop-blur-sm border border-blue-500/30 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-300">{completedToday}/{totalHabits}</div>
            <div className="text-blue-200 text-sm">Today's Progress</div>
            <div className="text-xs text-gray-400 mt-1">{totalHabits === 0 ? 0 : Math.round((completedToday / totalHabits) * 100)}% Complete</div>
          </div>
          
          <div className="bg-orange-500/20 backdrop-blur-sm border border-orange-500/30 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-orange-300 flex items-center justify-center gap-1">
              🔥 {bestStreak}
            </div>
            <div className="text-orange-200 text-sm">Best Streak</div>
            <div className="text-xs text-gray-400 mt-1">Days in a row</div>
          </div>
          
          <div className="bg-green-500/20 backdrop-blur-sm border border-green-500/30 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-300">{avgCompletionRate}%</div>
            <div className="text-green-200 text-sm">Average Rate</div>
            <div className="text-xs text-gray-400 mt-1">Overall completion</div>
          </div>
          
          <div className="bg-purple-500/20 backdrop-blur-sm border border-purple-500/30 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-purple-300">{totalHabits}</div>
            <div className="text-purple-200 text-sm">Active Habits</div>
            <div className="text-xs text-gray-400 mt-1">Currently tracking</div>
          </div>
        </div>
      </div>

      {/* Filter by Category */}
      <div className="glass-card-strong p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-purple-500 rounded flex items-center justify-center">
              <Filter className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white">Filter by Category</h2>
          </div>
          <button
            onClick={() => {
              setShowCalendar(!showCalendar);
              // Scroll to calendar after a short delay to allow for DOM update
              if (!showCalendar) {
                setTimeout(() => {
                  const calendarElement = document.getElementById('calendar-section');
                  if (calendarElement) {
                    calendarElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }, 100);
              }
            }}
            className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all"
          >
            <Calendar className="w-4 h-4" />
            {showCalendar ? 'Hide Calendar' : 'Show Calendar'}
          </button>
        </div>
        
        <div className="flex flex-wrap gap-3">
          {['All', ...categories].map(category => {
            const categoryCount = category === 'All' ? totalHabits : habits.filter(h => h.category === category).length;
            return (
              <button
                key={category}
                onClick={() => setFilter(category)}
                className={`px-4 py-2 rounded-lg text-sm transition-all ${
                  filter === category
                    ? 'bg-cyan-500 text-white'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }`}
              >
                {category} {categoryCount > 0 && <span className="ml-1">({categoryCount})</span>}
              </button>
            );
          })}
        </div>


      </div>

      {/* Your Habits */}
      <div className="glass-card-strong p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-pink-500 rounded flex items-center justify-center">
              📋
            </div>
            <h2 className="text-xl font-bold text-white">Your Habits ({filteredHabits.length} total)</h2>
          </div>
        </div>

        {filteredHabits.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="w-8 h-8 text-red-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No habits yet!</h3>
            <p className="text-gray-400 mb-6">Start building great habits by adding your first one.</p>
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-3 rounded-lg transition-all"
            >
              Add Your First Habit
            </button>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredHabits.map(habit => (
              <div key={habit.id} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-4 space-y-4">
                {/* Habit Header */}
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-1">{habit.name}</h3>
                    <div className="flex flex-wrap gap-2 text-sm">
                      <span className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded">
                        {habit.category}
                      </span>
                      <span className={`px-2 py-1 rounded ${
                        habit.priority === 'High' ? 'bg-red-500/20 text-red-300' :
                        habit.priority === 'Medium' ? 'bg-yellow-500/20 text-yellow-300' :
                        'bg-green-500/20 text-green-300'
                      }`}>
                        {habit.priority}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => editHabit(habit)}
                      className="text-blue-300 hover:text-blue-100 p-1"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteHabit(habit.id)}
                      className="text-red-300 hover:text-red-100 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300">Progress</span>
                    <span className="text-gray-300">{habit.completionRate}%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all"
                      style={{ width: `${habit.completionRate}%` }}
                    />
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 text-center text-sm">
                  <div>
                    <div className="text-lg font-bold text-yellow-300">{habit.streak}</div>
                    <div className="text-gray-400">Streak</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-green-300">{habit.longestStreak}</div>
                    <div className="text-gray-400">Best</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-purple-300">{habit.target}</div>
                    <div className="text-gray-400">Target</div>
                  </div>
                </div>

                {/* Complete Button */}
                <button
                  onClick={() => toggleHabit(habit.id)}
                  className={`w-full py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                    habit.completedToday
                      ? 'bg-green-500 text-white'
                      : 'bg-white/10 text-gray-300 hover:bg-white/20 border border-white/20'
                  }`}
                >
                  <CheckCircle className="w-5 h-5" />
                  {habit.completedToday ? 'Completed!' : 'Mark Complete'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Calendar Section */}
      {showCalendar && (
        <div id="calendar-section" className="glass-card-strong p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-blue-500 rounded flex items-center justify-center">
                <Calendar className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-xl font-bold text-white">365-Day Habit Journey</h2>
            </div>
            <button
              onClick={() => setShowCalendar(false)}
              className="text-gray-400 hover:text-white p-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Calendar Header with Creative Stats */}
          <div className="mb-6 text-center">
            <div className="text-2xl font-bold text-white mb-2">
              🏆 {habits.reduce((total, habit) => total + habit.completedDates.length, 0)} victories achieved in your habit journey!
            </div>
            <p className="text-gray-400 text-sm">
              {habits.length > 0 ? 
                `Building ${habits.length} powerful habits • Best streak: ${habits.reduce((max, habit) => Math.max(max, habit.longestStreak), 0)} days` :
                "Start your habit journey by adding your first habit!"
              }
            </p>
          </div>
          
          {/* Calendar Grid - LeetCode Style Layout */}
          <div className="mb-4 overflow-x-auto">
            <div className="min-w-fit">
              {/* Generate calendar data by months */}
              {(() => {
                const today = new Date();
                const currentYear = today.getFullYear();
                const currentMonth = today.getMonth();
                
                // Generate months from July last year to current month
                const months = [];
                for (let i = 0; i < 12; i++) {
                  let monthIndex = (currentMonth + 1 + i) % 12;
                  let year = currentYear;
                  if (currentMonth + 1 + i >= 12) {
                    year = currentYear;
                  } else {
                    year = currentYear - 1;
                  }
                  months.push({ month: monthIndex, year });
                }
                
                return (
                  <div>
                    {/* Month Labels */}
                    <div className="flex gap-4 mb-2">
                      {months.map((monthData, monthIdx) => {
                        const monthName = new Date(monthData.year, monthData.month, 1).toLocaleDateString('en-US', { month: 'short' });
                        const daysInMonth = new Date(monthData.year, monthData.month + 1, 0).getDate();
                        const firstDayOfMonth = new Date(monthData.year, monthData.month, 1).getDay();
                        const weeksInMonth = Math.ceil((daysInMonth + firstDayOfMonth) / 7);
                        
                        return (
                          <div key={monthIdx} className="flex-shrink-0" style={{ width: `${weeksInMonth * 16}px` }}>
                            <div className="text-xs text-gray-400 text-center mb-1">{monthName}</div>
                          </div>
                        );
                      })}
                    </div>
                    
                    {/* Weekday Labels */}
                    <div className="flex items-start gap-4">
                      <div className="flex flex-col mr-2">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
                          <div key={index} className="w-6 h-3 text-xs text-gray-400 flex items-center mb-1">
                            {index % 2 === 1 ? day : ''}
                          </div>
                        ))}
                      </div>
                      
                      {/* Month Grids */}
                      {months.map((monthData, monthIdx) => {
                        const daysInMonth = new Date(monthData.year, monthData.month + 1, 0).getDate();
                        const firstDayOfMonth = new Date(monthData.year, monthData.month, 1).getDay();
                        const weeksInMonth = Math.ceil((daysInMonth + firstDayOfMonth) / 7);
                        
                        return (
                          <div key={monthIdx} className="flex gap-1 flex-shrink-0">
                            {Array.from({ length: weeksInMonth }, (_, weekIndex) => (
                              <div key={weekIndex} className="flex flex-col gap-1">
                                {Array.from({ length: 7 }, (_, dayIndex) => {
                                  const dayNumber = weekIndex * 7 + dayIndex - firstDayOfMonth + 1;
                                  
                                  // Empty cell for days before month starts or after month ends
                                  if (dayNumber <= 0 || dayNumber > daysInMonth) {
                                    return <div key={dayIndex} className="w-3 h-3" />;
                                  }
                                  
                                  const date = new Date(monthData.year, monthData.month, dayNumber);
                                  
                                  // Skip if date is in the future
                                  if (date > today) {
                                    return <div key={dayIndex} className="w-3 h-3" />;
                                  }
                                  
                                  const dateString = date.toDateString();
                                  
                                  // Get completed habits for this day
                                  const completedHabitsForDay = habits.filter(habit => 
                                    habit.completedDates.includes(dateString)
                                  );
                                  const completedCount = completedHabitsForDay.length;
                                  
                                  // Calculate intensity (0-4 levels)
                                  const intensity = habits.length === 0 ? 0 : Math.min(4, Math.ceil((completedCount / habits.length) * 4));
                                  
                                  // Create tooltip with habit names and date
                                  const tooltipText = completedCount > 0 ? 
                                    `${date.toLocaleDateString('en-US', { 
                                      weekday: 'short', 
                                      month: 'short', 
                                      day: 'numeric', 
                                      year: 'numeric' 
                                    })}\n🎯 ${completedCount} habit${completedCount > 1 ? 's' : ''} completed:\n${completedHabitsForDay.map(h => `• ${h.name}`).join('\n')}` :
                                    `${date.toLocaleDateString('en-US', { 
                                      weekday: 'short', 
                                      month: 'short', 
                                      day: 'numeric', 
                                      year: 'numeric' 
                                    })}\n💤 No habits completed`;
                                  
                                  return (
                                    <div
                                      key={dayIndex}
                                      className={`w-3 h-3 rounded-sm cursor-pointer transition-all hover:scale-110 hover:ring-1 hover:ring-white/50 ${
                                        intensity === 0 ? 'bg-gray-700/50' :
                                        intensity === 1 ? 'bg-green-800' :
                                        intensity === 2 ? 'bg-green-600' :
                                        intensity === 3 ? 'bg-green-400' :
                                        'bg-green-300'
                                      }`}
                                      title={tooltipText}
                                    />
                                  );
                                })}
                              </div>
                            ))}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
          
          {/* Legend */}
          <div className="flex justify-between items-center text-sm text-gray-400 mb-4">
            <span>Less consistent</span>
            <div className="flex gap-1 items-center">
              <div className="w-3 h-3 rounded-sm bg-gray-700"></div>
              <div className="w-3 h-3 rounded-sm bg-green-800"></div>
              <div className="w-3 h-3 rounded-sm bg-green-600"></div>
              <div className="w-3 h-3 rounded-sm bg-green-400"></div>
              <div className="w-3 h-3 rounded-sm bg-green-300"></div>
            </div>
            <span>More consistent</span>
          </div>
          
          {/* Calendar Stats with Creative Labels */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="bg-white/5 rounded-lg p-3">
              <div className="text-lg font-bold text-green-300">
                {habits.reduce((total, habit) => total + habit.completedDates.length, 0)}
              </div>
              <div className="text-xs text-gray-400">🎯 Habit Victories</div>
            </div>
            <div className="bg-white/5 rounded-lg p-3">
              <div className="text-lg font-bold text-blue-300">
                {habits.reduce((max, habit) => Math.max(max, habit.longestStreak), 0)}
              </div>
              <div className="text-xs text-gray-400">🔥 Best Streak</div>
            </div>
            <div className="bg-white/5 rounded-lg p-3">
              <div className="text-lg font-bold text-yellow-300">
                {Math.round(habits.reduce((sum, habit) => sum + habit.completionRate, 0) / Math.max(1, habits.length))}%
              </div>
              <div className="text-xs text-gray-400">⭐ Success Rate</div>
            </div>
            <div className="bg-white/5 rounded-lg p-3">
              <div className="text-lg font-bold text-purple-300">
                {habits.filter(h => h.completedToday).length}
              </div>
              <div className="text-xs text-gray-400">🚀 Today's Wins</div>
            </div>
          </div>
          
          {/* Recent Activity */}
          {habits.length > 0 && (
            <div className="mt-6 p-4 bg-white/5 rounded-lg">
              <h4 className="text-sm font-semibold text-white mb-3">🌟 Recent Achievements</h4>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {habits
                  .filter(habit => habit.completedDates.length > 0)
                  .slice(0, 5)
                  .map(habit => {
                    const lastCompleted = habit.completedDates[habit.completedDates.length - 1];
                    return (
                      <div key={habit.id} className="flex justify-between items-center text-xs">
                        <span className="text-gray-300">{habit.name}</span>
                        <span className="text-green-400">
                          {new Date(lastCompleted).toLocaleDateString()}
                        </span>
                      </div>
                    );
                  })
                }
                {habits.filter(habit => habit.completedDates.length > 0).length === 0 && (
                  <div className="text-xs text-gray-400 text-center py-2">
                    Complete your first habit to see achievements here! 🎯
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
      {/* Add/Edit Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="glass-card-strong p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-white">
                {editingHabit ? 'Edit Habit' : 'Add New Habit'}
              </h2>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setEditingHabit(null);
                  setNewHabit({
                    name: '',
                    emoji: '🎯',
                    category: 'Productivity',
                    priority: 'Medium',
                    frequency: 'Daily',
                    reminderTime: '',
                    target: 21
                  });
                }}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={editingHabit ? updateHabit : addHabit} className="space-y-4">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Habit Name
                </label>
                <input
                  type="text"
                  value={newHabit.name}
                  onChange={(e) => setNewHabit({...newHabit, name: e.target.value})}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  placeholder="e.g., Morning meditation"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Emoji
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {emojis.map(emoji => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setNewHabit({...newHabit, emoji})}
                      className={`p-2 rounded-lg text-xl transition-all ${
                        newHabit.emoji === emoji
                          ? 'bg-cyan-500'
                          : 'bg-white/10 hover:bg-white/20'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Category
                </label>
                <select
                  value={newHabit.category}
                  onChange={(e) => setNewHabit({...newHabit, category: e.target.value})}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  required
                >
                  {categories.map(category => (
                    <option key={category} value={category} className="bg-gray-800">
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Priority
                </label>
                <select
                  value={newHabit.priority}
                  onChange={(e) => setNewHabit({...newHabit, priority: e.target.value})}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  {priorities.map(priority => (
                    <option key={priority} value={priority} className="bg-gray-800">
                      {priority}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Frequency
                </label>
                <select
                  value={newHabit.frequency}
                  onChange={(e) => setNewHabit({...newHabit, frequency: e.target.value})}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  {frequencies.map(frequency => (
                    <option key={frequency} value={frequency} className="bg-gray-800">
                      {frequency}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Target Days
                </label>
                <input
                  type="number"
                  value={newHabit.target}
                  onChange={(e) => setNewHabit({...newHabit, target: Math.max(1, parseInt(e.target.value) || 1)})}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  min="1"
                  max="365"
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Reminder Time (Optional)
                </label>
                <input
                  type="time"
                  value={newHabit.reminderTime}
                  onChange={(e) => setNewHabit({...newHabit, reminderTime: e.target.value})}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingHabit(null);
                    setNewHabit({
                      name: '',
                      emoji: '🎯',
                      category: 'Productivity',
                      priority: 'Medium',
                      frequency: 'Daily',
                      reminderTime: '',
                      target: 21
                    });
                  }}
                  className="flex-1 py-2 px-4 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-1 py-2 px-4 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-all"
                >
                  {editingHabit ? 'Update' : 'Add'} Habit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Habits;
