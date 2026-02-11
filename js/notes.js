// ============================================
// Notes
// ============================================

async function loadNotes() {
    try {
        const snapshot = await notesCollection.orderBy('createdAt', 'desc').limit(20).get();
        notes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        console.log('📝 Loaded', notes.length, 'notes');
        
        renderNotes();
    } catch (error) {
        console.error('❌ Error loading notes:', error);
    }
}

async function handleNoteSubmit(e) {
    e.preventDefault();
    
    const noteText = document.getElementById('note-text').value.trim();
    if (!noteText) return;
    
    const note = {
        text: noteText,
        createdBy: currentUserProfile.role,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
    };
    
    showLoading(true);
    
    try {
        await notesCollection.add(note);
        console.log('✅ Note added');
        document.getElementById('note-modal').classList.add('hidden');
        document.getElementById('note-form').reset();
        await loadNotes();
    } catch (error) {
        console.error('❌ Note save error:', error);
        showError('Failed to save note');
    }
    
    showLoading(false);
}

async function deleteNote(noteId) {
    if (!confirm('Delete this note?')) return;
    
    showLoading(true);
    try {
        await notesCollection.doc(noteId).delete();
        console.log('✅ Note deleted');
        await loadNotes();
    } catch (error) {
        console.error('❌ Note delete error:', error);
        showError('Failed to delete note');
    }
    showLoading(false);
}

function renderNotes() {
    const container = document.getElementById('notes-container');
    
    if (notes.length === 0) {
        container.innerHTML = '<p class="notes-empty">No notes yet. Share what you noticed today.</p>';
        return;
    }
    
    const pastelColors = ['#fef5e7', '#ffe4e4', '#e8f5e8', '#f0e7f5'];
    
    container.innerHTML = notes.map((note, index) => {
        const color = pastelColors[index % pastelColors.length];
        const rotation = getStableNoteRotation(note.id);
        
        return `
            <div class="sticky-note" 
                 style="background: ${color}; transform: rotate(${rotation}deg)" 
                 data-note-id="${note.id}"
                 ontouchstart="handleNoteTouchStart(event, '${note.id}')"
                 ontouchend="handleNoteTouchEnd()"
                 ontouchmove="handleNoteTouchMove()">
                <p>${note.text}</p>
            </div>
        `;
    }).join('');
}

function handleNoteTouchStart(event, noteId) {
    currentNoteLongPress = noteId;
    longPressNoteTimer = setTimeout(() => {
        if (currentNoteLongPress === noteId) {
            deleteNote(noteId);
        }
    }, 1000);
}

function handleNoteTouchEnd() {
    if (longPressNoteTimer) {
        clearTimeout(longPressNoteTimer);
        longPressNoteTimer = null;
    }
    currentNoteLongPress = null;
}

function handleNoteTouchMove() {
    if (longPressNoteTimer) {
        clearTimeout(longPressNoteTimer);
        longPressNoteTimer = null;
    }
    currentNoteLongPress = null;
}

async function loadSecretNotes() {
    try {
        const snapshot = await firebase.firestore()
            .collection('secret_notes')
            .orderBy('unlockDate', 'asc')
            .get();
        
        secretNotes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        console.log('💝 Loaded', secretNotes.length, 'secret notes');
        
        renderSecretNotes();
    } catch (error) {
        console.warn('Could not load secret notes:', error);
    }
}

function renderSecretNotes() {
    const container = document.getElementById('secret-notes-container');
    if (!container) return;
    
    const now = new Date();
    
    if (secretNotes.length === 0) {
        container.innerHTML = '<p class="empty-secret-notes">No secret notes yet</p>';
        return;
    }
    
    container.innerHTML = secretNotes.map(note => {
        const unlockDate = note.unlockDate.toDate();
        const isUnlocked = now >= unlockDate;
        const daysUntil = Math.ceil((unlockDate - now) / (1000 * 60 * 60 * 24));
        
        if (isUnlocked) {
            return `
                <div class="secret-note unlocked">
                    <div class="secret-note-icon">💝</div>
                    <div class="secret-note-content">${note.content}</div>
                    <div class="secret-note-date">Unlocked ${formatDate(unlockDate)}</div>
                </div>
            `;
        } else {
            return `
                <div class="secret-note locked">
                    <div class="secret-note-icon">🔒</div>
                    <div class="secret-note-title">${note.title || 'Secret Note'}</div>
                    <div class="secret-note-countdown">Unlocks in ${daysUntil} day${daysUntil !== 1 ? 's' : ''}</div>
                </div>
            `;
        }
    }).join('');
}

async function handleSecretNoteSubmit(e) {
    e.preventDefault();
    
    const title = document.getElementById('secret-note-title').value.trim();
    const content = document.getElementById('secret-note-content').value.trim();
    const unlockDateInput = document.getElementById('secret-note-unlock-date').value;
    
    if (!title || !content || !unlockDateInput) {
        showError('Please fill all fields');
        return;
    }
    
    const [year, month, day] = unlockDateInput.split('-').map(Number);
    const unlockDate = new Date(year, month - 1, day, 0, 0, 0);
    
    const secretNote = {
        title: title,
        content: content,
        unlockDate: firebase.firestore.Timestamp.fromDate(unlockDate),
        createdBy: currentUserProfile.role,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
    };
    
    showLoading(true);
    
    try {
        await firebase.firestore()
            .collection('secret_notes')
            .add(secretNote);
        
        console.log('✅ Secret note created');
        document.getElementById('secret-note-modal').classList.add('hidden');
        document.getElementById('secret-note-form').reset();
        await loadSecretNotes();
    } catch (error) {
        console.error('❌ Secret note error:', error);
        showError('Failed to create secret note');
    }
    
    showLoading(false);
}

function getStableNoteRotation(id) {
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
        hash = ((hash << 5) - hash) + id.charCodeAt(i);
        hash |= 0;
    }
    return ((Math.abs(hash) % 400) / 100 - 2).toFixed(2);
}
