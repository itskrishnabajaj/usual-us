// ============================================
// Mood Tracker
// ============================================

async function setMood(mood) {
    currentMood = mood;
    
    const today = new Date().toISOString().split('T')[0];
    localStorage.setItem('usual_us_mood', JSON.stringify({ mood, date: today }));
    
    try {
        await firebase.firestore()
            .collection('moods')
            .doc(today)
            .set({
                [currentUserProfile.role]: mood,
                [`${currentUserProfile.role}_time`]: firebase.firestore.FieldValue.serverTimestamp(),
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            }, { merge: true });
        
        console.log('✅ Mood set:', mood);
        renderMoodIndicator();
        
        document.querySelectorAll('.mood-option').forEach(opt => {
            opt.classList.remove('selected');
        });
        document.querySelector(`[data-mood="${mood}"]`).classList.add('selected');
    } catch (error) {
        console.error('Could not save mood:', error);
    }
}

async function loadTodaysMood() {
    const stored = localStorage.getItem('usual_us_mood');
    if (stored) {
        try {
            const { mood, date } = JSON.parse(stored);
            const today = new Date().toISOString().split('T')[0];
            if (date === today && mood) {
                currentMood = mood;
                renderMoodIndicator();
                document.querySelectorAll('.mood-option').forEach(opt => opt.classList.remove('selected'));
                const moodOption = document.querySelector(`[data-mood="${currentMood}"]`);
                if (moodOption) moodOption.classList.add('selected');
            }
        } catch (e) { /* ignore corrupted localStorage */ }
    }
    
    try {
        const today = new Date().toISOString().split('T')[0];
        const doc = await firebase.firestore()
            .collection('moods')
            .doc(today)
            .get();
        
        if (doc.exists) {
            const data = doc.data();
            if (data[currentUserProfile.role]) {
                currentMood = data[currentUserProfile.role];
                renderMoodIndicator();
                
                document.querySelectorAll('.mood-option').forEach(opt => opt.classList.remove('selected'));
                const moodOption = document.querySelector(`[data-mood="${currentMood}"]`);
                if (moodOption) {
                    moodOption.classList.add('selected');
                }
                
                localStorage.setItem('usual_us_mood', JSON.stringify({ mood: currentMood, date: today }));
            }
            
            const partnerRole = currentUserProfile.role === 'krishna' ? 'rashi' : 'krishna';
            const partnerName = currentUserProfile.role === 'krishna' ? 'Gugu' : 'Susu';
            if (data[partnerRole]) {
                const partnerMoodDisplay = document.getElementById('partner-mood-display');
                if (partnerMoodDisplay) {
                    let timeStr = '';
                    const partnerTimeField = `${partnerRole}_time`;
                    if (data[partnerTimeField]) {
                        const moodTime = data[partnerTimeField].toDate();
                        timeStr = ` at ${moodTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`;
                    }
                    partnerMoodDisplay.innerHTML = `${partnerName} is feeling ${moodEmojis[data[partnerRole]]}${timeStr}`;
                    partnerMoodDisplay.classList.remove('hidden');
                }
            }
        }
    } catch (error) {
        console.warn('Could not load mood:', error);
    }
}

function renderMoodIndicator() {
    const indicator = document.getElementById('current-mood-display');
    if (!indicator || !currentMood) return;
    
    indicator.innerHTML = `Today: ${moodEmojis[currentMood]}`;
    indicator.classList.remove('hidden');
}
