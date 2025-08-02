import React, { useState, useEffect } from 'react';
import { Plus, Target, Calendar, CheckCircle, Clock, BarChart3, Edit, Trash2, BookOpen, Award, MapPin, Star, TrendingUp, Users, Heart, X } from 'lucide-react';

const Goals = () => {
  const [goals, setGoals] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [view, setView] = useState('cards'); // cards only
  const [filter, setFilter] = useState('All');
  const [showJournal, setShowJournal] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: '',
    specific: '',
    measurable: '',
    achievable: '',
    relevant: '',
    timeBound: '',
    category: 'Personal Development',
    priority: 'Medium',
    deadline: '',
    milestones: [],
    notes: '',
    reminderEnabled: false,
    reminderFrequency: 'weekly'
  });

  const categories = [
    'All',
    'Personal Development',
    'Career', 
    'Finance',
    'Health & Wellness',
    'Travel',
    'Creative',
    'Relationships',
    'Learning'
  ];

  const priorities = ['Low', 'Medium', 'High'];
  const reminderFrequencies = ['daily', 'weekly', 'monthly'];

  // Add new goal
  const addGoal = (e) => {
    e.preventDefault();
    const goal = {
      id: Date.now(),
      ...newGoal,
      progress: 0,
      completedMilestones: 0,
      totalMilestones: newGoal.milestones.length,
      createdAt: new Date().toISOString(),
      journalEntries: [],
      badges: [],
      points: 0
    };
    setGoals([...goals, goal]);
    resetForm();
    setShowAddForm(false);
  };

  // Update goal
  const updateGoal = (e) => {
    e.preventDefault();
    setGoals(goals.map(goal => 
      goal.id === editingGoal.id 
        ? { ...goal, ...newGoal }
        : goal
    ));
    resetForm();
    setEditingGoal(null);
    setShowAddForm(false);
  };

  // Delete goal
  const deleteGoal = (id) => {
    setGoals(goals.filter(goal => goal.id !== id));
  };

  // Mark goal as complete
  const markGoalComplete = (id) => {
    const goal = goals.find(g => g.id === id);
    if (goal && window.confirm(`Are you sure you want to mark "${goal.title}" as complete? This will set the progress to 100% and mark all milestones as completed.`)) {
      setGoals(goals.map(goal => 
        goal.id === id 
          ? { 
              ...goal, 
              progress: 100,
              completedMilestones: goal.milestones ? goal.milestones.length : 0,
              milestones: goal.milestones ? goal.milestones.map(m => ({ ...m, completed: true })) : [],
              completedAt: new Date().toISOString()
            }
          : goal
      ));
    }
  };

  // Undo goal completion
  const undoGoalComplete = (id) => {
    const goal = goals.find(g => g.id === id);
    if (goal && window.confirm(`Are you sure you want to revert "${goal.title}" back to in-progress?`)) {
      setGoals(goals.map(goal => 
        goal.id === id 
          ? { 
              ...goal, 
              progress: Math.max(0, goal.progress - 100),
              completedAt: undefined
            }
          : goal
      ));
    }
  };

  // Edit goal
  const editGoal = (goal) => {
    setEditingGoal(goal);
    setNewGoal({
      title: goal.title,
      specific: goal.specific,
      measurable: goal.measurable,
      achievable: goal.achievable,
      relevant: goal.relevant,
      timeBound: goal.timeBound,
      category: goal.category,
      priority: goal.priority,
      deadline: goal.deadline,
      milestones: goal.milestones || [],
      notes: goal.notes,
      reminderEnabled: goal.reminderEnabled || false,
      reminderFrequency: goal.reminderFrequency || 'weekly'
    });
    setShowAddForm(true);
  };

  // Toggle milestone
  const toggleMilestone = (goalId, milestoneIndex) => {
    setGoals(goals.map(goal => {
      if (goal.id === goalId) {
        const updatedMilestones = [...goal.milestones];
        updatedMilestones[milestoneIndex].completed = !updatedMilestones[milestoneIndex].completed;
        
        const completedCount = updatedMilestones.filter(m => m.completed).length;
        const progress = updatedMilestones.length > 0 ? Math.round((completedCount / updatedMilestones.length) * 100) : 0;
        
        return {
          ...goal,
          milestones: updatedMilestones,
          completedMilestones: completedCount,
          progress: progress
        };
      }
      return goal;
    }));
  };

  // Add milestone
  const addMilestone = () => {
    setNewGoal({
      ...newGoal,
      milestones: [...newGoal.milestones, { title: '', completed: false, deadline: '' }]
    });
  };

  // Remove milestone
  const removeMilestone = (index) => {
    setNewGoal({
      ...newGoal,
      milestones: newGoal.milestones.filter((_, i) => i !== index)
    });
  };

  // Update milestone
  const updateMilestone = (index, field, value) => {
    const updatedMilestones = [...newGoal.milestones];
    updatedMilestones[index][field] = value;
    setNewGoal({ ...newGoal, milestones: updatedMilestones });
  };

  // Reset form
  const resetForm = () => {
    setNewGoal({
      title: '',
      specific: '',
      measurable: '',
      achievable: '',
      relevant: '',
      timeBound: '',
      category: 'Personal Development',
      priority: 'Medium',
      deadline: '',
      milestones: [],
      notes: '',
      reminderEnabled: false,
      reminderFrequency: 'weekly'
    });
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'text-red-400 bg-red-400/20 border-red-400/30';
      case 'Medium': return 'text-yellow-400 bg-yellow-400/20 border-yellow-400/30';
      case 'Low': return 'text-green-400 bg-green-400/20 border-green-400/30';
      default: return 'text-gray-400 bg-gray-400/20 border-gray-400/30';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'High': return '🔴';
      case 'Medium': return '🟡';
      case 'Low': return '🟢';
      default: return '⚪';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Personal Development': return '🧠';
      case 'Career': return '💼';
      case 'Finance': return '💰';
      case 'Health & Wellness': return '🧘';
      case 'Travel': return '�';
      case 'Creative': return '🎨';
      case 'Relationships': return '❤️';
      case 'Learning': return '📚';
      default: return '🎯';
    }
  };

  const getDaysUntilDeadline = (deadline) => {
    if (!deadline) return 'No deadline';
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return `${Math.abs(diffDays)} days overdue`;
    if (diffDays === 0) return 'Due today';
    if (diffDays === 1) return 'Due tomorrow';
    return `${diffDays} days left`;
  };

  const getStatusColor = (deadline, progress) => {
    const daysLeft = getDaysUntilDeadline(deadline);
    if (progress >= 100) return 'text-green-400';
    if (daysLeft.includes('overdue')) return 'text-red-400';
    if (daysLeft.includes('today') || daysLeft.includes('tomorrow')) return 'text-yellow-400';
    return 'text-blue-400';
  };

  const filteredGoals = filter === 'All' 
    ? goals 
    : goals.filter(goal => goal.category === filter);

  const totalGoals = goals.length;
  const completedGoals = goals.filter(g => g.progress >= 100).length;
  const inProgressGoals = goals.filter(g => g.progress > 0 && g.progress < 100).length;
  const avgProgress = goals.length > 0 
    ? Math.round(goals.reduce((sum, g) => sum + g.progress, 0) / goals.length)
    : 0;
  const upcomingDeadlines = goals.filter(g => {
    const days = getDaysUntilDeadline(g.deadline);
    return days.includes('days left') && parseInt(days) <= 7;
  }).length;

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Header Section */}
        <div className="glass-card-strong p-8 mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div>
              <h1 className="text-4xl font-bold text-white mb-3">
                🎯 SMART Goals
              </h1>
              <p className="text-white/80 text-lg">
                Turn your dreams into achievable milestones with structured goal setting
              </p>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowAddForm(true)}
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-8 py-4 rounded-2xl flex items-center gap-3 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <Plus size={24} />
                Create SMART Goal
              </button>
            </div>
          </div>
        </div>

        {/* Statistics & Insights Section */}
        <div className="glass-card-strong p-6 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            📊 Goal Analytics & Insights
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 p-6 rounded-xl border border-blue-400/30">
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-400 mb-2">{totalGoals}</div>
                <div className="text-white/80 font-medium">Total Goals</div>
                <div className="text-white/60 text-sm mt-1">Active tracking</div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-green-500/20 to-emerald-600/20 p-6 rounded-xl border border-green-400/30">
              <div className="text-center">
                <div className="text-4xl font-bold text-green-400 mb-2">{completedGoals}</div>
                <div className="text-white/80 font-medium">Completed</div>
                <div className="text-white/60 text-sm mt-1">100% achieved</div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-yellow-500/20 to-orange-600/20 p-6 rounded-xl border border-yellow-400/30">
              <div className="text-center">
                <div className="text-4xl font-bold text-yellow-400 mb-2">{inProgressGoals}</div>
                <div className="text-white/80 font-medium">In Progress</div>
                <div className="text-white/60 text-sm mt-1">Active work</div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-purple-500/20 to-violet-600/20 p-6 rounded-xl border border-purple-400/30">
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-400 mb-2">{avgProgress}%</div>
                <div className="text-white/80 font-medium">Avg Progress</div>
                <div className="text-white/60 text-sm mt-1">Overall rate</div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-red-500/20 to-pink-600/20 p-6 rounded-xl border border-red-400/30">
              <div className="text-center">
                <div className="text-4xl font-bold text-red-400 mb-2">{upcomingDeadlines}</div>
                <div className="text-white/80 font-medium">Due Soon</div>
                <div className="text-white/60 text-sm mt-1">Next 7 days</div>
              </div>
            </div>
          </div>
        </div>

        {/* Filter & View Controls Section */}
        <div className="glass-card-strong p-6 mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div>
              <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                🏷️ Filter & View Options
              </h3>
              <div className="flex flex-wrap gap-2">
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setFilter(category)}
                    className={`px-4 py-2 rounded-lg transition-all duration-300 border ${
                      filter === category 
                        ? 'bg-cyan-500 text-white border-cyan-400 shadow-lg' 
                        : 'bg-white/10 text-white/70 hover:bg-white/20 border-white/20 hover:border-white/40'
                    }`}
                  >
                    {getCategoryIcon(category)} {category}
                    {category !== 'All' && (
                      <span className="ml-2 text-xs bg-white/20 px-2 py-1 rounded-full">
                        {goals.filter(g => g.category === category).length}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-white/70 mb-2">View Mode</h4>
              <div className="flex gap-2">
                <button
                  onClick={() => setView('cards')}
                  className={`px-4 py-2 rounded-lg transition-all duration-300 border ${
                    view === 'cards' 
                      ? 'bg-blue-500 text-white border-blue-400' 
                      : 'bg-white/10 text-white/70 hover:bg-white/20 border-white/20'
                  }`}
                >
                  🗂️ Cards
                </button>
                <button
                  onClick={() => {
                    setShowCalendar(!showCalendar);
                    if (!showCalendar) {
                      setTimeout(() => {
                        document.getElementById('goals-calendar')?.scrollIntoView({ 
                          behavior: 'smooth',
                          block: 'start'
                        });
                      }, 100);
                    }
                  }}
                  className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-300"
                >
                  <Calendar size={16} />
                  {showCalendar ? 'Hide Calendar' : 'Show Calendar'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Goals Calendar Section */}
        {showCalendar && (
          <div id="goals-calendar" className="glass-card-strong p-6 mb-8">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-blue-500 rounded flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-xl font-bold text-white">365-Day Goal Journey</h2>
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
                🏆 {goals.reduce((total, goal) => total + (goal.completedAt ? 1 : 0), 0)} goals achieved in your journey!
              </div>
              <p className="text-gray-400 text-sm">
                {goals.length > 0 ? 
                  `Tracking ${goals.length} goals • Completed: ${completedGoals} • In Progress: ${inProgressGoals}` :
                  "Start your goal journey by adding your first goal!"
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
                                    
                                    // Get goals completed on this day
                                    const goalsCompletedOnDay = goals.filter(goal => 
                                      goal.completedAt && new Date(goal.completedAt).toDateString() === dateString
                                    );
                                    const completedCount = goalsCompletedOnDay.length;
                                    
                                    // Get milestones completed on this day
                                    const milestonesCompletedOnDay = goals.reduce((total, goal) => {
                                      if (goal.milestones) {
                                        return total + goal.milestones.filter(milestone => 
                                          milestone.completed && milestone.deadline && 
                                          new Date(milestone.deadline).toDateString() === dateString
                                        ).length;
                                      }
                                      return total;
                                    }, 0);
                                    
                                    const totalActivityCount = completedCount + milestonesCompletedOnDay;
                                    
                                    // Calculate intensity (0-4 levels)
                                    const intensity = totalActivityCount === 0 ? 0 : Math.min(4, Math.ceil((totalActivityCount / Math.max(1, Math.ceil(goals.length / 10))) * 4));
                                    
                                    // Create tooltip with goal and milestone activity
                                    let tooltipText = `${date.toLocaleDateString('en-US', { 
                                      weekday: 'short', 
                                      month: 'short', 
                                      day: 'numeric', 
                                      year: 'numeric' 
                                    })}`;
                                    
                                    if (totalActivityCount > 0) {
                                      tooltipText += `\n🎯 ${totalActivityCount} achievement${totalActivityCount > 1 ? 's' : ''}:`;
                                      if (completedCount > 0) {
                                        tooltipText += `\n• ${completedCount} goal${completedCount > 1 ? 's' : ''} completed`;
                                      }
                                      if (milestonesCompletedOnDay > 0) {
                                        tooltipText += `\n• ${milestonesCompletedOnDay} milestone${milestonesCompletedOnDay > 1 ? 's' : ''} reached`;
                                      }
                                    } else {
                                      tooltipText += `\n💤 No achievements on this day`;
                                    }
                                    
                                    return (
                                      <div
                                        key={dayIndex}
                                        className={`w-3 h-3 rounded-sm cursor-pointer transition-all hover:scale-110 hover:ring-1 hover:ring-white/50 ${
                                          intensity === 0 ? 'bg-gray-700/50' :
                                          intensity === 1 ? 'bg-blue-800' :
                                          intensity === 2 ? 'bg-blue-600' :
                                          intensity === 3 ? 'bg-blue-400' :
                                          'bg-blue-300'
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
              <span>Less activity</span>
              <div className="flex gap-1 items-center">
                <div className="w-3 h-3 rounded-sm bg-gray-700"></div>
                <div className="w-3 h-3 rounded-sm bg-blue-800"></div>
                <div className="w-3 h-3 rounded-sm bg-blue-600"></div>
                <div className="w-3 h-3 rounded-sm bg-blue-400"></div>
                <div className="w-3 h-3 rounded-sm bg-blue-300"></div>
              </div>
              <span>More activity</span>
            </div>
            
            {/* Calendar Stats with Creative Labels */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="bg-white/5 rounded-lg p-3">
                <div className="text-lg font-bold text-blue-300">
                  {goals.reduce((total, goal) => total + (goal.completedAt ? 1 : 0), 0)}
                </div>
                <div className="text-xs text-gray-400">🎯 Goals Achieved</div>
              </div>
              <div className="bg-white/5 rounded-lg p-3">
                <div className="text-lg font-bold text-green-300">
                  {goals.reduce((total, goal) => total + (goal.milestones ? goal.milestones.filter(m => m.completed).length : 0), 0)}
                </div>
                <div className="text-xs text-gray-400">🎖️ Milestones Reached</div>
              </div>
              <div className="bg-white/5 rounded-lg p-3">
                <div className="text-lg font-bold text-yellow-300">
                  {Math.round(avgProgress)}%
                </div>
                <div className="text-xs text-gray-400">⭐ Average Progress</div>
              </div>
              <div className="bg-white/5 rounded-lg p-3">
                <div className="text-lg font-bold text-purple-300">
                  {upcomingDeadlines}
                </div>
                <div className="text-xs text-gray-400">🚨 Due This Week</div>
              </div>
            </div>
            
            {/* Recent Activity */}
            {goals.length > 0 && (
              <div className="mt-6 p-4 bg-white/5 rounded-lg">
                <h4 className="text-sm font-semibold text-white mb-3">🌟 Recent Achievements</h4>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {goals
                    .filter(goal => goal.completedAt)
                    .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))
                    .slice(0, 5)
                    .map(goal => (
                      <div key={goal.id} className="flex justify-between items-center text-xs">
                        <span className="text-gray-300">{goal.title}</span>
                        <span className="text-blue-400">
                          {new Date(goal.completedAt).toLocaleDateString()}
                        </span>
                      </div>
                    ))
                  }
                  {goals.filter(goal => goal.completedAt).length === 0 && (
                    <div className="text-xs text-gray-400 text-center py-2">
                      Complete your first goal to see achievements here! 🎯
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Vision Board Section */}
        {false && (
          <div className="glass-card-strong p-6 mb-8">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              ✨ Vision Board
            </h2>
            <div className="bg-white/5 p-8 rounded-xl border border-white/20 text-center">
              <div className="text-6xl mb-4">🎨</div>
              <h3 className="text-xl font-semibold text-white mb-2">Your Visual Inspiration</h3>
              <p className="text-white/60 mb-6">
                Create a visual representation of your goals with images, quotes, and inspiration.
                Drag and drop photos, add motivational quotes, and visualize your success!
              </p>
              <button className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-6 py-3 rounded-lg hover:from-purple-600 hover:to-pink-700 transition-all duration-300">
                Upload Inspiration Images
              </button>
            </div>
          </div>
        )}

        {/* Goals List Section */}
        <div className="glass-card-strong p-6 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            🎯 Your SMART Goals
            <span className="text-lg font-normal text-white/60">
              ({filteredGoals.length} {filter !== 'All' ? `in ${filter}` : 'total'})
            </span>
          </h2>
          
          {filteredGoals.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {goals.length === 0 ? "No goals yet!" : `No goals in ${filter}`}
              </h3>
              <p className="text-white/60 mb-6">
                {goals.length === 0 
                  ? "Start your journey by creating your first SMART goal." 
                  : `Try a different category or add a new ${filter.toLowerCase()} goal.`
                }
              </p>
              <button
                onClick={() => setShowAddForm(true)}
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105"
              >
                Create Your First Goal
              </button>
            </div>
          ) : (
            <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6`}>
              {filteredGoals.map(goal => (
                <div key={goal.id} className="bg-white/5 hover:bg-white/10 border border-white/20 hover:border-white/30 p-6 rounded-xl transition-all duration-300 transform hover:scale-105">
                  
                  {/* Goal Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4">
                      <span className="text-3xl">{getCategoryIcon(goal.category)}</span>
                      <div>
                        <h3 className="text-xl font-bold text-white mb-1">{goal.title}</h3>
                        <div className="flex items-center gap-2 text-sm text-white/60">
                          <span>{goal.category}</span>
                          <span>•</span>
                          <span className={`px-3 py-1 rounded-full border font-medium ${getPriorityColor(goal.priority)}`}>
                            {getPriorityIcon(goal.priority)} {goal.priority}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => setShowJournal(showJournal === goal.id ? null : goal.id)}
                        className="text-white/60 hover:text-blue-400 transition-colors duration-300 p-2 rounded hover:bg-blue-400/20"
                        title="Goal Journal"
                      >
                        <BookOpen size={16} />
                      </button>
                      <button 
                        onClick={() => editGoal(goal)}
                        className="text-white/60 hover:text-green-400 transition-colors duration-300 p-2 rounded hover:bg-green-400/20"
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        onClick={() => deleteGoal(goal.id)}
                        className="text-white/60 hover:text-red-400 transition-colors duration-300 p-2 rounded hover:bg-red-400/20"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  {/* SMART Framework Display */}
                  <div className="mb-4 bg-white/5 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-white/80 mb-2">SMART Framework</h4>
                    <div className="text-xs text-white/60 space-y-1">
                      {goal.specific && <div><strong>Specific:</strong> {goal.specific}</div>}
                      {goal.measurable && <div><strong>Measurable:</strong> {goal.measurable}</div>}
                      {goal.relevant && <div><strong>Relevant:</strong> {goal.relevant}</div>}
                    </div>
                  </div>

                  {/* Progress Ring/Bar */}
                  <div className="mb-6">
                    <div className="flex justify-between items-center text-sm text-white/70 mb-2">
                      <span>Overall Progress</span>
                      <span>{goal.progress}%</span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-4 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-cyan-500 to-blue-600 h-4 rounded-full transition-all duration-500 relative"
                        style={{ width: `${goal.progress}%` }}
                      >
                        <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                      </div>
                    </div>
                  </div>

                  {/* Timeline & Deadline */}
                  <div className="flex items-center justify-between mb-4 text-white/70">
                    <div className="flex items-center gap-2">
                      <Calendar size={16} />
                      <span className="text-sm">
                        Deadline: {goal.deadline ? new Date(goal.deadline).toLocaleDateString() : 'Not set'}
                      </span>
                    </div>
                    <span className={`text-sm font-medium ${getStatusColor(goal.deadline, goal.progress)}`}>
                      {getDaysUntilDeadline(goal.deadline)}
                    </span>
                  </div>

                  {/* Milestones & Subgoals */}
                  {goal.milestones && goal.milestones.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                        <Target size={16} />
                        Milestones ({goal.completedMilestones || 0}/{goal.milestones.length})
                      </h4>
                      <div className="space-y-2 max-h-32 overflow-y-auto">
                        {goal.milestones.map((milestone, index) => (
                          <div key={index} className="flex items-center gap-3 bg-white/5 p-2 rounded">
                            <button
                              onClick={() => toggleMilestone(goal.id, index)}
                              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                                milestone.completed 
                                  ? 'bg-green-500 border-green-500 text-white' 
                                  : 'border-white/40 hover:border-green-400'
                              }`}
                            >
                              {milestone.completed && <CheckCircle size={12} />}
                            </button>
                            <span className={`text-sm flex-1 ${
                              milestone.completed ? 'text-white/60 line-through' : 'text-white/80'
                            }`}>
                              {milestone.title}
                            </span>
                            {milestone.deadline && (
                              <span className="text-xs text-white/50">
                                {new Date(milestone.deadline).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Gamification & Rewards */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 p-3 rounded-lg border border-yellow-400/30 text-center">
                      <div className="text-yellow-400 font-bold text-lg">{goal.points || 0}</div>
                      <div className="text-white/60 text-xs">Points Earned</div>
                    </div>
                    <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 p-3 rounded-lg border border-purple-400/30 text-center">
                      <div className="text-purple-400 font-bold text-lg">{goal.badges ? goal.badges.length : 0}</div>
                      <div className="text-white/60 text-xs">Badges Earned</div>
                    </div>
                  </div>

                  {/* Complete Goal Button */}
                  <div className="mb-4">
                    {goal.progress >= 100 ? (
                      <div className="space-y-2">
                        <div className="w-full py-3 rounded-lg font-medium bg-green-500 text-white flex items-center justify-center gap-2">
                          <CheckCircle className="w-5 h-5" />
                          Goal Completed! 🎉
                          {goal.completedAt && (
                            <span className="text-xs text-green-200 ml-2">
                              on {new Date(goal.completedAt).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                        <button
                          onClick={() => undoGoalComplete(goal.id)}
                          className="w-full py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 bg-white/10 text-gray-400 hover:bg-white/20 hover:text-white border border-white/20"
                        >
                          Revert to In-Progress
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => markGoalComplete(goal.id)}
                        className="w-full py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 bg-white/10 text-gray-300 hover:bg-gradient-to-r hover:from-green-500 hover:to-emerald-600 hover:text-white border border-white/20 hover:border-green-400"
                      >
                        <CheckCircle className="w-5 h-5" />
                        Mark Goal Complete
                      </button>
                    )}
                  </div>

                  {/* Goal Reminders */}
                  {goal.reminderEnabled && (
                    <div className="bg-blue-500/20 p-3 rounded-lg border border-blue-400/30 mb-4">
                      <div className="flex items-center gap-2 text-blue-400 text-sm">
                        <Clock size={14} />
                        <span>Reminders: {goal.reminderFrequency} check-ins enabled</span>
                      </div>
                    </div>
                  )}

                  {/* Goal Journal/Notes */}
                  {showJournal === goal.id && (
                    <div className="bg-white/5 p-4 rounded-lg border border-white/20">
                      <h5 className="text-white font-medium mb-2 flex items-center gap-2">
                        <BookOpen size={16} />
                        Goal Journal & Notes
                      </h5>
                      <textarea
                        placeholder="Add your reflections, struggles, wins, and progress notes..."
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/50 text-sm resize-none h-24"
                        defaultValue={goal.notes}
                      />
                      <div className="mt-2 text-xs text-white/50">
                        Auto-saves as you type
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* SMART Goal Creation Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="glass-card-strong p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-white">
                  {editingGoal ? '✏️ Edit SMART Goal' : '🎯 Create SMART Goal'}
                </h2>
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingGoal(null);
                    resetForm();
                  }}
                  className="text-white/60 hover:text-white transition-colors duration-300"
                >
                  <Trash2 size={24} />
                </button>
              </div>
              
              <div className="mb-6 p-4 bg-blue-500/20 border border-blue-400/30 rounded-lg">
                <p className="text-blue-300 text-sm">
                  <span className="text-red-400">*</span> Required fields: Goal Title, Category, Priority Level, and Deadline. 
                  All other fields are optional but help make your goal more structured.
                </p>
              </div>
              
              <form onSubmit={editingGoal ? updateGoal : addGoal} className="space-y-6">
                
                {/* Goal Title */}
                <div>
                  <label className="block text-white/80 mb-2 font-medium">
                    Goal Title <span className="text-red-400">*</span>
                  </label>
                  <input 
                    type="text" 
                    value={newGoal.title}
                    onChange={(e) => setNewGoal({...newGoal, title: e.target.value})}
                    placeholder="e.g., Complete React Certification, Save $10,000, Run Marathon"
                    className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300"
                    required
                  />
                </div>

                {/* Category & Priority */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-white/80 mb-2 font-medium">
                      Category <span className="text-red-400">*</span>
                    </label>
                    <select 
                      value={newGoal.category}
                      onChange={(e) => setNewGoal({...newGoal, category: e.target.value})}
                      className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-3 text-white focus:border-cyan-400 focus:outline-none"
                      required
                    >
                      {categories.slice(1).map(cat => (
                        <option key={cat} value={cat} className="bg-gray-800">
                          {getCategoryIcon(cat)} {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-white/80 mb-2 font-medium">
                      Priority Level <span className="text-red-400">*</span>
                    </label>
                    <select 
                      value={newGoal.priority}
                      onChange={(e) => setNewGoal({...newGoal, priority: e.target.value})}
                      className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-3 text-white focus:border-cyan-400 focus:outline-none"
                      required
                    >
                      {priorities.map(priority => (
                        <option key={priority} value={priority} className="bg-gray-800">
                          {getPriorityIcon(priority)} {priority}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-white/80 mb-2 font-medium">
                      Deadline <span className="text-red-400">*</span>
                    </label>
                    <input 
                      type="date" 
                      value={newGoal.deadline}
                      onChange={(e) => setNewGoal({...newGoal, deadline: e.target.value})}
                      className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-3 text-white focus:border-cyan-400 focus:outline-none"
                      required
                    />
                  </div>
                </div>

                {/* SMART Framework Section */}
                <div className="bg-white/5 p-6 rounded-xl border border-white/20">
                  <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                    🎯 SMART Framework
                  </h3>
                  <p className="text-white/60 text-sm mb-4">
                    Optional: Use the SMART framework to make your goal more structured and achievable.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Specific */}
                    <div>
                      <label className="block text-white/80 mb-2 font-medium">
                        <span className="text-cyan-400">S</span>pecific - What exactly do you want to accomplish?
                      </label>
                      <textarea 
                        value={newGoal.specific}
                        onChange={(e) => setNewGoal({...newGoal, specific: e.target.value})}
                        placeholder="Be clear and detailed about your goal..."
                        className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:border-cyan-400 focus:outline-none h-20 resize-none"
                      />
                    </div>

                    {/* Measurable */}
                    <div>
                      <label className="block text-white/80 mb-2 font-medium">
                        <span className="text-cyan-400">M</span>easurable - How will you measure success?
                      </label>
                      <textarea 
                        value={newGoal.measurable}
                        onChange={(e) => setNewGoal({...newGoal, measurable: e.target.value})}
                        placeholder="Define metrics and success criteria..."
                        className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:border-cyan-400 focus:outline-none h-20 resize-none"
                      />
                    </div>

                    {/* Achievable */}
                    <div>
                      <label className="block text-white/80 mb-2 font-medium">
                        <span className="text-cyan-400">A</span>chievable - Is it realistic and attainable?
                      </label>
                      <textarea 
                        value={newGoal.achievable}
                        onChange={(e) => setNewGoal({...newGoal, achievable: e.target.value})}
                        placeholder="Explain why this goal is realistic for you..."
                        className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:border-cyan-400 focus:outline-none h-20 resize-none"
                      />
                    </div>

                    {/* Relevant */}
                    <div>
                      <label className="block text-white/80 mb-2 font-medium">
                        <span className="text-cyan-400">R</span>elevant - Why is this goal important to you?
                      </label>
                      <textarea 
                        value={newGoal.relevant}
                        onChange={(e) => setNewGoal({...newGoal, relevant: e.target.value})}
                        placeholder="Describe the value and importance..."
                        className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:border-cyan-400 focus:outline-none h-20 resize-none"
                      />
                    </div>
                  </div>

                  {/* Time-bound */}
                  <div className="mt-6">
                    <label className="block text-white/80 mb-2 font-medium">
                      <span className="text-cyan-400">T</span>ime-bound - Additional timeline considerations
                    </label>
                    <textarea 
                      value={newGoal.timeBound}
                      onChange={(e) => setNewGoal({...newGoal, timeBound: e.target.value})}
                      placeholder="Why this timeline? Any constraints or considerations..."
                      className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:border-cyan-400 focus:outline-none h-12 resize-none"
                    />
                  </div>
                </div>

                {/* Milestones & Subgoals */}
                <div className="bg-white/5 p-6 rounded-xl border border-white/20">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-white">🎯 Milestones & Subgoals</h3>
                    <button
                      type="button"
                      onClick={addMilestone}
                      className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg text-sm transition-colors duration-300"
                    >
                      Add Milestone
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    {newGoal.milestones.map((milestone, index) => (
                      <div key={index} className="bg-white/5 p-4 rounded-lg border border-white/10">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="md:col-span-2">
                            <input
                              type="text"
                              value={milestone.title}
                              onChange={(e) => updateMilestone(index, 'title', e.target.value)}
                              placeholder="Milestone description..."
                              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/50 focus:border-cyan-400 focus:outline-none"
                            />
                          </div>
                          <div className="flex gap-2">
                            <input
                              type="date"
                              value={milestone.deadline}
                              onChange={(e) => updateMilestone(index, 'deadline', e.target.value)}
                              className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:border-cyan-400 focus:outline-none"
                            />
                            <button
                              type="button"
                              onClick={() => removeMilestone(index)}
                              className="text-red-400 hover:text-red-300 p-2"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Goal Reminders */}
                <div className="bg-white/5 p-6 rounded-xl border border-white/20">
                  <h3 className="text-lg font-bold text-white mb-4">🔔 Goal Reminders</h3>
                  <div className="flex items-center gap-4 mb-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={newGoal.reminderEnabled}
                        onChange={(e) => setNewGoal({...newGoal, reminderEnabled: e.target.checked})}
                        className="rounded"
                      />
                      <span className="text-white/80">Enable reminder notifications</span>
                    </label>
                  </div>
                  
                  {newGoal.reminderEnabled && (
                    <div>
                      <label className="block text-white/80 mb-2">Reminder Frequency</label>
                      <select 
                        value={newGoal.reminderFrequency}
                        onChange={(e) => setNewGoal({...newGoal, reminderFrequency: e.target.value})}
                        className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-3 text-white focus:border-cyan-400 focus:outline-none"
                      >
                        {reminderFrequencies.map(freq => (
                          <option key={freq} value={freq} className="bg-gray-800 capitalize">
                            {freq} check-ins
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                {/* Goal Notes/Journal */}
                <div>
                  <label className="block text-white/80 mb-2 font-medium">Goal Notes & Initial Thoughts</label>
                  <textarea 
                    value={newGoal.notes}
                    onChange={(e) => setNewGoal({...newGoal, notes: e.target.value})}
                    placeholder="Add any additional notes, thoughts, or plans for this goal..."
                    className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:border-cyan-400 focus:outline-none h-24 resize-none"
                  />
                </div>
                
                {/* Action Buttons */}
                <div className="flex gap-4 pt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddForm(false);
                      setEditingGoal(null);
                      resetForm();
                    }}
                    className="flex-1 bg-white/10 hover:bg-white/20 text-white py-4 rounded-lg transition-all duration-300 border border-white/30 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white py-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg font-medium"
                  >
                    {editingGoal ? 'Update Goal' : 'Create SMART Goal'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Goals;
