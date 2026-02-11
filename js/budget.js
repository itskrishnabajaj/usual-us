// ============================================
// Budget
// ============================================

async function loadBudget() {
    try {
        const now = new Date();
        const budgetDoc = await budgetCollection.doc('current').get();
        
        if (budgetDoc.exists) {
            budget = budgetDoc.data();
            
            if (budget.month !== now.getMonth() || budget.year !== now.getFullYear()) {
                console.log('🔄 Resetting budget for new month');
                await budgetCollection.doc('current').delete();
                budget = null;
                showBudgetPrompt();
            } else {
                console.log('💰 Budget loaded:', budget.amount);
                showBudgetCard();
                updateBudgetProgress();
            }
        } else {
            budget = null;
            showBudgetPrompt();
        }
    } catch (error) {
        console.error('❌ Error loading budget:', error);
        budget = null;
        showBudgetPrompt();
    }
}

function showBudgetCard() {
    const card = document.getElementById('budget-progress-card');
    card.classList.remove('hidden');
    
    if (!card.querySelector('.budget-progress-bar')) {
        card.innerHTML = `
            <div class="budget-header">
                <span class="budget-label">Monthly Budget</span>
                <button id="edit-budget-btn" class="btn-edit-budget">⚙️</button>
            </div>
            <div class="budget-amount-display">
                <span id="budget-spent">₹0</span>
                <span class="budget-separator">/</span>
                <span id="budget-total">₹0</span>
            </div>
            <div class="budget-progress-bar">
                <div id="budget-progress-fill" class="budget-progress-fill" style="width: 0%"></div>
            </div>
            <div id="budget-warning" class="budget-warning hidden">⚠️ Over 80% of budget used!</div>
        `;
        
        document.getElementById('edit-budget-btn').addEventListener('click', () => {
            document.getElementById('budget-modal').classList.remove('hidden');
            if (budget) {
                document.getElementById('budget-amount-input').value = budget.amount;
            }
        });
    }
}

function showBudgetPrompt() {
    const card = document.getElementById('budget-progress-card');
    card.classList.remove('hidden');
    card.innerHTML = `
        <div class="budget-prompt">
            <p class="budget-prompt-text">💰 Set a monthly budget to track spending</p>
            <button id="set-budget-btn" class="btn-set-budget">Set Budget</button>
        </div>
    `;
    
    setTimeout(() => {
        const btn = document.getElementById('set-budget-btn');
        if (btn) {
            btn.addEventListener('click', () => {
                document.getElementById('budget-modal').classList.remove('hidden');
            });
        }
    }, 100);
}

async function handleBudgetSubmit(e) {
    e.preventDefault();
    
    const amount = parseFloat(document.getElementById('budget-amount-input').value);
    if (!amount || amount <= 0) {
        showError('Please enter a valid amount');
        return;
    }
    
    const now = new Date();
    budget = {
        amount: amount,
        month: now.getMonth(),
        year: now.getFullYear(),
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
    };
    
    showLoading(true);
    
    try {
        await budgetCollection.doc('current').set(budget);
        document.getElementById('budget-modal').classList.add('hidden');
        console.log('✅ Budget saved:', amount);
        await loadBudget();
    } catch (error) {
        console.error('❌ Budget save error:', error);
        showError('Failed to save budget');
    }
    
    showLoading(false);
}

function updateBudgetProgress() {
    if (!budget) return;
    
    const now = new Date();
    const budgetExpenses = expenses.filter(e => {
        if (!e.createdAt || !e.countTowardsBudget) return false;
        const expenseDate = e.createdAt.toDate();
        return expenseDate.getMonth() === now.getMonth() && 
               expenseDate.getFullYear() === now.getFullYear();
    });
    
    const spent = budgetExpenses.reduce((sum, e) => sum + e.amount, 0);
    const percentage = (spent / budget.amount) * 100;
    
    document.getElementById('budget-spent').textContent = `₹${spent.toFixed(0)}`;
    document.getElementById('budget-total').textContent = `₹${budget.amount.toFixed(0)}`;
    document.getElementById('budget-progress-fill').style.width = `${Math.min(percentage, 100)}%`;
    
    const warning = document.getElementById('budget-warning');
    const fill = document.getElementById('budget-progress-fill');
    
    if (percentage >= 80) {
        warning.classList.remove('hidden');
        fill.classList.add('warning');
    } else {
        warning.classList.add('hidden');
        fill.classList.remove('warning');
    }
}
