// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCV3L7Mr4BGDFvHHHeYUguPB3rQAA_b5n0",
  authDomain: "usual-9c5d4.firebaseapp.com",
  projectId: "usual-9c5d4",
  storageBucket: "usual-9c5d4.firebasestorage.app",
  messagingSenderId: "283117249056",
  appId: "1:283117249056:web:181200adfb4b862aee9245"
};

// User credentials (EXACTLY TWO USERS)
const USERS = {
    'imsusu': {
        pin: '1707',
        name: 'Krishna',
        role: 'me'
    },
    'imgugu': {
        pin: '2203',
        name: 'Rashi',
        role: 'her'
    }
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Enable offline persistence
db.enablePersistence()
    .catch((err) => {
        console.error("Persistence error:", err);
    });

// Collections
const usersCollection = db.collection('users');
const expensesCollection = db.collection('expenses');
const foodMemoriesCollection = db.collection('foodMemories');
