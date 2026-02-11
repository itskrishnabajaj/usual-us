// ============================================
// Statistics
// ============================================

function renderStats() {
    const now = new Date();
    const thisMonth = expenses.filter(expense => {
        if (!expense.createdAt) return false;
        try {
            const expenseDate = expense.createdAt.toDate ? expense.createdAt.toDate() : new Date(expense.createdAt);
            return expenseDate.getMonth() === now.getMonth() && 
                   expenseDate.getFullYear() === now.getFullYear();
        } catch (e) {
            return false;
        }
    });
    
    const totalSpent = thisMonth.reduce((sum, e) => sum + e.amount, 0);
    const myContribution = thisMonth.reduce((sum, e) => 
        sum + (e.paidBy === currentUserProfile.role ? e.amount : 0), 0);
    const partnerContribution = thisMonth.reduce((sum, e) => 
        sum + (e.paidBy !== currentUserProfile.role ? e.amount : 0), 0);
    
    document.getElementById('total-spent').textContent = `₹${totalSpent.toFixed(2)}`;
    document.getElementById('my-contribution').textContent = `₹${myContribution.toFixed(2)}`;
    document.getElementById('partner-contribution').textContent = `₹${partnerContribution.toFixed(2)}`;
    
    const categoryTotals = {};
    thisMonth.forEach(expense => {
        categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + expense.amount;
    });
    
    const breakdownContainer = document.getElementById('category-breakdown');
    const pieChartContainer = document.getElementById('pie-chart-container');
    const sortedCategories = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]);
    
    if (sortedCategories.length === 0) {
        breakdownContainer.innerHTML = '<div class="empty-state"><p>No expenses this month</p></div>';
        if (pieChartContainer) pieChartContainer.innerHTML = '';
        return;
    }
    
    if (pieChartContainer && totalSpent > 0) {
        const pieColors = ['#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#00bcd4', '#ff9800'];
        let cumulativePercent = 0;
        
        const slices = sortedCategories.map(([category, amount], index) => {
            const percent = amount / totalSpent;
            const startAngle = cumulativePercent * 2 * Math.PI;
            cumulativePercent += percent;
            const endAngle = cumulativePercent * 2 * Math.PI;
            const color = pieColors[index % pieColors.length];
            
            const x1 = 100 + 90 * Math.cos(startAngle);
            const y1 = 100 + 90 * Math.sin(startAngle);
            const x2 = 100 + 90 * Math.cos(endAngle);
            const y2 = 100 + 90 * Math.sin(endAngle);
            const largeArc = percent > 0.5 ? 1 : 0;
            
            if (sortedCategories.length === 1) {
                return `<circle cx="100" cy="100" r="90" fill="${color}" opacity="0.85"/>`;
            }
            
            return `<path d="M100,100 L${x1},${y1} A90,90 0 ${largeArc},1 ${x2},${y2} Z" fill="${color}" opacity="0.85" class="pie-slice"/>`;
        }).join('');
        
        const legendItems = sortedCategories.map(([category, amount], index) => {
            const color = pieColors[index % pieColors.length];
            const percent = ((amount / totalSpent) * 100).toFixed(0);
            return `<div class="legend-item">
                <div class="legend-color" style="background:${color}"></div>
                <span>${categoryEmojis[category] || '📦'} ${category} ${percent}%</span>
            </div>`;
        }).join('');
        
        pieChartContainer.innerHTML = `
            <svg class="pie-chart-svg" viewBox="0 0 200 200">
                ${slices}
                <circle cx="100" cy="100" r="50" class="pie-chart-center"/>
                <text x="100" y="95" text-anchor="middle" fill="var(--text-primary)" font-size="16" font-weight="700" transform="rotate(90, 100, 100)">₹${totalSpent.toFixed(0)}</text>
                <text x="100" y="112" text-anchor="middle" fill="var(--text-secondary)" font-size="10" transform="rotate(90, 100, 100)">total</text>
            </svg>
            <div class="pie-chart-legend">${legendItems}</div>
        `;
    }
    
    breakdownContainer.innerHTML = sortedCategories.map(([category, amount]) => {
        const percent = ((amount / totalSpent) * 100).toFixed(0);
        return `
        <div class="category-stat">
            <div class="category-info">
                <div class="category-emoji">${categoryEmojis[category]}</div>
                <div class="category-name">${category}</div>
            </div>
            <div class="category-amount-group">
                <div class="category-amount">₹${amount.toFixed(2)}</div>
                <div class="category-percent">${percent}%</div>
            </div>
        </div>
    `}).join('');
}
