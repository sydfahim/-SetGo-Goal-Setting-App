import React, { useState, useEffect } from 'react';
import { Plus, Target, Trophy, Flame, Moon, Sun, Star, Check, X, Calendar, Tag, Zap, Award, TrendingUp, Home, BarChart3 } from 'lucide-react';

const SetGoApp = () => {
  const [goals, setGoals] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [activeView, setActiveView] = useState('dashboard');
  const [userStats, setUserStats] = useState({
    totalGoals: 0,
    completedGoals: 0,
    streak: 0,
    xp: 0,
    level: 1,
    badges: []
  });
  const [confetti, setConfetti] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    category: 'personal',
    deadline: '',
    subtasks: ['']
  });

  const motivationalQuotes = [
    "You're closer than you think! 🌟",
    "Every step forward is progress! 💪",
    "Believe in yourself - you've got this! 🚀",
    "Success is a journey, not a destination! ✨",
    "Dream big, start small, act now! 🔥",
    "Progress, not perfection! 🎯",
    "Your future self will thank you! 🌈"
  ];

  const categories = [
    { id: 'personal', name: 'Personal', color: 'bg-primary', icon: '🌟' },
    { id: 'career', name: 'Career', color: 'bg-secondary', icon: '💼' },
    { id: 'health', name: 'Health', color: 'bg-success', icon: '💪' },
    { id: 'learning', name: 'Learning', color: 'bg-accent', icon: '📚' },
    { id: 'creative', name: 'Creative', color: 'bg-warning', icon: '🎨' }
  ];

  const badges = [
    { id: 'first-goal', name: 'First Steps', icon: '🎯', description: 'Created your first goal!' },
    { id: 'streak-3', name: 'On Fire', icon: '🔥', description: '3-day streak!' },
    { id: 'completionist', name: 'Completionist', icon: '🏆', description: 'Completed 5 goals!' },
    { id: 'early-bird', name: 'Early Bird', icon: '🌅', description: 'Goal completed before deadline!' }
  ];

  useEffect(() => {
    const savedGoals = JSON.parse(localStorage.getItem('setgo-goals') || '[]');
    const savedStats = JSON.parse(localStorage.getItem('setgo-stats') || JSON.stringify(userStats));
    const savedDarkMode = JSON.parse(localStorage.getItem('setgo-darkmode') || 'false');
    
    setGoals(savedGoals);
    setUserStats(savedStats);
    setDarkMode(savedDarkMode);
  }, []);

  useEffect(() => {
    localStorage.setItem('setgo-goals', JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    localStorage.setItem('setgo-stats', JSON.stringify(userStats));
  }, [userStats]);

  useEffect(() => {
    localStorage.setItem('setgo-darkmode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const addGoal = () => {
    if (!newGoal.title) return;
    
    const goal = {
      id: Date.now(),
      ...newGoal,
      subtasks: newGoal.subtasks.filter(task => task.trim() !== '').map(task => ({
        id: Date.now() + Math.random(),
        text: task,
        completed: false
      })),
      completed: false,
      createdAt: new Date().toISOString(),
      completedAt: null
    };
    
    setGoals([...goals, goal]);
    setUserStats(prev => ({
      ...prev,
      totalGoals: prev.totalGoals + 1,
      xp: prev.xp + 10
    }));
    
    setNewGoal({
      title: '',
      description: '',
      category: 'personal',
      deadline: '',
      subtasks: ['']
    });
    setShowAddGoal(false);
    
    // Award first goal badge
    if (goals.length === 0) {
      setUserStats(prev => ({
        ...prev,
        badges: [...prev.badges, 'first-goal']
      }));
    }
  };

  const toggleSubtask = (goalId, subtaskId) => {
    setGoals(goals.map(goal => {
      if (goal.id === goalId) {
        const updatedSubtasks = goal.subtasks.map(subtask => 
          subtask.id === subtaskId 
            ? { ...subtask, completed: !subtask.completed }
            : subtask
        );
        
        const completedSubtasks = updatedSubtasks.filter(st => st.completed).length;
        const totalSubtasks = updatedSubtasks.length;
        const isGoalCompleted = completedSubtasks === totalSubtasks && totalSubtasks > 0;
        
        // If goal just completed
        if (isGoalCompleted && !goal.completed) {
          setConfetti(true);
          setTimeout(() => setConfetti(false), 3000);
          
          setUserStats(prev => ({
            ...prev,
            completedGoals: prev.completedGoals + 1,
            xp: prev.xp + 50,
            streak: prev.streak + 1
          }));
        }
        
        return {
          ...goal,
          subtasks: updatedSubtasks,
          completed: isGoalCompleted,
          completedAt: isGoalCompleted ? new Date().toISOString() : null
        };
      }
      return goal;
    }));
  };

  const deleteGoal = (goalId) => {
    setGoals(goals.filter(goal => goal.id !== goalId));
  };

  const getProgressPercentage = (goal) => {
    if (goal.subtasks.length === 0) return 0;
    const completed = goal.subtasks.filter(st => st.completed).length;
    return Math.round((completed / goal.subtasks.length) * 100);
  };

  const getCategoryInfo = (categoryId) => {
    return categories.find(cat => cat.id === categoryId) || categories[0];
  };

  const getRandomQuote = () => {
    return motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
  };

  // Confetti Animation Component
  const ConfettiEffect = () => {
    if (!confetti) return null;
    
    return (
      <div className="fixed inset-0 pointer-events-none z-50">
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="absolute text-2xl animate-confetti-fall"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          >
            {['🎉', '🎊', '⭐', '✨', '🌟'][Math.floor(Math.random() * 5)]}
          </div>
        ))}
      </div>
    );
  };

  // Add Goal Modal Component
  const AddGoalModal = () => {
    if (!showAddGoal) return null;
    
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-40 animate-fade-in">
        <div className="card-glow max-w-md w-full max-h-[90vh] overflow-y-auto animate-scale-in">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              ✨ Create New Goal
            </h3>
            <button
              onClick={() => setShowAddGoal(false)}
              className="p-2 hover:bg-muted rounded-xl transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Goal Title</label>
              <input
                type="text"
                value={newGoal.title}
                onChange={(e) => setNewGoal({...newGoal, title: e.target.value})}
                className="w-full p-4 rounded-xl border-2 border-border bg-card focus:border-primary outline-none transition-colors"
                placeholder="What do you want to achieve?"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                value={newGoal.description}
                onChange={(e) => setNewGoal({...newGoal, description: e.target.value})}
                className="w-full p-4 rounded-xl border-2 border-border bg-card focus:border-primary outline-none transition-colors resize-none"
                rows={3}
                placeholder="Tell us more about your goal..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <div className="grid grid-cols-2 gap-3">
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setNewGoal({...newGoal, category: cat.id})}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      newGoal.category === cat.id 
                        ? `${cat.color} text-white border-transparent shadow-lg` 
                        : `bg-card border-border hover:border-primary`
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{cat.icon}</span>
                      <span className="font-medium">{cat.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Deadline (Optional)</label>
              <input
                type="date"
                value={newGoal.deadline}
                onChange={(e) => setNewGoal({...newGoal, deadline: e.target.value})}
                className="w-full p-4 rounded-xl border-2 border-border bg-card focus:border-primary outline-none transition-colors"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Subtasks</label>
              {newGoal.subtasks.map((subtask, index) => (
                <div key={index} className="flex gap-3 mb-3">
                  <input
                    type="text"
                    value={subtask}
                    onChange={(e) => {
                      const updated = [...newGoal.subtasks];
                      updated[index] = e.target.value;
                      setNewGoal({...newGoal, subtasks: updated});
                    }}
                    className="flex-1 p-3 rounded-xl border-2 border-border bg-card focus:border-primary outline-none transition-colors"
                    placeholder={`Subtask ${index + 1}`}
                  />
                  {newGoal.subtasks.length > 1 && (
                    <button
                      onClick={() => {
                        const updated = newGoal.subtasks.filter((_, i) => i !== index);
                        setNewGoal({...newGoal, subtasks: updated});
                      }}
                      className="p-3 text-destructive hover:bg-destructive/10 rounded-xl transition-colors"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={() => setNewGoal({...newGoal, subtasks: [...newGoal.subtasks, '']})}
                className="w-full p-3 border-2 border-dashed border-border rounded-xl text-muted-foreground hover:border-primary hover:text-primary transition-colors"
              >
                + Add Subtask
              </button>
            </div>
            
            <div className="flex gap-3 pt-4">
              <button
                onClick={() => setShowAddGoal(false)}
                className="flex-1 py-3 px-6 border-2 border-border rounded-xl font-medium hover:bg-muted transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={addGoal}
                className="btn-primary flex-1"
              >
                Create Goal
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Dashboard View Component
  const Dashboard = () => (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="card-glow animate-fade-in">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold mb-2">Good morning! 🌅</h2>
            <p className="text-muted-foreground text-lg">{getRandomQuote()}</p>
          </div>
          <div className="flex items-center gap-2 bg-gradient-to-r from-accent to-warning rounded-xl px-4 py-2">
            <Flame className="text-white" size={20} />
            <span className="font-bold text-white">{userStats.streak}</span>
          </div>
        </div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-6 bg-gradient-to-br from-primary to-primary-glow rounded-xl text-white">
            <div className="text-3xl font-bold mb-1">{userStats.totalGoals}</div>
            <div className="text-sm opacity-90">Total Goals</div>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-success to-success-glow rounded-xl text-white">
            <div className="text-3xl font-bold mb-1">{userStats.completedGoals}</div>
            <div className="text-sm opacity-90">Completed</div>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-accent to-warning rounded-xl text-white">
            <div className="text-3xl font-bold mb-1">{userStats.xp}</div>
            <div className="text-sm opacity-90">XP Points</div>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-secondary to-secondary-glow rounded-xl text-white">
            <div className="text-3xl font-bold mb-1">{userStats.level}</div>
            <div className="text-sm opacity-90">Level</div>
          </div>
        </div>
      </div>

      {/* Goals Section */}
      <div className="space-y-6">
        {goals.length === 0 ? (
          <div className="card-glow text-center py-12 animate-fade-in">
            <Target size={64} className="mx-auto mb-6 text-primary" />
            <h3 className="text-2xl font-bold mb-4">No goals yet!</h3>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Start your journey by creating your first goal. Every big achievement starts with a single step!
            </p>
            <button
              onClick={() => setShowAddGoal(true)}
              className="btn-primary text-lg px-8 py-4"
            >
              Create Your First Goal
            </button>
          </div>
        ) : (
          goals.map((goal, index) => {
            const progress = getProgressPercentage(goal);
            const categoryInfo = getCategoryInfo(goal.category);
            
            return (
              <div
                key={goal.id}
                className="card-glow hover:shadow-2xl transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-4">
                    <div className={`${categoryInfo.color} w-16 h-16 rounded-xl flex items-center justify-center text-white text-2xl shadow-lg`}>
                      {categoryInfo.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-1">{goal.title}</h3>
                      <p className="text-muted-foreground">{goal.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {goal.completed && (
                      <Trophy className="text-warning animate-pulse-glow" size={24} />
                    )}
                    <button
                      onClick={() => deleteGoal(goal.id)}
                      className="text-muted-foreground hover:text-destructive p-2 hover:bg-destructive/10 rounded-lg transition-colors"
                    >
                      <X size={18} />
                    </button>
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-medium">Progress</span>
                    <span className="font-bold text-primary">{progress}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-4 overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r from-primary to-primary-glow rounded-full transition-all duration-500 ${progress === 100 ? 'progress-glow' : ''}`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
                
                {/* Subtasks */}
                <div className="space-y-3 mb-6">
                  {goal.subtasks.map(subtask => (
                    <div key={subtask.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                      <button
                        onClick={() => toggleSubtask(goal.id, subtask.id)}
                        className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all ${
                          subtask.completed
                            ? 'bg-success border-success text-white shadow-lg'
                            : 'border-border hover:border-success hover:bg-success/10'
                        }`}
                      >
                        {subtask.completed && <Check size={16} />}
                      </button>
                      <span className={`flex-1 transition-all ${subtask.completed ? 'line-through text-muted-foreground' : ''}`}>
                        {subtask.text}
                      </span>
                    </div>
                  ))}
                </div>
                
                {/* Deadline */}
                {goal.deadline && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar size={16} />
                    <span className="text-sm">Due: {new Date(goal.deadline).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );

  // Stats View Component
  const StatsView = () => (
    <div className="space-y-8">
      <div className="card-glow animate-fade-in">
        <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
          <TrendingUp className="text-secondary" />
          Your Progress
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">Achievement Stats</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-muted/50 rounded-lg">
                <span>Goals Created</span>
                <span className="font-bold text-primary">{userStats.totalGoals}</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-muted/50 rounded-lg">
                <span>Goals Completed</span>
                <span className="font-bold text-success">{userStats.completedGoals}</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-muted/50 rounded-lg">
                <span>Success Rate</span>
                <span className="font-bold text-secondary">
                  {userStats.totalGoals > 0 ? Math.round((userStats.completedGoals / userStats.totalGoals) * 100) : 0}%
                </span>
              </div>
              <div className="flex justify-between items-center p-4 bg-muted/50 rounded-lg">
                <span>Current Streak</span>
                <span className="font-bold text-accent">{userStats.streak} days</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">Level Progress</h3>
            <div className="text-center p-8 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl border border-border">
              <div className="text-5xl font-bold text-primary mb-3">
                Level {userStats.level}
              </div>
              <div className="text-3xl font-bold text-secondary mb-4">
                {userStats.xp} XP
              </div>
              <div className="text-muted-foreground">
                Next level at {userStats.level * 100} XP
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Badges Section */}
      <div className="card-glow animate-fade-in">
        <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
          <Award className="text-warning" />
          Badges & Achievements
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {badges.map(badge => {
            const isEarned = userStats.badges.includes(badge.id);
            return (
              <div
                key={badge.id}
                className={`p-6 rounded-xl border-2 transition-all ${
                  isEarned
                    ? 'bg-gradient-to-br from-warning/10 to-accent/10 border-warning shadow-lg'
                    : 'bg-muted/30 border-border'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`text-3xl ${isEarned ? '' : 'grayscale opacity-50'}`}>
                    {badge.icon}
                  </div>
                  <div>
                    <h3 className={`font-bold text-lg ${isEarned ? 'text-warning' : 'text-muted-foreground'}`}>
                      {badge.name}
                    </h3>
                    <p className="text-muted-foreground">
                      {badge.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen transition-colors duration-300`}>
      <ConfettiEffect />
      
      {/* Header */}
      <header className="sticky top-0 z-30 card-glow border-b border-border/50 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-primary to-primary-glow w-12 h-12 rounded-xl flex items-center justify-center shadow-lg">
                <Target className="text-white" size={24} />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                SetGo
              </h1>
            </div>

            {/* Navigation */}
            <nav className="flex items-center gap-2">
              <button
                onClick={() => setActiveView('dashboard')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                  activeView === 'dashboard' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
                }`}
              >
                <Home size={18} />
                Dashboard
              </button>
              <button
                onClick={() => setActiveView('stats')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                  activeView === 'stats' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
                }`}
              >
                <BarChart3 size={18} />
                Stats
              </button>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-lg hover:bg-muted transition-colors"
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {activeView === 'dashboard' ? <Dashboard /> : <StatsView />}
      </main>

      {/* Floating Add Button */}
      {activeView === 'dashboard' && (
        <button
          onClick={() => setShowAddGoal(true)}
          className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-br from-primary to-primary-glow text-white rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300 flex items-center justify-center z-20"
        >
          <Plus size={24} />
        </button>
      )}

      <AddGoalModal />
    </div>
  );
};

export default SetGoApp;