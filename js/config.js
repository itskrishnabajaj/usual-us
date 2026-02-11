// ============================================
// Configuration Constants
// ============================================

// Cloudinary configuration
const CLOUDINARY_CLOUD_NAME = 'ddyj2njes';
const CLOUDINARY_UPLOAD_PRESET = 'usual_us';
const CLOUDINARY_FOLDER = 'usual-us/memories';
const CLOUDINARY_API_KEY = '544188769782152';
const CLOUDINARY_API_SECRET = 'E9PKGWlJ5UqruAWco46agySKFm8';

// User credentials
const USERS = {
    'imsusu': { pin: '2801', name: 'Susu', role: 'krishna' },
    'imgugu': { pin: '0804', name: 'Gugu', role: 'rashi' }
};

// Relationship start date
const RELATIONSHIP_START = new Date('2025-01-28');

// Music playlist - All 15 songs
const PLAYLIST = [
    { title: "Perfect - Ed Sheeran", url: "https://res.cloudinary.com/ddyj2njes/video/upload/v1770391575/Perfect_-_Ed_Sheeran_nqryux.m4a" },
    { title: "It's You - Ali Gatie", url: "https://res.cloudinary.com/ddyj2njes/video/upload/v1770391588/It_s_You_-_Ali_Gatie_2_aku2kh.m4a" },
    { title: "You are the Reason - Calum Scott", url: "https://res.cloudinary.com/ddyj2njes/video/upload/v1770391602/You_Are_The_Reason_-_Calum_Scott_vzelqf.m4a" },
    { title: "Raabta", url: "https://res.cloudinary.com/ddyj2njes/video/upload/v1770391583/Raabta_helsab.m4a" },
    { title: "Mere liye tum kaafi ho", url: "https://res.cloudinary.com/ddyj2njes/video/upload/v1770391581/Mere_liye_tum_kaafi_ho_rvgggr.m4a" },
    { title: "All of Me - John Legend", url: "https://res.cloudinary.com/ddyj2njes/video/upload/v1770391581/All_of_Me_-_John_Legend_mjr400.m4a" },
    { title: "Until I Found You - Stephen Sanchez", url: "https://res.cloudinary.com/ddyj2njes/video/upload/v1770391597/Until_I_Found_You_-_Stephen_Sanchez_ktkenw.m4a" },
    { title: "Tum ho", url: "https://res.cloudinary.com/ddyj2njes/video/upload/v1770391601/Tum_ho_kgv3rb.m4a" },
    { title: "Chaandaniya", url: "https://res.cloudinary.com/ddyj2njes/video/upload/v1770391582/Chaandaniya_eqf5vo.m4a" },
    { title: "Saibo Lofi Flip - VIBIE", url: "https://res.cloudinary.com/ddyj2njes/video/upload/v1770391588/Saibo_Lofi_Flip_-_VIBIE_ftit8a.m4a" },
    { title: "Tum se hi", url: "https://res.cloudinary.com/ddyj2njes/video/upload/v1770391595/Tum_se_hi_cbobgn.m4a" },
    { title: "Say You Won't Let Go - James Arthur", url: "https://res.cloudinary.com/ddyj2njes/video/upload/v1770391597/Say_You_Won_t_Let_Go_-_James_Arthur_e19y4j.m4a" },
    { title: "Yellow - Coldplay", url: "https://res.cloudinary.com/ddyj2njes/video/upload/v1770391601/Yellow_-_Coldplay_b9mxit.m4a" },
    { title: "Tera mujhse hai pehle ka naata koi", url: "https://res.cloudinary.com/ddyj2njes/video/upload/v1770391604/Tera_mujhse_hai_pehle_ka_naata_koi_c0stlt.m4a" },
    { title: "Bloom - The Paper Kites", url: "https://res.cloudinary.com/ddyj2njes/video/upload/v1770391584/Bloom_Bonus_Track_-_The_Paper_Kites_fyfkli.m4a" }
];

// Daily romantic quotes (60 total)
const DAILY_QUOTES = [
    "Still my favorite person.", "No matter the balance, I choose you.", "Today felt warmer because of you.",
    "You make the ordinary feel magical.", "Thank you for being you.", "Every day with you is my favorite day.",
    "You're the reason I smile more.", "Home is wherever you are.", "You make everything better.",
    "I'm grateful for us.", "You're my safe place.", "I love the way we are together.",
    "You make my heart feel full.", "Being with you feels right.", "You're my person.",
    "I choose us, every single day.", "You make life sweeter.", "Thank you for loving me.",
    "You're the best part of my days.", "I love our little world.", "You make me want to be better.",
    "Every moment with you matters.", "You're my favorite hello and hardest goodbye.", "I'm so lucky it's you.",
    "You feel like home.", "You're my calm in the chaos.", "I love how we fit together.",
    "You make everything feel possible.", "Thank you for choosing me too.", "You're my greatest adventure.",
    "I love the us we've become.", "You make my world brighter.", "Every day, I fall a little more.",
    "You're exactly what I needed.", "I love our story.", "You make me believe in forever.",
    "You're my favorite feeling.", "I'm proud to be yours.", "You make life beautiful.",
    "Thank you for being patient with me.", "You're my comfort and my joy.", "I love the little things we share.",
    "You make ordinary days special.", "You're my happy place.", "I'm better because of you.",
    "You're the one I want forever.", "Every day with you is a gift.", "You make me feel understood.",
    "I love how you see me.", "You're my favorite person to do nothing with.", "Thank you for being my constant.",
    "You make everything worthwhile.", "I love the way you love me.", "You're my peace.",
    "I'm grateful for every moment.", "You make me laugh the most.", "You're my best decision.",
    "I love growing with you.", "You're my yesterday, today, and tomorrow.", "Thank you for making life sweeter."
];

// Category emojis
const categoryEmojis = {
    food: '🍕',
    dates: '🎬',
    gmasti: '☺️',
    gifts: '🎁',
    home: '🏠',
    regret: '😭',
    misc: '✨'
};

// Mood emojis
const moodEmojis = {
    happy: '😊',
    love: '😍',
    neutral: '😐',
    sad: '😔',
    sleepy: '😴'
};
