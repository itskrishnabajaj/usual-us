// ============================================
// Moments Timeline — Independent Module
// ============================================
// All calendar/moment logic lives here.
// The Us tab only calls renderMomentsPreview().

let moments = [];
let momentsLoaded = false;

// ---- Firestore CRUD ----

async function loadMoments() {
    try {
        const snapshot = await momentsCollection.orderBy('date', 'asc').get();
        moments = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        momentsLoaded = true;
        renderMomentsPreview();
    } catch (error) {
        console.error('❌ Error loading moments:', error);
    }
}

async function addMoment(momentData) {
    try {
        const doc = {
            title: momentData.title,
            date: firebase.firestore.Timestamp.fromDate(new Date(momentData.date)),
            type: momentData.type || 'date',
            notes: momentData.notes || '',
            linkedExpenses: momentData.linkedExpenses || [],
            linkedMemories: momentData.linkedMemories || [],
            mood: momentData.mood || null,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            createdBy: currentUserProfile.role
        };
        const ref = await momentsCollection.add(doc);
        moments.push({ id: ref.id, ...doc, date: doc.date });
        moments.sort((a, b) => getMomentDate(a) - getMomentDate(b));
        renderMomentsPreview();
        return ref.id;
    } catch (error) {
        console.error('❌ Error adding moment:', error);
        throw error;
    }
}

async function updateMoment(id, updates) {
    try {
        const doc = {};
        if (updates.title !== undefined) doc.title = updates.title;
        if (updates.date !== undefined) doc.date = firebase.firestore.Timestamp.fromDate(new Date(updates.date));
        if (updates.type !== undefined) doc.type = updates.type;
        if (updates.notes !== undefined) doc.notes = updates.notes;
        if (updates.linkedExpenses !== undefined) doc.linkedExpenses = updates.linkedExpenses;
        if (updates.linkedMemories !== undefined) doc.linkedMemories = updates.linkedMemories;
        if (updates.mood !== undefined) doc.mood = updates.mood;
        await momentsCollection.doc(id).update(doc);
        const idx = moments.findIndex(m => m.id === id);
        if (idx !== -1) Object.assign(moments[idx], doc);
        moments.sort((a, b) => getMomentDate(a) - getMomentDate(b));
        renderMomentsPreview();
    } catch (error) {
        console.error('❌ Error updating moment:', error);
        throw error;
    }
}

async function deleteMoment(id) {
    if (!confirm('Delete this moment?')) return;
    try {
        await momentsCollection.doc(id).delete();
        moments = moments.filter(m => m.id !== id);
        renderMomentsPreview();
        renderMomentsFullView();
        showSuccess('Moment deleted');
    } catch (error) {
        console.error('❌ Error deleting moment:', error);
        showError('Could not delete moment');
    }
}

// ---- Date helpers ----

function getMomentDate(moment) {
    if (moment.date && moment.date.toDate) return moment.date.toDate();
    if (moment.date instanceof Date) return moment.date;
    return new Date(moment.date);
}

function formatMomentDate(moment) {
    const d = getMomentDate(moment);
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

function getMomentRelativeLabel(moment) {
    const d = getMomentDate(moment);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(d);
    target.setHours(0, 0, 0, 0);
    const diff = Math.round((target - today) / (1000 * 60 * 60 * 24));
    if (diff === 0) return 'Today';
    if (diff === 1) return 'Tomorrow';
    if (diff === -1) return 'Yesterday';
    if (diff > 1 && diff <= 7) return `In ${diff} days`;
    return formatMomentDate(moment);
}

// ---- Type helpers ----

const MOMENT_TYPES = {
    date: { emoji: '💕', label: 'Date' },
    trip: { emoji: '✈️', label: 'Trip' },
    anniversary: { emoji: '💍', label: 'Anniversary' },
    movie: { emoji: '🎬', label: 'Movie' },
    dinner: { emoji: '🍽️', label: 'Dinner' },
    outing: { emoji: '🌸', label: 'Outing' },
    special: { emoji: '⭐', label: 'Special' },
    other: { emoji: '🤍', label: 'Other' }
};

function getMomentTypeInfo(type) {
    return MOMENT_TYPES[type] || MOMENT_TYPES.other;
}

// ---- Linking helpers (lightweight references) ----

function getLinkedExpensesData(moment) {
    if (!moment.linkedExpenses || !moment.linkedExpenses.length) return [];
    return expenses.filter(e => moment.linkedExpenses.includes(e.id));
}

function getLinkedMemoriesData(moment) {
    if (!moment.linkedMemories || !moment.linkedMemories.length) return [];
    return memories.filter(m => moment.linkedMemories.includes(m.id));
}

function getLinkedExpensesTotal(moment) {
    return getLinkedExpensesData(moment).reduce((sum, e) => sum + (e.amount || 0), 0);
}

// ---- Us Tab Lightweight Preview ----

function renderMomentsPreview() {
    const container = document.getElementById('moments-preview');
    if (!container) return;

    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const upcoming = moments
        .filter(m => getMomentDate(m) >= now)
        .slice(0, 3);

    if (upcoming.length === 0) {
        container.innerHTML = `
            <div class="moments-preview-header">
                <span class="moments-preview-title">Upcoming Moments ❤️</span>
            </div>
            <p class="moments-preview-empty">No upcoming moments yet</p>
            <button class="moments-preview-add" onclick="openMomentsFullView()">+ Plan a moment</button>
        `;
        return;
    }

    const itemsHTML = upcoming.map(m => {
        const info = getMomentTypeInfo(m.type);
        return `<div class="moments-preview-item" onclick="openMomentsFullView()">
            <span class="moments-preview-emoji">${info.emoji}</span>
            <span class="moments-preview-text">${escapeHTML(m.title)}</span>
            <span class="moments-preview-date">${getMomentRelativeLabel(m)}</span>
        </div>`;
    }).join('');

    container.innerHTML = `
        <div class="moments-preview-header" onclick="openMomentsFullView()">
            <span class="moments-preview-title">Upcoming Moments ❤️</span>
            <span class="moments-preview-arrow">›</span>
        </div>
        ${itemsHTML}
    `;
}

// ---- Full Moments View ----

function openMomentsFullView() {
    const modal = document.getElementById('moments-modal');
    if (!modal) return;
    modal.classList.remove('hidden');
    renderMomentsFullView();
}

function closeMomentsModal() {
    const modal = document.getElementById('moments-modal');
    if (modal) modal.classList.add('hidden');
}

function renderMomentsFullView() {
    const upcomingList = document.getElementById('moments-upcoming-list');
    const pastList = document.getElementById('moments-past-list');
    if (!upcomingList || !pastList) return;

    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const upcoming = moments.filter(m => getMomentDate(m) >= now);
    const past = moments.filter(m => getMomentDate(m) < now).reverse();

    upcomingList.innerHTML = upcoming.length
        ? upcoming.map(m => buildMomentCard(m)).join('')
        : '<p class="moments-empty-msg">No upcoming moments</p>';

    pastList.innerHTML = past.length
        ? past.map(m => buildMomentCard(m)).join('')
        : '<p class="moments-empty-msg">No past moments yet</p>';
}

function buildMomentCard(m) {
    const info = getMomentTypeInfo(m.type);
    const linkedExp = getLinkedExpensesData(m);
    const linkedMem = getLinkedMemoriesData(m);
    const totalExp = linkedExp.reduce((s, e) => s + (e.amount || 0), 0);
    const moodHTML = m.mood ? `<span class="moment-card-mood">${moodEmojis[m.mood] || ''}</span>` : '';

    let metaHTML = '';
    if (totalExp > 0) metaHTML += `<span class="moment-card-meta-item">₹${totalExp}</span>`;
    if (linkedMem.length > 0) metaHTML += `<span class="moment-card-meta-item">${linkedMem.length} ${linkedMem.length === 1 ? 'memory' : 'memories'}</span>`;

    return `
    <div class="moment-card" data-id="${m.id}">
        <div class="moment-card-header">
            <span class="moment-card-emoji">${info.emoji}</span>
            <div class="moment-card-info">
                <div class="moment-card-title">${escapeHTML(m.title)}</div>
                <div class="moment-card-date">${formatMomentDate(m)}</div>
            </div>
            ${moodHTML}
        </div>
        ${m.notes ? `<div class="moment-card-notes">${escapeHTML(m.notes)}</div>` : ''}
        ${metaHTML ? `<div class="moment-card-meta">${metaHTML}</div>` : ''}
        <div class="moment-card-actions">
            <button class="moment-btn-edit" onclick="openEditMoment('${m.id}')">Edit</button>
            <button class="moment-btn-delete" onclick="deleteMoment('${m.id}')">Delete</button>
        </div>
    </div>`;
}

// ---- Create / Edit Moment Modal ----

let editingMomentId = null;

function openCreateMoment() {
    editingMomentId = null;
    const modal = document.getElementById('moment-form-modal');
    if (!modal) return;
    document.getElementById('moment-form-title').textContent = 'New Moment';
    document.getElementById('moment-title-input').value = '';
    document.getElementById('moment-date-input').value = new Date().toISOString().split('T')[0];
    document.getElementById('moment-type-select').value = 'date';
    document.getElementById('moment-notes-input').value = '';
    modal.classList.remove('hidden');
}

function openEditMoment(id) {
    const m = moments.find(mo => mo.id === id);
    if (!m) return;
    editingMomentId = id;
    const modal = document.getElementById('moment-form-modal');
    if (!modal) return;
    document.getElementById('moment-form-title').textContent = 'Edit Moment';
    document.getElementById('moment-title-input').value = m.title || '';
    const d = getMomentDate(m);
    document.getElementById('moment-date-input').value = d.getFullYear() + '-' +
        String(d.getMonth() + 1).padStart(2, '0') + '-' +
        String(d.getDate()).padStart(2, '0');
    document.getElementById('moment-type-select').value = m.type || 'date';
    document.getElementById('moment-notes-input').value = m.notes || '';
    modal.classList.remove('hidden');
}

function closeMomentForm() {
    const modal = document.getElementById('moment-form-modal');
    if (modal) modal.classList.add('hidden');
    editingMomentId = null;
}

async function handleMomentFormSubmit() {
    const title = document.getElementById('moment-title-input').value.trim();
    const date = document.getElementById('moment-date-input').value;
    const type = document.getElementById('moment-type-select').value;
    const notes = document.getElementById('moment-notes-input').value.trim();

    if (!title) { showError('Please enter a title'); return; }
    if (!date) { showError('Please pick a date'); return; }

    try {
        if (editingMomentId) {
            await updateMoment(editingMomentId, { title, date, type, notes });
            showSuccess('Moment updated');
        } else {
            await addMoment({ title, date, type, notes });
            showSuccess('Moment created');
            EventBus.emit('moment:created');
        }
        closeMomentForm();
        renderMomentsFullView();
    } catch (error) {
        showError('Could not save moment');
    }
}

// ---- Global Exports ----
window.openMomentsFullView = openMomentsFullView;
window.closeMomentsModal = closeMomentsModal;
window.openCreateMoment = openCreateMoment;
window.openEditMoment = openEditMoment;
window.closeMomentForm = closeMomentForm;
window.handleMomentFormSubmit = handleMomentFormSubmit;
window.deleteMoment = deleteMoment;
