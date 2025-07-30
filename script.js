        let goals = [];
        let userStats = {
            totalGoals: 0,
            completedGoals: 0,
            streak: 0,
            xp: 0,
            level: 1,
            badges: []
        };
        let darkMode = false;
        let activeView = 'dashboard';
        let newGoalData = {
            title: '',
            description: '',
            category: 'personal',
            deadline: '',
            subtasks: ['']
        };

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
            { id: 'personal', name: 'Personal', color: 'primary', icon: '🌟' },
            { id: 'career', name: 'Career', color: 'secondary', icon: '💼' },
            { id: 'health', name: 'Health', color: 'success', icon: '💪' },
            { id: 'learning', name: 'Learning', color: 'accent', icon: '📚' },
            { id: 'creative', name: 'Creative', color: 'warning', icon: '🎨' }
        ];

        const badges = [
            { id: 'first-goal', name: 'First Steps', icon: '🎯', description: 'Created your first goal!' },
            { id: 'streak-3', name: 'On Fire', icon: '🔥', description: '3-day streak!' },
            { id: 'completionist', name: 'Completionist', icon: '🏆', description: 'Completed 5 goals!' },
            { id: 'early-bird', name: 'Early Bird', icon: '🌅', description: 'Goal completed before deadline!' }
        ];

        // Initialize app
        function init() {
            loadData();
            updateUI();
            renderCategories();
            renderSubtasks();
            renderBadges();
            updateMotivationalQuote();
        }

        // Data persistence
        function loadData() {
            const savedGoals = localStorage.getItem('setgo-goals');
            const savedStats = localStorage.getItem('setgo-stats');
            const savedDarkMode = localStorage.getItem('setgo-darkmode');

            if (savedGoals) goals = JSON.parse(savedGoals);
            if (savedStats) userStats = JSON.parse(savedStats);
            if (savedDarkMode) {
                darkMode = JSON.parse(savedDarkMode);
                if (darkMode) {
                    document.documentElement.classList.add('dark');
                    document.getElementById('theme-icon').textContent = '☀️';
                }
            }
        }

        function saveData() {
            localStorage.setItem('setgo-goals', JSON.stringify(goals));
            localStorage.setItem('setgo-stats', JSON.stringify(userStats));
            localStorage.setItem('setgo-darkmode', JSON.stringify(darkMode));
        }

        // Theme toggle
        function toggleTheme() {
            darkMode = !darkMode;
            document.documentElement.classList.toggle('dark');
            document.getElementById('theme-icon').textContent = darkMode ? '☀️' : '🌙';
            saveData();
        }

        // View switching
        function switchView(view) {
            activeView = view;
            
            // Update nav buttons
            document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
            document.getElementById(view + '-btn').classList.add('active');
            
            // Show/hide views
            document.getElementById('dashboard-view').classList.toggle('hidden', view !== 'dashboard');
            document.getElementById('stats-view').classList.toggle('hidden', view !== 'stats');
            
            if (view === 'stats') {
                updateStatsView();
            }
        }

        // Update UI
        function updateUI() {
            updateStats();
            renderGoals();
        }

        function updateStats() {
            document.getElementById('total-goals').textContent = userStats.totalGoals;
            document.getElementById('completed-goals').textContent = userStats.completedGoals;
            document.getElementById('xp-points').textContent = userStats.xp;
            document.getElementById('user-level').textContent = userStats.level;
            document.getElementById('streak-display').textContent = userStats.streak;
        }

        function updateStatsView() {
            document.getElementById('stats-total').textContent = userStats.totalGoals;
            document.getElementById('stats-completed').textContent = userStats.completedGoals;
            document.getElementById('stats-success-rate').textContent = 
                userStats.totalGoals > 0 ? Math.round((userStats.completedGoals / userStats.totalGoals) * 100) + '%' : '0%';
            document.getElementById('stats-streak').textContent = userStats.streak + ' days';
            document.getElementById('stats-level').textContent = 'Level ' + userStats.level;
            document.getElementById('stats-xp').textContent = userStats.xp + ' XP';
            document.getElementById('stats-next-level').textContent = 'Next level at ' + (userStats.level * 100) + ' XP';
        }

        function updateMotivationalQuote() {
            const quote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
            document.getElementById('motivational-quote').textContent = quote;
        }

        // Goals management
        function renderGoals() {
            const container = document.getElementById('goals-container');
            
            if (goals.length === 0) {
                container.innerHTML = `
                    <div class="card empty-state">
                        <div class="empty-icon">🎯</div>
                        <h3 class="empty-title">No goals yet!</h3>
                        <p class="empty-description">
                            Start your journey by creating your first goal. Every big achievement starts with a single step!
                        </p>
                        <button class="btn-primary" onclick="showAddGoalModal()" style="font-size: 1.125rem; padding: 1rem 2rem;">
                            Create Your First Goal
                        </button>
                    </div>
                `;
                return;
            }

            container.innerHTML = goals.map(goal => {
                const progress = getProgressPercentage(goal);
                const categoryInfo = getCategoryInfo(goal.category);
                
                return `
                    <div class="goal-card fade-in">
                        <div class="goal-header">
                            <div class="goal-info">
                                <div class="goal-icon ${categoryInfo.color}">${categoryInfo.icon}</div>
                                <div>
                                    <div class="goal-title">${goal.title}</div>
                                    <div class="goal-description">${goal.description}</div>
                                </div>
                            </div>
                            <div class="goal-actions">
                                ${goal.completed ? '<span style="color: var(--warning); font-size: 1.5rem;">🏆</span>' : ''}
                                <button class="delete-btn" onclick="deleteGoal(${goal.id})">✕</button>
                            </div>
                        </div>
                        
                        <div class="progress-container">
                            <div class="progress-header">
                                <span style="font-weight: 500;">Progress</span>
                                <span style="font-weight: bold; color: var(--primary);">${progress}%</span>
                            </div>
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: ${progress}%"></div>
                            </div>
                        </div>
                        
                        <div class="subtasks">
                            ${goal.subtasks.map(subtask => `
                                <div class="subtask">
                                    <div class="subtask-checkbox ${subtask.completed ? 'completed' : ''}" 
                                         onclick="toggleSubtask(${goal.id}, ${subtask.id})">
                                        ${subtask.completed ? '✓' : ''}
                                    </div>
                                    <div class="subtask-text ${subtask.completed ? 'completed' : ''}">
                                        ${subtask.text}
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                        
                        ${goal.deadline ? `
                            <div style="display: flex; align-items: center; gap: 0.5rem; color: var(--muted-foreground); font-size: 0.875rem;">
                                📅 Due: ${new Date(goal.deadline).toLocaleDateString()}
                            </div>
                        ` : ''}
                    </div>
                `;
            }).join('');
        }

        function getProgressPercentage(goal) {
            if (goal.subtasks.length === 0) return 0;
            const completed = goal.subtasks.filter(st => st.completed).length;
            return Math.round((completed / goal.subtasks.length) * 100);
        }

        function getCategoryInfo(categoryId) {
            return categories.find(cat => cat.id === categoryId) || categories[0];
        }

        function toggleSubtask(goalId, subtaskId) {
            goals = goals.map(goal => {
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
                        showConfetti();
                        userStats.completedGoals++;
                        userStats.xp += 50;
                        userStats.streak++;
                    }
                    
                    return {
                        ...goal,
                        subtasks: updatedSubtasks,
                        completed: isGoalCompleted,
                        completedAt: isGoalCompleted ? new Date().toISOString() : null
                    };
                }
                return goal;
            });
            
            saveData();
            updateUI();
        }

        function deleteGoal(goalId) {
            if (confirm('Are you sure you want to delete this goal?')) {
                goals = goals.filter(goal => goal.id !== goalId);
                saveData();
                updateUI();
            }
        }

        // Modal management
        function showAddGoalModal() {
            document.getElementById('add-goal-modal').classList.remove('hidden');
            resetNewGoalForm();
        }

        function hideAddGoalModal() {
            document.getElementById('add-goal-modal').classList.add('hidden');
        }

        function resetNewGoalForm() {
            newGoalData = {
                title: '',
                description: '',
                category: 'personal',
                deadline: '',
                subtasks: ['']
            };
            
            document.getElementById('goal-title').value = '';
            document.getElementById('goal-description').value = '';
            document.getElementById('goal-deadline').value = '';
            
            renderCategories();
            renderSubtasks();
        }

        function renderCategories() {
            const container = document.getElementById('category-grid');
            container.innerHTML = categories.map(cat => `
                <button class="category-btn ${newGoalData.category === cat.id ? 'selected' : ''}" 
                        onclick="selectCategory('${cat.id}')">
                    <span style="font-size: 1.125rem;">${cat.icon}</span>
                    <span style="font-weight: 500;">${cat.name}</span>
                </button>
            `).join('');
        }

        function selectCategory(categoryId) {
            newGoalData.category = categoryId;
            renderCategories();
        }

        function renderSubtasks() {
            const container = document.getElementById('subtasks-container');
            container.innerHTML = newGoalData.subtasks.map((subtask, index) => `
                <div class="subtask-input-group">
                    <input type="text" class="subtask-input" value="${subtask}" 
                           onchange="updateSubtask(${index}, this.value)"
                           placeholder="Subtask ${index + 1}">
                    ${newGoalData.subtasks.length > 1 ? `
                        <button class="remove-subtask-btn" onclick="removeSubtask(${index})">✕</button>
                    ` : ''}
                </div>
            `).join('');
        }

        function updateSubtask(index, value) {
            newGoalData.subtasks[index] = value;
        }

        function removeSubtask(index) {
            newGoalData.subtasks = newGoalData.subtasks.filter((_, i) => i !== index);
            renderSubtasks();
        }

        function addSubtaskInput() {
            newGoalData.subtasks.push('');
            renderSubtasks();
        }

        function createGoal() {
            const title = document.getElementById('goal-title').value.trim();
            const description = document.getElementById('goal-description').value.trim();
            const deadline = document.getElementById('goal-deadline').value;
            
            if (!title) {
                alert('Please enter a goal title');
                return;
            }
            
            const goal = {
                id: Date.now(),
                title,
                description,
                category: newGoalData.category,
                deadline,
                subtasks: newGoalData.subtasks.filter(task => task.trim() !== '').map(task => ({
                    id: Date.now() + Math.random(),
                    text: task,
                    completed: false
                })),
                completed: false,
                createdAt: new Date().toISOString(),
                completedAt: null
            };
            
            goals.push(goal);
            userStats.totalGoals++;
            userStats.xp += 10;
            
            // Award first goal badge
            if (goals.length === 1 && !userStats.badges.includes('first-goal')) {
                userStats.badges.push('first-goal');
            }
            
            saveData();
            updateUI();
            hideAddGoalModal();
        }

        function renderBadges() {
            const container = document.getElementById('badges-container');
            container.innerHTML = badges.map(badge => {
                const isEarned = userStats.badges.includes(badge.id);
                return `
                    <div style="padding: 1rem; border-radius: var(--radius); border: 2px solid ${isEarned ? 'var(--warning)' : 'var(--border)'}; 
                                background: ${isEarned ? 'linear-gradient(135deg, hsl(45, 93%, 97%), hsl(25, 95%, 97%))' : 'var(--card)'};
                                ${isEarned ? '' : 'opacity: 0.6;'}">
                        <div style="display: flex; align-items: center; gap: 0.75rem;">
                            <div style="font-size: 1.5rem; ${isEarned ? '' : 'filter: grayscale(1);'}">${badge.icon}</div>
                            <div>
                                <h3 style="font-weight: bold; color: ${isEarned ? 'var(--warning)' : 'var(--muted-foreground)'};">${badge.name}</h3>
                                <p style="font-size: 0.875rem; color: var(--muted-foreground);">${badge.description}</p>
                            </div>
                        </div>
                    </div>
                `;
            }).join('');
        }

        function showConfetti() {
            const container = document.getElementById('confetti-container');
            container.classList.remove('hidden');
            
            // Create confetti pieces
            const pieces = ['🎉', '🎊', '⭐', '✨', '🌟'];
            container.innerHTML = '';
            
            for (let i = 0; i < 50; i++) {
                const piece = document.createElement('div');
                piece.className = 'confetti-piece';
                piece.textContent = pieces[Math.floor(Math.random() * pieces.length)];
                piece.style.left = Math.random() * 100 + '%';
                piece.style.animationDelay = Math.random() * 2 + 's';
                piece.style.animationDuration = (2 + Math.random() * 2) + 's';
                container.appendChild(piece);
            }
            
            setTimeout(() => {
                container.classList.add('hidden');
            }, 3000);
        }

        // Initialize app when page loads
        document.addEventListener('DOMContentLoaded', init);