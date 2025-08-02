import React, { useState, useEffect } from 'react';
import './index.css';

const Planner = () => {
  const [currentView, setCurrentView] = useState('daily');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [tasks, setTasks] = useState([]);
  const [timeBlocks, setTimeBlocks] = useState([]);
  const [stickyNotes, setStickyNotes] = useState([]);
  const [focusSession, setFocusSession] = useState({ active: false, duration: 25, timeLeft: 0 });
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [reminders, setReminders] = useState([]);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium',
    category: '',
    timeBlock: '',
    recurring: 'none',
    reminder: false,
    reminderTime: ''
  });
  const [newNote, setNewNote] = useState({
    content: '',
    color: '#FFE066',
    position: { x: 100, y: 100 }
  });

  // Time slots for time blocking (24-hour format)
  const timeSlots = Array.from({ length: 24 }, (_, i) => {
    const hour = i.toString().padStart(2, '0');
    return `${hour}:00`;
  });

  const priorityColors = {
    high: '#FF6B6B',
    medium: '#4ECDC4',
    low: '#95E1D3'
  };

  const noteColors = [
    '#FFE066', '#FF6B6B', '#4ECDC4', '#95E1D3', 
    '#A8E6CF', '#FFB3BA', '#BFEFFF', '#E6E6FA'
  ];

  // Format date for display
  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Get week dates for weekly view
  const getWeekDates = (date) => {
    const week = [];
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay());
    
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      week.push(day);
    }
    return week;
  };

  // Add new task
  const addTask = () => {
    if (newTask.title.trim()) {
      const task = {
        id: Date.now(),
        ...newTask,
        completed: false,
        createdAt: new Date(),
        date: selectedDate.toDateString()
      };
      setTasks([...tasks, task]);
      
      // Add reminder if enabled
      if (newTask.reminder && newTask.reminderTime) {
        const reminderDateTime = new Date(selectedDate);
        const [hours, minutes] = newTask.reminderTime.split(':');
        reminderDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
        
        const reminder = {
          id: Date.now() + 1,
          taskId: task.id,
          taskTitle: task.title,
          dateTime: reminderDateTime,
          active: true
        };
        setReminders([...reminders, reminder]);
        
        // Schedule browser notification
        scheduleReminder(reminder);
      }
      
      setNewTask({
        title: '',
        description: '',
        priority: 'medium',
        category: '',
        timeBlock: '',
        recurring: 'none',
        reminder: false,
        reminderTime: ''
      });
      setShowTaskForm(false);
    }
  };

  // Schedule reminder notification
  const scheduleReminder = (reminder) => {
    const now = new Date();
    const timeUntilReminder = reminder.dateTime.getTime() - now.getTime();
    
    if (timeUntilReminder > 0) {
      setTimeout(() => {
        if (Notification.permission === 'granted') {
          new Notification(`📅 GoalMaster Reminder`, {
            body: `Task: ${reminder.taskTitle}`,
            icon: '/goalmaster logo.jpeg'
          });
        }
        // Mark reminder as triggered
        setReminders(prev => prev.map(r => 
          r.id === reminder.id ? { ...r, active: false } : r
        ));
      }, timeUntilReminder);
    }
  };

  // Request notification permission
  useEffect(() => {
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // Check for active reminders
  const getActiveReminders = () => {
    const now = new Date();
    const today = now.toDateString();
    
    return reminders.filter(reminder => {
      const reminderDate = reminder.dateTime.toDateString();
      const isToday = reminderDate === today;
      const isUpcoming = reminder.dateTime > now;
      return reminder.active && isToday && isUpcoming;
    });
  };

  // Delete reminder when task is deleted
  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
    setReminders(reminders.filter(reminder => reminder.taskId !== id));
  };

  // Toggle task completion
  const toggleTask = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  // Get calendar data for monthly view
  const getMonthlyCalendar = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    const currentDate = new Date(startDate);
    
    // Generate 42 days (6 weeks) for the calendar grid
    for (let i = 0; i < 42; i++) {
      const dayTasks = tasks.filter(task => task.date === currentDate.toDateString());
      const isCurrentMonth = currentDate.getMonth() === month;
      const isToday = currentDate.toDateString() === new Date().toDateString();
      const isSelected = currentDate.toDateString() === selectedDate.toDateString();
      
      days.push({
        date: new Date(currentDate),
        dayNumber: currentDate.getDate(),
        isCurrentMonth,
        isToday,
        isSelected,
        tasks: dayTasks,
        taskCount: dayTasks.length,
        completedTasks: dayTasks.filter(task => task.completed).length
      });
      
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return days;
  };

  // Navigate months
  const navigateMonth = (direction) => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setSelectedDate(newDate);
  };

  // Add sticky note
  const addStickyNote = () => {
    if (newNote.content.trim()) {
      const note = {
        id: Date.now(),
        ...newNote,
        createdAt: new Date()
      };
      setStickyNotes([...stickyNotes, note]);
      setNewNote({
        content: '',
        color: '#FFE066',
        position: { x: 100, y: 100 }
      });
      setShowNoteForm(false);
    }
  };

  // Delete sticky note
  const deleteStickyNote = (id) => {
    setStickyNotes(stickyNotes.filter(note => note.id !== id));
  };

  // Start focus session
  const startFocusSession = () => {
    setFocusSession({
      active: true,
      duration: focusSession.duration,
      timeLeft: focusSession.duration * 60
    });
  };

  // Focus timer effect
  useEffect(() => {
    let interval;
    if (focusSession.active && focusSession.timeLeft > 0) {
      interval = setInterval(() => {
        setFocusSession(prev => ({
          ...prev,
          timeLeft: prev.timeLeft - 1
        }));
      }, 1000);
    } else if (focusSession.timeLeft === 0 && focusSession.active) {
      setFocusSession(prev => ({ ...prev, active: false }));
      // Could add notification here
    }
    return () => clearInterval(interval);
  }, [focusSession.active, focusSession.timeLeft]);

  // Format time for focus timer
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Get tasks for selected date
  const getTasksForDate = (date) => {
    return tasks.filter(task => task.date === date.toDateString());
  };

  // Get analytics data
  const getAnalytics = () => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.completed).length;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    
    const priorityCounts = tasks.reduce((acc, task) => {
      acc[task.priority] = (acc[task.priority] || 0) + 1;
      return acc;
    }, {});

    return { totalTasks, completedTasks, completionRate, priorityCounts };
  };

  const analytics = getAnalytics();

  return (
    <div className="min-h-screen bg-cover bg-center bg-fixed bg-no-repeat p-6 relative" style={{backgroundImage: 'url(/bg-image.png)'}}>
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="glass-card-strong p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">📅 Smart Planner</h1>
              <p className="text-blue-200">Organize your time, maximize your productivity</p>
            </div>
            
            {/* View Toggle */}
            <div className="flex gap-2">
              {['daily', 'weekly', 'monthly'].map(view => (
                <button
                  key={view}
                  onClick={() => setCurrentView(view)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    currentView === view
                      ? 'bg-blue-500 text-white shadow-lg'
                      : 'bg-white/10 text-blue-200 hover:bg-white/20'
                  }`}
                >
                  {view.charAt(0).toUpperCase() + view.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Main Planning Area */}
          <div className="xl:col-span-3 space-y-6">
            {/* Date Navigation */}
            <div className="glass-card-strong p-4">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => {
                    const prevDate = new Date(selectedDate);
                    prevDate.setDate(prevDate.getDate() - 1);
                    setSelectedDate(prevDate);
                  }}
                  className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all"
                >
                  ←
                </button>
                
                <h2 className="text-xl font-semibold text-white">
                  {formatDate(selectedDate)}
                </h2>
                
                <button
                  onClick={() => {
                    const nextDate = new Date(selectedDate);
                    nextDate.setDate(nextDate.getDate() + 1);
                    setSelectedDate(nextDate);
                  }}
                  className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all"
                >
                  →
                </button>
              </div>
            </div>

            {/* Time Blocking Grid */}
            {currentView === 'daily' && (
              <div className="glass-card-strong p-6">
                <h3 className="text-xl font-semibold text-white mb-4">🕐 Time Blocks</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 max-h-96 overflow-y-auto">
                  {timeSlots.map(time => {
                    const hasTask = getTasksForDate(selectedDate).find(task => task.timeBlock === time);
                    return (
                      <div
                        key={time}
                        className={`p-3 rounded-lg border transition-all cursor-pointer ${
                          hasTask
                            ? 'bg-blue-500/20 border-blue-400 text-white'
                            : 'bg-white/5 border-white/10 text-blue-200 hover:bg-white/10'
                        }`}
                      >
                        <div className="font-medium">{time}</div>
                        {hasTask && (
                          <div className="text-sm mt-1 text-blue-200">
                            {hasTask.title}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Weekly View */}
            {currentView === 'weekly' && (
              <div className="glass-card-strong p-6">
                <h3 className="text-xl font-semibold text-white mb-4">📅 Weekly Overview</h3>
                <div className="grid grid-cols-7 gap-2">
                  {getWeekDates(selectedDate).map((date, index) => {
                    const dayTasks = getTasksForDate(date);
                    const isToday = date.toDateString() === new Date().toDateString();
                    
                    return (
                      <div
                        key={index}
                        className={`p-3 rounded-lg border transition-all cursor-pointer ${
                          isToday
                            ? 'bg-blue-500/30 border-blue-400'
                            : 'bg-white/5 border-white/10 hover:bg-white/10'
                        }`}
                        onClick={() => setSelectedDate(date)}
                      >
                        <div className="text-sm font-medium text-white">
                          {date.toLocaleDateString('en-US', { weekday: 'short' })}
                        </div>
                        <div className="text-lg font-bold text-white">
                          {date.getDate()}
                        </div>
                        <div className="text-xs text-blue-200 mt-1">
                          {dayTasks.length} tasks
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Monthly View */}
            {currentView === 'monthly' && (
              <div className="glass-card-strong p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-white">🗓️ Monthly View</h3>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => navigateMonth(-1)}
                      className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all"
                    >
                      ←
                    </button>
                    <h4 className="text-lg font-medium text-white min-w-[200px] text-center">
                      {selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </h4>
                    <button
                      onClick={() => navigateMonth(1)}
                      className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all"
                    >
                      →
                    </button>
                  </div>
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-1 mb-4">
                  {/* Day headers */}
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="p-3 text-center text-blue-200 font-medium text-sm">
                      {day}
                    </div>
                  ))}
                  
                  {/* Calendar days */}
                  {getMonthlyCalendar(selectedDate).map((day, index) => (
                    <div
                      key={index}
                      onClick={() => setSelectedDate(day.date)}
                      className={`
                        relative p-2 min-h-[80px] border border-white/10 cursor-pointer transition-all hover:bg-white/5
                        ${day.isCurrentMonth ? 'bg-white/5' : 'bg-white/2 opacity-50'}
                        ${day.isToday ? 'ring-2 ring-blue-400' : ''}
                        ${day.isSelected ? 'bg-blue-500/30 border-blue-400' : ''}
                      `}
                    >
                      <div className="text-sm font-medium text-white mb-1">
                        {day.dayNumber}
                      </div>
                      
                      {/* Task indicators */}
                      {day.taskCount > 0 && (
                        <div className="space-y-1">
                          <div className="flex items-center gap-1">
                            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                            <span className="text-xs text-blue-200">{day.taskCount}</span>
                          </div>
                          {day.completedTasks > 0 && (
                            <div className="flex items-center gap-1">
                              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                              <span className="text-xs text-green-200">{day.completedTasks}</span>
                            </div>
                          )}
                        </div>
                      )}
                      
                      {/* Priority task indicators */}
                      {day.tasks.slice(0, 2).map((task, taskIndex) => (
                        <div
                          key={taskIndex}
                          className={`
                            absolute bottom-1 left-1 w-1 h-4 rounded-full opacity-70
                            ${task.priority === 'high' ? 'bg-red-400' : 
                              task.priority === 'medium' ? 'bg-yellow-400' : 'bg-green-400'}
                          `}
                          style={{ left: `${4 + taskIndex * 6}px` }}
                        ></div>
                      ))}
                    </div>
                  ))}
                </div>

                {/* Monthly Stats */}
                <div className="grid grid-cols-3 gap-4 mt-6">
                  <div className="text-center p-4 bg-white/5 rounded-lg">
                    <div className="text-2xl font-bold text-white">
                      {tasks.filter(task => {
                        const taskDate = new Date(task.date);
                        return taskDate.getMonth() === selectedDate.getMonth() && 
                               taskDate.getFullYear() === selectedDate.getFullYear();
                      }).length}
                    </div>
                    <div className="text-xs text-blue-200">Tasks This Month</div>
                  </div>
                  <div className="text-center p-4 bg-white/5 rounded-lg">
                    <div className="text-2xl font-bold text-green-400">
                      {tasks.filter(task => {
                        const taskDate = new Date(task.date);
                        return taskDate.getMonth() === selectedDate.getMonth() && 
                               taskDate.getFullYear() === selectedDate.getFullYear() &&
                               task.completed;
                      }).length}
                    </div>
                    <div className="text-xs text-blue-200">Completed</div>
                  </div>
                  <div className="text-center p-4 bg-white/5 rounded-lg">
                    <div className="text-2xl font-bold text-blue-400">
                      {getActiveReminders().length}
                    </div>
                    <div className="text-xs text-blue-200">Active Reminders</div>
                  </div>
                </div>
              </div>
            )}

            {/* Task List */}
            <div className="glass-card-strong p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-white">✅ Tasks</h3>
                <button
                  onClick={() => setShowTaskForm(true)}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all"
                >
                  + Add Task
                </button>
              </div>

              {getTasksForDate(selectedDate).length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-6xl mb-4">📝</div>
                  <p className="text-blue-200 mb-4">No tasks planned for this day</p>
                  <button
                    onClick={() => setShowTaskForm(true)}
                    className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all"
                  >
                    Create Your First Task
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {getTasksForDate(selectedDate).map(task => (
                    <div
                      key={task.id}
                      className={`p-4 rounded-lg border transition-all ${
                        task.completed
                          ? 'bg-green-500/20 border-green-400'
                          : 'bg-white/5 border-white/10'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <button
                          onClick={() => toggleTask(task.id)}
                          className={`mt-1 w-5 h-5 rounded border-2 transition-all ${
                            task.completed
                              ? 'bg-green-500 border-green-500'
                              : 'border-white/30 hover:border-white/50'
                          }`}
                        >
                          {task.completed && (
                            <div className="text-white text-xs">✓</div>
                          )}
                        </button>
                        
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className={`font-semibold ${
                                task.completed ? 'text-green-200 line-through' : 'text-white'
                              }`}>
                                {task.title}
                              </h4>
                              {task.description && (
                                <p className="text-blue-200 text-sm mt-1">{task.description}</p>
                              )}
                              <div className="flex items-center gap-2 mt-2">
                                <span
                                  className="px-2 py-1 rounded text-xs font-medium"
                                  style={{
                                    backgroundColor: priorityColors[task.priority] + '20',
                                    color: priorityColors[task.priority]
                                  }}
                                >
                                  {task.priority}
                                </span>
                                {task.category && (
                                  <span className="px-2 py-1 bg-purple-500/20 text-purple-200 rounded text-xs">
                                    {task.category}
                                  </span>
                                )}
                                {task.timeBlock && (
                                  <span className="px-2 py-1 bg-blue-500/20 text-blue-200 rounded text-xs">
                                    {task.timeBlock}
                                  </span>
                                )}
                                {task.recurring !== 'none' && (
                                  <span className="px-2 py-1 bg-orange-500/20 text-orange-200 rounded text-xs">
                                    🔄 {task.recurring}
                                  </span>
                                )}
                                {task.reminder && (
                                  <span className="px-2 py-1 bg-yellow-500/20 text-yellow-200 rounded text-xs">
                                    🔔
                                  </span>
                                )}
                              </div>
                            </div>
                            
                            <button
                              onClick={() => deleteTask(task.id)}
                              className="p-1 text-red-400 hover:text-red-300 transition-all"
                            >
                              🗑️
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Focus Timer */}
            <div className="glass-card-strong p-6">
              <h3 className="text-lg font-semibold text-white mb-4">🎯 Focus Session</h3>
              
              <div className="text-center">
                <div className="text-4xl font-bold text-white mb-4">
                  {focusSession.active ? formatTime(focusSession.timeLeft) : `${focusSession.duration}:00`}
                </div>
                
                {!focusSession.active ? (
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      {[15, 25, 45].map(duration => (
                        <button
                          key={duration}
                          onClick={() => setFocusSession(prev => ({ ...prev, duration }))}
                          className={`px-3 py-2 rounded text-sm transition-all ${
                            focusSession.duration === duration
                              ? 'bg-blue-500 text-white'
                              : 'bg-white/10 text-blue-200 hover:bg-white/20'
                          }`}
                        >
                          {duration}m
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={startFocusSession}
                      className="w-full py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-all"
                    >
                      Start Focus
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setFocusSession(prev => ({ ...prev, active: false }))}
                    className="w-full py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all"
                  >
                    Stop Session
                  </button>
                )}
              </div>
            </div>

            {/* Quick Analytics */}
            <div className="glass-card-strong p-6">
              <h3 className="text-lg font-semibold text-white mb-4">📊 Today's Stats</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-blue-200">Completion Rate</span>
                  <span className="text-white font-semibold">{analytics.completionRate}%</span>
                </div>
                
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all"
                    style={{ width: `${analytics.completionRate}%` }}
                  ></div>
                </div>
                
                <div className="grid grid-cols-2 gap-3 mt-4">
                  <div className="text-center p-3 bg-white/5 rounded-lg">
                    <div className="text-2xl font-bold text-white">{analytics.totalTasks}</div>
                    <div className="text-xs text-blue-200">Total</div>
                  </div>
                  <div className="text-center p-3 bg-white/5 rounded-lg">
                    <div className="text-2xl font-bold text-green-400">{analytics.completedTasks}</div>
                    <div className="text-xs text-blue-200">Done</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sticky Notes */}
            <div className="glass-card-strong p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">📝 Notes</h3>
                <button
                  onClick={() => setShowNoteForm(true)}
                  className="px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-white rounded text-sm transition-all"
                >
                  + Note
                </button>
              </div>
              
              {stickyNotes.length === 0 ? (
                <div className="text-center py-4">
                  <div className="text-3xl mb-2">📋</div>
                  <p className="text-blue-200 text-sm">No notes yet</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {stickyNotes.map(note => (
                    <div
                      key={note.id}
                      className="p-3 rounded-lg text-sm relative"
                      style={{ backgroundColor: note.color + '20', borderLeft: `3px solid ${note.color}` }}
                    >
                      <button
                        onClick={() => deleteStickyNote(note.id)}
                        className="absolute top-1 right-1 text-red-400 hover:text-red-300 text-xs"
                      >
                        ×
                      </button>
                      <p className="text-white pr-4">{note.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Active Reminders */}
            <div className="glass-card-strong p-6">
              <h3 className="text-lg font-semibold text-white mb-4">🔔 Active Reminders</h3>
              
              {getActiveReminders().length === 0 ? (
                <div className="text-center py-4">
                  <div className="text-3xl mb-2">⏰</div>
                  <p className="text-blue-200 text-sm">No upcoming reminders</p>
                  <p className="text-blue-300 text-xs mt-1">Enable reminders when creating tasks</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-48 overflow-y-auto">
                  {getActiveReminders().map(reminder => (
                    <div
                      key={reminder.id}
                      className="p-3 bg-yellow-500/20 border border-yellow-400/30 rounded-lg"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="text-white font-medium text-sm">
                            {reminder.taskTitle}
                          </h4>
                          <p className="text-yellow-200 text-xs mt-1">
                            {reminder.dateTime.toLocaleTimeString('en-US', { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </p>
                        </div>
                        <button
                          onClick={() => setReminders(reminders.filter(r => r.id !== reminder.id))}
                          className="text-yellow-300 hover:text-yellow-200 text-xs ml-2"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Task Form Modal */}
      {showTaskForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="glass-card-strong p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold text-white mb-4">Add New Task</h3>
            
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Task title"
                value={newTask.title}
                onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-200"
              />
              
              <textarea
                placeholder="Description (optional)"
                value={newTask.description}
                onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-200 h-20"
              />
              
              <div className="grid grid-cols-2 gap-3">
                <select
                  value={newTask.priority}
                  onChange={(e) => setNewTask({...newTask, priority: e.target.value})}
                  className="p-3 bg-white/10 border border-white/20 rounded-lg text-white"
                >
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                </select>
                
                <input
                  type="text"
                  placeholder="Category"
                  value={newTask.category}
                  onChange={(e) => setNewTask({...newTask, category: e.target.value})}
                  className="p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-200"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <select
                  value={newTask.timeBlock}
                  onChange={(e) => setNewTask({...newTask, timeBlock: e.target.value})}
                  className="p-3 bg-white/10 border border-white/20 rounded-lg text-white"
                >
                  <option value="">No time block</option>
                  {timeSlots.map(time => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>
                
                <select
                  value={newTask.recurring}
                  onChange={(e) => setNewTask({...newTask, recurring: e.target.value})}
                  className="p-3 bg-white/10 border border-white/20 rounded-lg text-white"
                >
                  <option value="none">No repeat</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-white">
                  <input
                    type="checkbox"
                    checked={newTask.reminder}
                    onChange={(e) => setNewTask({...newTask, reminder: e.target.checked})}
                    className="rounded"
                  />
                  Set reminder
                </label>
                
                {newTask.reminder && (
                  <input
                    type="time"
                    value={newTask.reminderTime}
                    onChange={(e) => setNewTask({...newTask, reminderTime: e.target.value})}
                    className="w-full p-2 bg-white/10 border border-white/20 rounded-lg text-white"
                    placeholder="Reminder time"
                  />
                )}
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  onClick={addTask}
                  className="flex-1 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all"
                >
                  Add Task
                </button>
                <button
                  onClick={() => setShowTaskForm(false)}
                  className="flex-1 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Note Form Modal */}
      {showNoteForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="glass-card-strong p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold text-white mb-4">Add Sticky Note</h3>
            
            <div className="space-y-4">
              <textarea
                placeholder="Note content"
                value={newNote.content}
                onChange={(e) => setNewNote({...newNote, content: e.target.value})}
                className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-200 h-24"
              />
              
              <div>
                <p className="text-white mb-2">Color:</p>
                <div className="flex gap-2">
                  {noteColors.map(color => (
                    <button
                      key={color}
                      onClick={() => setNewNote({...newNote, color})}
                      className={`w-8 h-8 rounded border-2 transition-all ${
                        newNote.color === color ? 'border-white' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  onClick={addStickyNote}
                  className="flex-1 py-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-all"
                >
                  Add Note
                </button>
                <button
                  onClick={() => setShowNoteForm(false)}
                  className="flex-1 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Planner;
