// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCV3L7Mr4BGDFvHHHeYUguPB3rQAA_b5n0",
    authDomain: "usual-9c5d4.firebaseapp.com",
    projectId: "usual-9c5d4",
    storageBucket: "usual-9c5d4.firebasestorage.app",
    messagingSenderId: "283117249056",
    appId: "1:283117249056:web:181200adfb4b862aee9245"
};

// Firebase initialization
let db = null;
let usersCollection = null;
let expensesCollection = null;
let memoriesCollection = null;
let notesCollection = null;
let budgetCollection = null;
let momentsCollection = null;
let firebaseInitialized = false;

function initializeFirebase() {
    if (firebaseInitialized) return;
    try {
        firebase.initializeApp(firebaseConfig);
        db = firebase.firestore();
        
        db.enablePersistence({ synchronizeTabs: true })
            .catch((err) => {
                if (err.code === 'failed-precondition') {
                    // Multiple tabs open - persistence can only be enabled in one tab at a time
                    console.warn('Firestore persistence unavailable: multiple tabs open');
                } else if (err.code === 'unimplemented') {
                    // Browser doesn't support persistence
                    console.warn('Firestore persistence not supported in this browser');
                }
            });
        
        usersCollection = db.collection('users');
        expensesCollection = db.collection('expenses');
        memoriesCollection = db.collection('memories');
        notesCollection = db.collection('notes');
        budgetCollection = db.collection('budget');
        momentsCollection = db.collection('moments');
        
        firebaseInitialized = true;
        console.log('✅ Firebase initialized');
    } catch (error) {
        console.error('❌ Firebase error:', error);
    }
}
