// ============================================
// Expenses
// ============================================

let _expensesLoading = false;

async function loadExpenses() {
    if (_expensesLoading) return;
    _expensesLoading = true;
    try {
        const snapshot = await expensesCollection.orderBy('createdAt', 'desc').get();
        expenses = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        invalidateBalanceCache();
        console.log('📊 Loaded', expenses.length, 'expenses');
        
        renderBalance();
        renderRecentExpenses();
        renderAllExpenses();
        populateMonthFilter();

        // Notify other modules that expense data has been refreshed
        EventBus.emit('expenses:loaded');
    } catch (error) {
        console.error('❌ Error loading expenses:', error);
    } finally {
        _expensesLoading = false;
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
    if (!amount || isNaN(amount) || amount <= 0) {
        showError('Please enter a valid amount greater than 0');
        isSubmitting = false;
        return;
    }
    const paidByValue = document.querySelector('input[name="paidBy"]:checked').value;
    const splitType = document.querySelector('input[name="splitType"]:checked').value;
    const category = document.querySelector('input[name="category"]:checked').value;
    const note = document.getElementById('note').value.trim();
    const countTowardsBudget = document.getElementById('count-towards-budget').checked;
    
    // Read expense date (defaults to today if not set)
    const expenseDateInput = document.getElementById('expense-date').value;
    let expenseDate;
    if (expenseDateInput) {
        const [y, m, d] = expenseDateInput.split('-').map(Number);
        expenseDate = firebase.firestore.Timestamp.fromDate(new Date(y, m - 1, d, 12, 0, 0));
    } else {
        expenseDate = firebase.firestore.Timestamp.fromDate(new Date());
    }
    
    const paidBy = paidByValue === 'me' ? currentUserProfile.role : getPartnerRole();
    
    let krishnaShare, rashiShare;
    
    if (splitType === 'equal') {
        krishnaShare = amount / 2;
        rashiShare = amount / 2;
    } else {
        const myShare = parseFloat(document.getElementById('my-share').value);
        if (isNaN(myShare) || myShare < 0 || myShare > amount) {
            showError('Custom share must be between 0 and the total amount');
            isSubmitting = false;
            return;
        }
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
        expenseDate: expenseDate,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        createdBy: currentUserProfile.role
    };
    
    showLoading(true);
    
    try {
        const docRef = await expensesCollection.add(expense);
        console.log('✅ Expense added successfully:', docRef.id);
        EventBus.emit('expense:created', { id: docRef.id });
        
        document.getElementById('expense-form').reset();
        document.getElementById('custom-split').classList.add('hidden');
        document.getElementById('count-towards-budget').checked = true;
        // Reset expense date to today
        const today = new Date();
        document.getElementById('expense-date').value = today.getFullYear() + '-' + 
            String(today.getMonth() + 1).padStart(2, '0') + '-' + 
            String(today.getDate()).padStart(2, '0');
        
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
    
    if (!amount || isNaN(amount) || amount <= 0) {
        showError('Please enter a valid amount greater than 0');
        return;
    }
    
    const expense = expenses.find(e => e.id === expenseId);
    if (!expense || !expense.shares) return;
    
    // Read edited paid-by
    const editPaidByValue = document.querySelector('input[name="editPaidBy"]:checked').value;
    const newPaidBy = editPaidByValue === 'me' ? currentUserProfile.role : getPartnerRole();
    
    // Read edited category
    const editCategoryEl = document.querySelector('input[name="editCategory"]:checked');
    const newCategory = editCategoryEl ? editCategoryEl.value : expense.category;
    
    // Read edited expense date
    const editDateInput = document.getElementById('edit-expense-date').value;
    let newExpenseDate;
    if (editDateInput) {
        const [y, m, d] = editDateInput.split('-').map(Number);
        newExpenseDate = firebase.firestore.Timestamp.fromDate(new Date(y, m - 1, d, 12, 0, 0));
    } else {
        newExpenseDate = expense.expenseDate || expense.createdAt;
    }
    
    // Recalculate shares proportionally (guard against division by zero)
    const oldAmount = expense.amount || 1;
    const ratio = amount / oldAmount;
    const newShares = {
        krishna: expense.shares.krishna * ratio,
        rashi: expense.shares.rashi * ratio
    };
    
    showLoading(true);
    
    try {
        await expensesCollection.doc(expenseId).update({
            amount: amount,
            shares: newShares,
            note: note,
            paidBy: newPaidBy,
            category: newCategory,
            expenseDate: newExpenseDate
        });
        
        console.log('✅ Expense updated:', expenseId);
        EventBus.emit('expense:edited', { id: expenseId });
        document.getElementById('edit-expense-modal').classList.add('hidden');
        await loadExpenses();
    } catch (error) {
        console.error('❌ Update failed:', error);
        showError('Failed to update expense');
    }
    
    showLoading(false);
}

function showEditExpense(expenseId) {
    EventBus.emit('ui:button');
    const expense = expenses.find(e => e.id === expenseId);
    if (!expense) return;
    
    document.getElementById('edit-expense-id').value = expenseId;
    document.getElementById('edit-amount').value = expense.amount;
    document.getElementById('edit-note').value = expense.note || '';
    
    // Set paid by
    const isPaidByMe = expense.paidBy === currentUserProfile.role;
    const editPaidByRadio = document.querySelector(`input[name="editPaidBy"][value="${isPaidByMe ? 'me' : 'partner'}"]`);
    if (editPaidByRadio) editPaidByRadio.checked = true;
    
    // Set labels
    document.getElementById('edit-my-name-label').textContent = currentUserProfile.name;
    document.getElementById('edit-partner-name-label').textContent = getPartnerName();
    
    // Set category
    const editCatRadio = document.querySelector(`input[name="editCategory"][value="${expense.category}"]`);
    if (editCatRadio) editCatRadio.checked = true;
    
    // Set expense date
    const expDate = getExpenseDate(expense);
    const dateStr = expDate.getFullYear() + '-' + 
                    String(expDate.getMonth() + 1).padStart(2, '0') + '-' + 
                    String(expDate.getDate()).padStart(2, '0');
    document.getElementById('edit-expense-date').value = dateStr;
    
    document.getElementById('edit-expense-modal').classList.remove('hidden');
}

async function deleteExpense(expenseId) {
    if (!confirm('Delete this expense?')) return;
    
    balanceBeforeAction = null;
    
    showLoading(true);
    try {
        await expensesCollection.doc(expenseId).delete();
        console.log('✅ Expense deleted');
        EventBus.emit('expense:deleted', { id: expenseId });
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
    
    if (isNaN(settleAmount) || settleAmount <= 0) {
        showError('Please enter a valid settlement amount');
        return;
    }
    
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
        expenseDate: firebase.firestore.Timestamp.fromDate(new Date()),
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        createdBy: currentUserProfile.role
    };
    
    balanceBeforeAction = currentBalance;
    
    showLoading(true);
    
    try {
        await expensesCollection.add(settlement);
        console.log('✅ Settlement completed');
        EventBus.emit('expense:settled');
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
        whoPayIndicator.innerHTML = currentUserProfile.role === 'krishna' ? '<img src="icons/her.svg" alt="Her" class="icon-whopays">' : '<img src="icons/him.svg" alt="Him" class="icon-whopays">';
    } else if (balance < 0) {
        balanceAmount.textContent = `₹${Math.abs(balance).toFixed(2)}`;
        balanceStatus.textContent = `You owe ${partnerName}`;
        whoPayIndicator.innerHTML = currentUserProfile.role === 'krishna' ? '<img src="icons/him.svg" alt="Him" class="icon-whopays">' : '<img src="icons/her.svg" alt="Her" class="icon-whopays">';
    } else {
        balanceAmount.textContent = '₹0';
        balanceStatus.textContent = 'All settled';
        whoPayIndicator.innerHTML = '<img src="icons/allsettled.svg" alt="All settled" class="icon-whopays">';
        
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
        const date = getExpenseDate(expense);
        const formattedDate = formatDate(date);
        const paidByText = expense.paidBy === currentUserProfile.role ? 'you' : getPartnerName();
        
        return `
            <div class="expense-item">
                <div class="expense-details">
                    <div class="expense-category">${categoryEmojis[expense.category] || ''}</div>
                    ${expense.note ? `<div class="expense-note">${escapeHTML(expense.note)}</div>` : ''}
                    <div class="expense-meta">${formattedDate} • Paid by ${escapeHTML(paidByText)}</div>
                </div>
                <div class="expense-amount">₹${expense.amount.toFixed(2)}</div>
            </div>
        `;
    }).join('');
}

function getFilteredExpenses() {
    return expenses.filter(expense => {
        // Text search
        if (expenseFilters.search) {
            const searchLower = expenseFilters.search.toLowerCase();
            const noteMatch = (expense.note || '').toLowerCase().includes(searchLower);
            const catMatch = (expense.category || '').toLowerCase().includes(searchLower);
            if (!noteMatch && !catMatch) return false;
        }
        
        // Paid by filter
        if (expenseFilters.paidBy !== 'all') {
            if (expenseFilters.paidBy === 'me' && expense.paidBy !== currentUserProfile.role) return false;
            if (expenseFilters.paidBy === 'partner' && expense.paidBy === currentUserProfile.role) return false;
        }
        
        // Month filter
        if (expenseFilters.month !== 'all') {
            const date = getExpenseDate(expense);
            const monthKey = date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0');
            if (monthKey !== expenseFilters.month) return false;
        }
        
        return true;
    });
}

function populateMonthFilter() {
    const select = document.getElementById('filter-month');
    if (!select) return;
    
    const months = new Set();
    expenses.forEach(expense => {
        const date = getExpenseDate(expense);
        const key = date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0');
        months.add(key);
    });
    
    const sorted = Array.from(months).sort().reverse();
    const currentVal = select.value;
    
    select.innerHTML = '<option value="all">All Months</option>' + sorted.map(m => {
        const [y, mo] = m.split('-');
        const d = new Date(parseInt(y), parseInt(mo) - 1, 1);
        const label = d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        return `<option value="${m}">${label}</option>`;
    }).join('');
    
    // Restore selection if still valid
    if (currentVal && select.querySelector(`option[value="${currentVal}"]`)) {
        select.value = currentVal;
    }
}

function renderAllExpenses() {
    const container = document.getElementById('expenses-list');
    const filtered = getFilteredExpenses();
    
    if (filtered.length === 0) {
        container.innerHTML = '<div class="empty-state"><div class="empty-state-icon">📝</div><p>No expenses found</p></div>';
        return;
    }
    
    const partnerName = getPartnerName();
    
    container.innerHTML = filtered.map(expense => {
        const date = getExpenseDate(expense);
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
                        <div class="expense-title">${categoryEmojis[expense.category] || ''} ${escapeHTML(expense.note || expense.category)}</div>
                        <div class="expense-subtitle">${formattedDate}</div>
                    </div>
                    <div class="expense-price">₹${expense.amount.toFixed(2)}</div>
                </div>
                <div class="expense-split-info">
                    Paid by ${escapeHTML(paidByText)} • 
                    Your share: ₹${myShare.toFixed(2)} • 
                    ${escapeHTML(partnerName)}'s share: ₹${partnerShare.toFixed(2)}
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

// Cached balance value – invalidated whenever expenses array changes
let _cachedBalance = null;

function calculateCurrentBalance() {
    if (_cachedBalance !== null) return _cachedBalance;
    
    let balance = 0;
    const myRole = currentUserProfile.role;
    const partnerRole = getPartnerRole();
    
    expenses.forEach(expense => {
        if (expense.shares) {
            if (expense.paidBy === myRole) {
                const partnerOwes = parseFloat(expense.shares[partnerRole]) || 0;
                balance += partnerOwes;
            } else {
                const iOwe = parseFloat(expense.shares[myRole]) || 0;
                balance -= iOwe;
            }
        } else if (expense.myShare !== undefined) {
            if (expense.paidBy === myRole) {
                balance += (parseFloat(expense.partnerShare) || 0);
            } else {
                balance -= (parseFloat(expense.myShare) || 0);
            }
        }
    });
    
    // Round to 2 decimal places to avoid floating point drift
    _cachedBalance = Math.round(balance * 100) / 100;
    return _cachedBalance;
}

function invalidateBalanceCache() {
    _cachedBalance = null;
}
