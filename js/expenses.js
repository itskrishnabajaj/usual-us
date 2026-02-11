// ============================================
// Expenses
// ============================================

async function loadExpenses() {
    try {
        const snapshot = await expensesCollection.orderBy('createdAt', 'desc').get();
        expenses = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        console.log('📊 Loaded', expenses.length, 'expenses');
        
        renderBalance();
        renderRecentExpenses();
        renderAllExpenses();
        updateBudgetProgress();
        renderStats();
    } catch (error) {
        console.error('❌ Error loading expenses:', error);
    }
}

async function handleExpenseSubmit(e) {
    e.preventDefault();
    
    if (isSubmitting) {
        console.log('⏳ Already submitting...');
        return;
    }
    
    isSubmitting = true;
    balanceBeforeAction = calculateCurrentBalance();
    
    const amount = parseFloat(document.getElementById('amount').value);
    const paidByValue = document.querySelector('input[name="paidBy"]:checked').value;
    const splitType = document.querySelector('input[name="splitType"]:checked').value;
    const category = document.querySelector('input[name="category"]:checked').value;
    const note = document.getElementById('note').value.trim();
    const countTowardsBudget = document.getElementById('count-towards-budget').checked;
    
    const paidBy = paidByValue === 'me' ? currentUserProfile.role : getPartnerRole();
    
    let krishnaShare, rashiShare;
    
    if (splitType === 'equal') {
        krishnaShare = amount / 2;
        rashiShare = amount / 2;
    } else {
        const myShare = parseFloat(document.getElementById('my-share').value);
        if (currentUserProfile.role === 'krishna') {
            krishnaShare = myShare;
            rashiShare = amount - myShare;
        } else {
            rashiShare = myShare;
            krishnaShare = amount - myShare;
        }
    }
    
    const expense = {
        amount: amount,
        paidBy: paidBy,
        shares: { krishna: krishnaShare, rashi: rashiShare },
        category: category,
        note: note,
        countTowardsBudget: countTowardsBudget,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        createdBy: currentUserProfile.role
    };
    
    showLoading(true);
    
    try {
        const docRef = await expensesCollection.add(expense);
        console.log('✅ Expense added successfully:', docRef.id);
        
        document.getElementById('expense-form').reset();
        document.getElementById('custom-split').classList.add('hidden');
        document.getElementById('count-towards-budget').checked = true;
        
        switchTab('home');
        
    } catch (error) {
        console.error('❌ Failed to add expense:', error);
        showError('Failed to add expense. Please try again.');
    } finally {
        isSubmitting = false;
        showLoading(false);
    }
    
    try {
        await loadExpenses();
    } catch (reloadError) {
        console.warn('⚠️ Reload failed but expense was saved:', reloadError);
    }
}

async function handleExpenseEdit(e) {
    e.preventDefault();
    
    const expenseId = document.getElementById('edit-expense-id').value;
    const amount = parseFloat(document.getElementById('edit-amount').value);
    const note = document.getElementById('edit-note').value.trim();
    
    const expense = expenses.find(e => e.id === expenseId);
    if (!expense || !expense.shares) return;
    
    const ratio = amount / expense.amount;
    const newShares = {
        krishna: expense.shares.krishna * ratio,
        rashi: expense.shares.rashi * ratio
    };
    
    showLoading(true);
    
    try {
        await expensesCollection.doc(expenseId).update({
            amount: amount,
            shares: newShares,
            note: note
        });
        
        console.log('✅ Expense updated:', expenseId);
        document.getElementById('edit-expense-modal').classList.add('hidden');
        await loadExpenses();
    } catch (error) {
        console.error('❌ Update failed:', error);
        showError('Failed to update expense');
    }
    
    showLoading(false);
}

function showEditExpense(expenseId) {
    const expense = expenses.find(e => e.id === expenseId);
    if (!expense) return;
    
    document.getElementById('edit-expense-id').value = expenseId;
    document.getElementById('edit-amount').value = expense.amount;
    document.getElementById('edit-note').value = expense.note || '';
    document.getElementById('edit-expense-modal').classList.remove('hidden');
}

async function deleteExpense(expenseId) {
    if (!confirm('Delete this expense?')) return;
    
    balanceBeforeAction = null;
    
    showLoading(true);
    try {
        await expensesCollection.doc(expenseId).delete();
        console.log('✅ Expense deleted');
        await loadExpenses();
    } catch (error) {
        console.error('❌ Delete failed:', error);
        showError('Failed to delete expense');
    }
    showLoading(false);
}

function showSettleModal() {
    const balance = calculateCurrentBalance();
    const partnerName = getPartnerName();
    
    if (balance === 0) {
        showError('Already settled! Balance is ₹0');
        return;
    }
    
    const settleAmountInput = document.getElementById('settle-amount');
    settleAmountInput.value = Math.abs(balance).toFixed(2);
    
    if (balance > 0) {
        document.getElementById('settle-message').textContent = `${partnerName} owes you ₹${balance.toFixed(2)}`;
        document.getElementById('settle-submessage').textContent = `Enter amount to settle`;
    } else {
        document.getElementById('settle-message').textContent = `You owe ${partnerName} ₹${Math.abs(balance).toFixed(2)}`;
        document.getElementById('settle-submessage').textContent = `Enter amount to settle`;
    }
    
    document.getElementById('settle-modal').classList.remove('hidden');
}

async function handleSettle() {
    const currentBalance = calculateCurrentBalance();
    
    if (currentBalance === 0) {
        document.getElementById('settle-modal').classList.add('hidden');
        return;
    }
    
    const settleAmountInput = document.getElementById('settle-amount');
    let settleAmount = parseFloat(settleAmountInput.value) || Math.abs(currentBalance);
    
    if (settleAmount > Math.abs(currentBalance)) {
        settleAmount = Math.abs(currentBalance);
    }
    
    const partnerName = getPartnerName();
    const partnerRole = getPartnerRole();
    
    const settlingPerson = currentBalance > 0 ? partnerRole : currentUserProfile.role;
    
    const settlementNote = currentBalance > 0 
        ? `Settlement - ${partnerName} paid ₹${settleAmount.toFixed(2)}`
        : `Settlement - ${currentUserProfile.name} paid ₹${settleAmount.toFixed(2)}`;
    
    const settlement = {
        amount: settleAmount,
        paidBy: settlingPerson,
        shares: { krishna: settleAmount, rashi: settleAmount },
        category: 'misc',
        note: settlementNote,
        isSettlement: true,
        countTowardsBudget: false,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        createdBy: currentUserProfile.role
    };
    
    balanceBeforeAction = currentBalance;
    
    showLoading(true);
    
    try {
        await expensesCollection.add(settlement);
        console.log('✅ Settlement completed');
        document.getElementById('settle-modal').classList.add('hidden');
        settleAmountInput.value = '';
        await loadExpenses();
    } catch (error) {
        console.error('❌ Settlement failed:', error);
        showError('Settlement failed');
    }
    
    showLoading(false);
}

function renderBalance() {
    const balance = calculateCurrentBalance();
    const balanceAmount = document.getElementById('balance-amount');
    const balanceStatus = document.getElementById('balance-status');
    const whoPayIndicator = document.getElementById('who-pays-indicator');
    const partnerName = getPartnerName();
    
    if (balance > 0) {
        balanceAmount.textContent = `₹${balance.toFixed(2)}`;
        balanceStatus.textContent = `${partnerName} owes you`;
        whoPayIndicator.textContent = currentUserProfile.role === 'krishna' ? '👩' : '👨';
    } else if (balance < 0) {
        balanceAmount.textContent = `₹${Math.abs(balance).toFixed(2)}`;
        balanceStatus.textContent = `You owe ${partnerName}`;
        whoPayIndicator.textContent = '🙋';
    } else {
        balanceAmount.textContent = '₹0';
        balanceStatus.textContent = 'All settled';
        whoPayIndicator.textContent = '✨';
        
        if (balanceBeforeAction !== null && balanceBeforeAction !== 0) {
            showBalanceCelebration();
            showFloatingHearts();
        }
    }
    
    balanceBeforeAction = null;
}

function showFloatingHearts() {
    const container = document.createElement('div');
    container.className = 'floating-hearts-container';
    document.body.appendChild(container);
    
    for (let i = 0; i < 10; i++) {
        const heart = document.createElement('div');
        heart.className = 'floating-heart';
        heart.textContent = '💝';
        heart.style.left = `${Math.random() * 100}%`;
        heart.style.animationDelay = `${Math.random() * 2}s`;
        container.appendChild(heart);
    }
    
    setTimeout(() => {
        container.remove();
    }, 5000);
}

function renderRecentExpenses() {
    const container = document.getElementById('recent-expenses');
    const recentExpenses = expenses.slice(0, 5);
    
    if (recentExpenses.length === 0) {
        container.innerHTML = '<div class="empty-state"><div class="empty-state-icon">💸</div><p>No expenses yet</p></div>';
        return;
    }
    
    container.innerHTML = recentExpenses.map(expense => {
        const date = expense.createdAt ? expense.createdAt.toDate() : new Date();
        const formattedDate = formatDate(date);
        const paidByText = expense.paidBy === currentUserProfile.role ? 'you' : getPartnerName();
        
        return `
            <div class="expense-item">
                <div class="expense-details">
                    <div class="expense-category">${categoryEmojis[expense.category]}</div>
                    ${expense.note ? `<div class="expense-note">${expense.note}</div>` : ''}
                    <div class="expense-meta">${formattedDate} • Paid by ${paidByText}</div>
                </div>
                <div class="expense-amount">₹${expense.amount.toFixed(2)}</div>
            </div>
        `;
    }).join('');
}

function renderAllExpenses() {
    const container = document.getElementById('expenses-list');
    
    if (expenses.length === 0) {
        container.innerHTML = '<div class="empty-state"><div class="empty-state-icon">📝</div><p>No expenses yet</p></div>';
        return;
    }
    
    const partnerName = getPartnerName();
    
    container.innerHTML = expenses.map(expense => {
        const date = expense.createdAt ? expense.createdAt.toDate() : new Date();
        const formattedDate = formatDate(date);
        const paidByText = expense.paidBy === currentUserProfile.role ? 'you' : partnerName;
        
        let myShare, partnerShare;
        
        if (expense.shares) {
            myShare = expense.shares[currentUserProfile.role] || 0;
            partnerShare = expense.shares[getPartnerRole()] || 0;
        } else if (expense.myShare !== undefined) {
            myShare = expense.myShare;
            partnerShare = expense.partnerShare;
        } else {
            return '';
        }
        
        return `
            <div class="expense-item-full">
                <div class="expense-header">
                    <div class="expense-info">
                        <div class="expense-title">${categoryEmojis[expense.category]} ${expense.note || expense.category}</div>
                        <div class="expense-subtitle">${formattedDate}</div>
                    </div>
                    <div class="expense-price">₹${expense.amount.toFixed(2)}</div>
                </div>
                <div class="expense-split-info">
                    Paid by ${paidByText} • 
                    Your share: ₹${myShare.toFixed(2)} • 
                    ${partnerName}'s share: ₹${partnerShare.toFixed(2)}
                </div>
                <div class="expense-budget-tag ${expense.countTowardsBudget ? 'in-budget' : 'not-in-budget'}">
                    ${expense.countTowardsBudget ? '📊 Counted in budget' : '── Not in budget'}
                </div>
                <div class="expense-actions">
                    <button class="btn-small edit" onclick="showEditExpense('${expense.id}')">Edit</button>
                    <button class="btn-small delete" onclick="deleteExpense('${expense.id}')">Delete</button>
                </div>
            </div>
        `;
    }).join('');
}

function calculateCurrentBalance() {
    let balance = 0;
    const myRole = currentUserProfile.role;
    const partnerRole = getPartnerRole();
    
    expenses.forEach(expense => {
        if (expense.shares) {
            if (expense.paidBy === myRole) {
                const partnerOwes = expense.shares[partnerRole] || 0;
                balance += partnerOwes;
            } else {
                const iOwe = expense.shares[myRole] || 0;
                balance -= iOwe;
            }
        } else if (expense.myShare !== undefined) {
            if (expense.paidBy === myRole) {
                balance += (expense.partnerShare || 0);
            } else {
                balance -= (expense.myShare || 0);
            }
        }
    });
    
    return balance;
}
