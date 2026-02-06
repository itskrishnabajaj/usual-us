// Firebase configuration (UPDATE THESE VALUES BEFORE USING FIREBASE FEATURES)
const firebaseConfig = {
  apiKey: "AIzaSyCV3L7Mr4BGDFvHHHeYUguPB3rQAA_b5n0",
  authDomain: "usual-9c5d4.firebaseapp.com",
  projectId: "usual-9c5d4",
  storageBucket: "usual-9c5d4.firebasestorage.app",
  messagingSenderId: "283117249056",
  appId: "1:283117249056:web:181200adfb4b862aee9245"
};

// Firebase will be initialized lazily (after login)
let db = null;
let usersCollection = null;
let expensesCollection = null;
let memoriesCollection = null;
let notesCollection = null;
let budgetCollection = null;
let firebaseInitialized = false;

// Initialize Firebase (called after successful login)
function initializeFirebase() {
    if (firebaseInitialized) return;
    
    try {
        firebase.initializeApp(firebaseConfig);
        db = firebase.firestore();
        
        // Enable offline persistence
        db.enablePersistence()
            .catch((err) => {
                console.error("Persistence error:", err);
            });
        
        // Collections
        usersCollection = db.collection('users');
        expensesCollection = db.collection('expenses');
        memoriesCollection = db.collection('memories');
        notesCollection = db.collection('notes');
        budgetCollection = db.collection('budget');
        
        firebaseInitialized = true;
        console.log('Firebase initialized successfully');
    } catch (error) {
        console.error('Firebase initialization error:', error);
        alert('Firebase configuration error. Please update firebase.js with your Firebase credentials.');
    }
}
