import React, { useState } from 'react';
import { Star, Gift, Trophy, Sparkles, Plus, History, Award, Target, Lock, TrendingUp } from 'lucide-react';
import './index.css';

const Rewards = () => {
  const [userPoints, setUserPoints] = useState(0);
  const [userLevel, setUserLevel] = useState(1);
  const [showAddReward, setShowAddReward] = useState(false);
  const [targetRewardId, setTargetRewardId] = useState(null);
  
  const [rewards, setRewards] = useState([]);

  const [achievements, setAchievements] = useState([]);

  const [rewardHistory, setRewardHistory] = useState([]);

  const [newReward, setNewReward] = useState({
    title: '',
    description: '',
    cost: '',
    category: '',
    icon: '🎁'
  });

  // Level calculation based on points
  const calculateLevel = (points) => {
    return Math.floor(points / 500) + 1;
  };

  // Check if reward is unlocked based on user level
  const isRewardUnlocked = (reward) => {
    const requiredLevel = Math.ceil(reward.cost / 500);
    return userLevel >= requiredLevel;
  };

  // Add new custom reward
  const addCustomReward = () => {
    if (newReward.title.trim() && newReward.cost) {
      const reward = {
        id: Date.now(),
        ...newReward,
        cost: parseInt(newReward.cost),
        unlocked: isRewardUnlocked({ cost: parseInt(newReward.cost) })
      };
      setRewards([...rewards, reward]);
      setNewReward({
        title: '',
        description: '',
        cost: '',
        category: '',
        icon: '🎁'
      });
      setShowAddReward(false);
    }
  };

  // Redeem reward
  const redeemReward = (rewardId) => {
    const reward = rewards.find(r => r.id === rewardId);
    if (reward && userPoints >= reward.cost && isRewardUnlocked(reward)) {
      setUserPoints(userPoints - reward.cost);
      const historyEntry = {
        id: Date.now(),
        reward: `${reward.title} ${reward.icon}`,
        points: reward.cost,
        date: new Date().toLocaleDateString()
      };
      setRewardHistory([historyEntry, ...rewardHistory]);
      // Add celebration animation/notification here
      alert(`🎉 Reward redeemed! Enjoy your ${reward.title}!`);
    }
  };

  // Set target reward
  const setTargetReward = (rewardId) => {
    setTargetRewardId(rewardId);
  };

  // Get target reward data
  const targetReward = targetRewardId ? rewards.find(r => r.id === targetRewardId) : null;
  const progressToTarget = targetReward ? Math.min((userPoints / targetReward.cost) * 100, 100) : 0;

  // Get analytics data
  const getAnalytics = () => {
    const totalRedeemed = rewardHistory.length;
    const totalPointsSpent = rewardHistory.reduce((sum, item) => sum + item.points, 0);
    const earnedAchievements = achievements.filter(a => a.earned).length;
    
    return { totalRedeemed, totalPointsSpent, earnedAchievements };
  };

  const analytics = getAnalytics();

  return (
    <div className="min-h-screen bg-cover bg-center bg-fixed bg-no-repeat p-6 relative" style={{backgroundImage: 'url(/bg-image.png)'}}>
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="glass-card-strong p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">🎁 Rewards Center</h1>
              <p className="text-blue-200">Celebrate your achievements and stay motivated</p>
            </div>
            
            <button
              onClick={() => setShowAddReward(true)}
              className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center gap-2 transition-all"
            >
              <Plus size={20} />
              Create Custom Reward
            </button>
          </div>
        </div>

        {/* Points Tracker Section */}
        <div className="glass-card-strong p-6 mb-6">
          <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-2">
            <Star className="text-yellow-400" />
            Points Tracker
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Main Points Display */}
            <div className="md:col-span-2 text-center relative overflow-hidden bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-xl p-6 border border-yellow-400/30">
              <div className="absolute top-0 right-0 text-8xl opacity-10">⭐</div>
              <div className="relative z-10">
                <div className="text-6xl font-bold text-yellow-400 mb-2 flex items-center justify-center gap-2">
                  <Sparkles className="text-yellow-400 animate-pulse" />
                  {userPoints}
                </div>
                <div className="text-white text-lg mb-2">You have {userPoints} Points!</div>
                <div className="text-blue-200 text-sm">
                  Points earned through completing goals, habits, and tasks
                </div>
              </div>
            </div>
            
            {/* Level Display */}
            <div className="text-center bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-xl p-6 border border-purple-400/30">
              <div className="text-4xl font-bold text-purple-400 mb-2">
                Level {userLevel}
              </div>
              <div className="text-white/70 text-sm">Current Level</div>
              <div className="mt-2 text-blue-200 text-xs">
                {500 - (userPoints % 500)} pts to next level
              </div>
            </div>
            
            {/* Points Today */}
            <div className="text-center bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl p-6 border border-green-400/30">
              <div className="text-4xl font-bold text-green-400 mb-2">
                +0
              </div>
              <div className="text-white/70 text-sm">Points Today</div>
              <div className="mt-2 text-blue-200 text-xs">
                Keep going! 💪
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Main Content Area */}
          <div className="xl:col-span-2 space-y-6">
            {/* Target Reward Progress */}
            {targetReward && (
              <div className="glass-card-strong p-6">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <Target className="text-blue-400" />
                  Progress to Target Reward
                </h3>
                <div className="flex items-center gap-4">
                  <span className="text-5xl">{targetReward.icon}</span>
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-white mb-2">{targetReward.title}</h4>
                    <div className="flex justify-between text-sm text-blue-200 mb-2">
                      <span>{userPoints} / {targetReward.cost} points</span>
                      <span>{Math.round(progressToTarget)}%</span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-4">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-4 rounded-full transition-all duration-500"
                        style={{ width: `${progressToTarget}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Redeemable Rewards Catalog */}
            <div className="glass-card-strong p-6">
              <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-2">
                <Gift className="text-blue-400" />
                Reward Catalog
              </h2>
              
              {rewards.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-8xl mb-6">🎁</div>
                  <h3 className="text-2xl font-semibold text-white mb-4">No Rewards Yet</h3>
                  <p className="text-blue-200 mb-6">Create your first custom reward to get started!</p>
                  <button
                    onClick={() => setShowAddReward(true)}
                    className="px-8 py-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all"
                  >
                    Create Your First Reward
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {rewards.map(reward => {
                    const unlocked = isRewardUnlocked(reward);
                    const canAfford = userPoints >= reward.cost;
                    const requiredLevel = Math.ceil(reward.cost / 500);
                    
                    return (
                      <div 
                        key={reward.id} 
                        className={`relative overflow-hidden group bg-white/5 hover:bg-white/10 transition-all duration-300 rounded-xl p-6 border ${
                          unlocked ? 'border-white/20' : 'border-red-400/30'
                        }`}
                      >
                        {!unlocked && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10 rounded-xl">
                            <div className="text-center text-white">
                              <Lock className="w-8 h-8 mx-auto mb-2 text-red-400" />
                              <div className="font-semibold">Unlock at Level {requiredLevel}</div>
                              <div className="text-sm text-blue-200">Requires {requiredLevel * 500} total points earned</div>
                            </div>
                          </div>
                        )}
                        
                        <div className="text-center">
                          <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
                            {reward.icon}
                          </div>
                          <h3 className="text-xl font-semibold text-white mb-2">{reward.title}</h3>
                          <p className="text-blue-200 text-sm mb-4">{reward.description}</p>
                          
                          <div className="flex items-center justify-between mb-4">
                            <span className="text-yellow-400 font-bold flex items-center gap-1 text-lg">
                              <Star size={20} />
                              {reward.cost}
                            </span>
                            {reward.category && (
                              <span className="text-blue-200 text-xs bg-blue-500/20 px-3 py-1 rounded-full">
                                {reward.category}
                              </span>
                            )}
                          </div>
                          
                          <div className="flex gap-2">
                            <button
                              onClick={() => redeemReward(reward.id)}
                              disabled={!unlocked || !canAfford}
                              className={`flex-1 py-3 rounded-lg font-medium transition-all duration-300 ${
                                unlocked && canAfford
                                  ? 'bg-blue-500 hover:bg-blue-600 text-white'
                                  : 'bg-white/10 text-white/40 cursor-not-allowed'
                              }`}
                            >
                              {!unlocked ? 'Locked' : !canAfford ? 'Not Enough Points' : 'Redeem'}
                            </button>
                            
                            {unlocked && (
                              <button
                                onClick={() => setTargetReward(reward.id)}
                                className={`px-4 py-3 rounded-lg transition-all duration-300 ${
                                  targetRewardId === reward.id
                                    ? 'bg-purple-500 text-white'
                                    : 'bg-white/10 hover:bg-white/20 text-blue-200'
                                }`}
                                title="Set as target reward"
                              >
                                <Target size={18} />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Milestone Achievements */}
            <div className="glass-card-strong p-6">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Trophy className="text-yellow-400" />
                Achievements
              </h3>
              
              {achievements.length === 0 ? (
                <div className="text-center py-6">
                  <div className="text-4xl mb-3">🏆</div>
                  <p className="text-blue-200 text-sm">No achievements yet</p>
                  <p className="text-blue-200 text-xs mt-1">Complete goals and habits to earn badges!</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {achievements.map(achievement => (
                    <div 
                      key={achievement.id}
                      className={`p-4 rounded-lg border transition-all duration-300 ${
                        achievement.earned 
                          ? 'border-yellow-400/50 bg-yellow-400/10' 
                          : 'border-white/20 bg-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{achievement.icon}</span>
                        <div className="flex-1">
                          <h4 className={`font-medium ${achievement.earned ? 'text-white' : 'text-white/60'}`}>
                            {achievement.title}
                          </h4>
                          <p className="text-blue-200 text-xs">{achievement.description}</p>
                          {achievement.earned && achievement.earnedDate && (
                            <p className="text-yellow-400 text-xs mt-1">
                              Earned: {achievement.earnedDate}
                            </p>
                          )}
                        </div>
                        {achievement.earned && <Award className="text-yellow-400" size={16} />}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Reward History */}
            <div className="glass-card-strong p-6">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <History className="text-blue-400" />
                Reward History
              </h3>
              
              {rewardHistory.length === 0 ? (
                <div className="text-center py-6">
                  <div className="text-4xl mb-3">📋</div>
                  <p className="text-blue-200 text-sm">No rewards redeemed yet</p>
                  <p className="text-blue-200 text-xs mt-1">Start earning points to redeem rewards!</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-48 overflow-y-auto">
                  {rewardHistory.map(item => (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <div>
                        <div className="text-white text-sm font-medium">{item.reward}</div>
                        <div className="text-blue-200 text-xs">{item.date}</div>
                      </div>
                      <div className="text-red-400 text-sm font-medium">-{item.points}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Analytics */}
            <div className="glass-card-strong p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <TrendingUp className="text-green-400" />
                Quick Stats
              </h3>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-blue-200 text-sm">Rewards Redeemed</span>
                  <span className="text-white font-semibold">{analytics.totalRedeemed}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-blue-200 text-sm">Points Spent</span>
                  <span className="text-white font-semibold">{analytics.totalPointsSpent}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-blue-200 text-sm">Achievements</span>
                  <span className="text-white font-semibold">{analytics.earnedAchievements}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-blue-200 text-sm">Current Level</span>
                  <span className="text-white font-semibold">Level {userLevel}</span>
                </div>
              </div>
            </div>

            {/* Popular Rewards Suggestion */}
            <div className="glass-card-strong p-6">
              <h3 className="text-lg font-semibold text-white mb-4">💡 Popular Rewards</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-blue-200">
                  <span>🍿</span>
                  <span>Watch a Movie (300 pts)</span>
                </div>
                <div className="flex items-center gap-2 text-blue-200">
                  <span>🍦</span>
                  <span>Ice Cream Treat (150 pts)</span>
                </div>
                <div className="flex items-center gap-2 text-blue-200">
                  <span>🎮</span>
                  <span>Game Time (200 pts)</span>
                </div>
                <div className="flex items-center gap-2 text-blue-200">
                  <span>📅</span>
                  <span>Day Off (500 pts)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Create Custom Reward Modal */}
      {showAddReward && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="glass-card-strong p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <Gift className="text-blue-400" />
              Create Custom Reward
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-white/80 mb-2 font-medium">🎁 Reward Title</label>
                <input 
                  type="text" 
                  placeholder="e.g., Coffee with a friend"
                  value={newReward.title}
                  onChange={(e) => setNewReward({...newReward, title: e.target.value})}
                  className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-3 text-white placeholder-blue-200 focus:border-blue-400 focus:outline-none transition-all"
                />
              </div>
              
              <div>
                <label className="block text-white/80 mb-2 font-medium">📝 Description</label>
                <textarea 
                  placeholder="What makes this reward special?"
                  value={newReward.description}
                  onChange={(e) => setNewReward({...newReward, description: e.target.value})}
                  className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-3 text-white placeholder-blue-200 focus:border-blue-400 focus:outline-none h-20 resize-none transition-all"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/80 mb-2 font-medium">🎯 Points Required</label>
                  <input 
                    type="number" 
                    placeholder="e.g., 250"
                    value={newReward.cost}
                    onChange={(e) => setNewReward({...newReward, cost: e.target.value})}
                    className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-3 text-white placeholder-blue-200 focus:border-blue-400 focus:outline-none transition-all"
                  />
                </div>
                
                <div>
                  <label className="block text-white/80 mb-2 font-medium">🎨 Emoji Icon</label>
                  <input 
                    type="text" 
                    placeholder="☕"
                    value={newReward.icon}
                    onChange={(e) => setNewReward({...newReward, icon: e.target.value})}
                    className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-3 text-white placeholder-blue-200 focus:border-blue-400 focus:outline-none transition-all"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-white/80 mb-2 font-medium">📂 Category (Optional)</label>
                <input 
                  type="text" 
                  placeholder="e.g., Food, Entertainment, Self-care"
                  value={newReward.category}
                  onChange={(e) => setNewReward({...newReward, category: e.target.value})}
                  className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-3 text-white placeholder-blue-200 focus:border-blue-400 focus:outline-none transition-all"
                />
              </div>
              
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddReward(false)}
                  className="flex-1 bg-white/10 hover:bg-white/20 text-white py-3 rounded-lg transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  onClick={addCustomReward}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg transition-all duration-300"
                >
                  Create Reward
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Rewards;
