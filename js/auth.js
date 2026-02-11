// ============================================
// Authentication
// ============================================

function initializeAuth() {
    const savedUserId = localStorage.getItem('usual_us_user_id');
    
    if (savedUserId && USERS[savedUserId]) {
        document.getElementById('returning-name').textContent = USERS[savedUserId].name;
        document.getElementById('first-login-form').classList.add('hidden');
        document.getElementById('returning-login-form').classList.remove('hidden');
        document.getElementById('switch-user-btn').classList.remove('hidden');
    } else {
        localStorage.removeItem('usual_us_user_id');
        document.getElementById('first-login-form').classList.remove('hidden');
        document.getElementById('returning-login-form').classList.add('hidden');
        document.getElementById('switch-user-btn').classList.add('hidden');
    }
    
    document.getElementById('login-screen').classList.remove('hidden');
    document.getElementById('app').classList.add('hidden');
}

async function handleLogin(userId, pin, isReturning = false) {
    const user = USERS[userId];
    
    if (!user) {
        showError('Invalid User ID');
        return false;
    }
    
    if (user.pin !== pin) {
        showError('Incorrect PIN');
        return false;
    }
    
    if (!isReturning) {
        localStorage.setItem('usual_us_user_id', userId);
    }
    
    currentUserProfile = {
        uid: userId,
        name: user.name,
        role: user.role
    };
    
    currentUser = userId;
    
    console.log('✅ Logged in:', currentUserProfile.name, `(${currentUserProfile.role})`);
    
    initializeFirebase();
    await loadUserProfile();
    updateDynamicLabels();
    
    document.getElementById('login-screen').classList.add('hidden');
    document.getElementById('app').classList.remove('hidden');
    
    await loadData();
    return true;
}

async function loadUserProfile() {
    try {
        const userDoc = await usersCollection.doc(currentUser).get();
        
        if (!userDoc.exists) {
            await usersCollection.doc(currentUser).set(currentUserProfile);
        }
        
        const hour = new Date().getHours();
        const timeOfDay = hour < 12 ? 'Good morning' : (hour < 17 ? 'Good afternoon' : 'Good evening');
        document.getElementById('greeting').textContent = `${timeOfDay}, ${currentUserProfile.name} 🤍`;
    } catch (error) {
        console.error('❌ Error loading profile:', error);
    }
}

function updateDynamicLabels() {
    const myName = currentUserProfile.name;
    const partnerName = getPartnerName();
    
    document.getElementById('my-name-label').textContent = myName;
    document.getElementById('partner-name-label').textContent = partnerName;
    document.getElementById('my-contribution-label').textContent = `${myName}'s Contribution`;
    document.getElementById('partner-contribution-label').textContent = `${partnerName}'s Contribution`;
}

async function updateLastSeen() {
    try {
        await usersCollection.doc(currentUser).update({
            lastSeenUs: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        loadPartnerLastSeen();
    } catch (error) {
        console.warn('Could not update last seen:', error);
    }
}

async function loadPartnerLastSeen() {
    try {
        const partnerRole = getPartnerRole();
        const partnerId = Object.keys(USERS).find(id => USERS[id].role === partnerRole);
        
        const partnerDoc = await usersCollection.doc(partnerId).get();
        
        if (partnerDoc.exists && partnerDoc.data().lastSeenUs) {
            const lastSeen = partnerDoc.data().lastSeenUs.toDate();
            const timeAgo = formatTimeAgo(lastSeen);
            
            const element = document.getElementById('partner-last-seen');
            if (element) {
                element.textContent = `${getPartnerName()} was here ${timeAgo}`;
                element.classList.remove('hidden');
            }
        }
    } catch (error) {
        console.warn('Could not load partner last seen:', error);
    }
}

function formatTimeAgo(date) {
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return 'yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
