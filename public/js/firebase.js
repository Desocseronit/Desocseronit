const firebaseConfig = __FIREBASE_CONFIG__;

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js';
import { 
    getFirestore, doc, updateDoc, onSnapshot, increment, 
    getDoc, setDoc 
} from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const counterRef = doc(db, "counters", "global");

const clickCountSpan = document.querySelector('#clicker span');
const hiButton = document.querySelector('#clicker button');

// Anti-spam protection
let canClick = true;
let sessionClicks = 0;
const MAX_CLICKS_PER_SESSION = 30;
const COOLDOWN_SECONDS = 5;
let cooldownTimer = null;
let originalButtonText = 'HI';

// Disable button function
function disableButton() {
    hiButton.disabled = true;
    hiButton.style.opacity = '0.5';
    hiButton.style.cursor = 'not-allowed';
}

// Enable button function
function enableButton() {
    hiButton.disabled = false;
    hiButton.style.opacity = '1';
    hiButton.style.cursor = 'pointer';
}

// Update session counter display
function updateSessionCounterDisplay() {
    let counterDiv = document.querySelector('#clicker .session-counter');
    if (!counterDiv) {
        counterDiv = document.createElement('div');
        counterDiv.className = 'session-counter';
        counterDiv.style.marginTop = '10px';
        counterDiv.style.fontSize = '12px';
        counterDiv.style.textAlign = 'center';
        counterDiv.style.color = '#fcdbff';
        document.querySelector('#clicker').appendChild(counterDiv);
    }
    
    const remaining = MAX_CLICKS_PER_SESSION - sessionClicks;
    counterDiv.textContent = `Remaining clicks: ${remaining} / ${MAX_CLICKS_PER_SESSION}`;
    
    // Change color when approaching limit
    if (remaining <= 5 && remaining > 0) {
        counterDiv.style.color = '#ffaa66';
    } else if (remaining === 0) {
        counterDiv.style.color = '#ff6b6b';
    } else {
        counterDiv.style.color = '#fcdbff';
    }
}

// Add loader to button
function addLoader() {
    hiButton.innerHTML = '<span class="loader" style="display: inline-block;"></span>';
    hiButton.style.display = 'flex';
    hiButton.style.alignItems = 'center';
    hiButton.style.justifyContent = 'center';
    hiButton.style.gap = '10px';
}

// Remove loader and restore text
function removeLoader() {
    hiButton.innerHTML = originalButtonText;
    hiButton.style.display = 'block';
}

// Start cooldown
function startCooldown() {
    canClick = false;
    disableButton();
    
    let secondsLeft = COOLDOWN_SECONDS;
    
    // Add loader
    addLoader();
    
    cooldownTimer = setInterval(() => {
        secondsLeft--;
        
        if (secondsLeft > 0) {
            hiButton.innerHTML = `<span class="loader" style="display: inline-block;"></span> ${secondsLeft}s`;
            hiButton.style.display = 'flex';
            hiButton.style.alignItems = 'center';
            hiButton.style.justifyContent = 'center';
            hiButton.style.gap = '10px';
        } else {
            // End cooldown
            clearInterval(cooldownTimer);
            cooldownTimer = null;
            canClick = true;
            
            // Check if session limit reached
            if (sessionClicks < MAX_CLICKS_PER_SESSION) {
                removeLoader();
                enableButton();
            } else {
                // If limit reached, button stays in "I'm tired" state
                hiButton.innerHTML = "I'm tired";
                hiButton.style.display = 'block';
            }
        }
    }, 1000);
}

// Listen to Firebase counter changes
onSnapshot(counterRef, (docSnapshot) => {
    if (docSnapshot.exists()) {
        clickCountSpan.innerText = docSnapshot.data().count || 0;
    }
});

// Click handler
hiButton.addEventListener('click', async () => {
    // Check if can click
    if (!canClick) {
        return;
    }
    
    // Check session limit
    if (sessionClicks >= MAX_CLICKS_PER_SESSION) {
        disableButton();
        hiButton.innerHTML = "I'm tired";
        hiButton.style.display = 'block';
        return;
    }
    
    try {
        // Increment counter in Firebase
        await updateDoc(counterRef, {
            count: increment(1)
        });
        
        // Increment session counter
        sessionClicks++;
        updateSessionCounterDisplay();
        
        // Check if limit reached
        if (sessionClicks >= MAX_CLICKS_PER_SESSION) {
            disableButton();
            hiButton.innerHTML = "I'm tired";
            hiButton.style.display = 'block';
            canClick = false;
            
            // Clear timer if exists
            if (cooldownTimer) {
                clearInterval(cooldownTimer);
                cooldownTimer = null;
            }
        } else {
            // Start cooldown
            startCooldown();
        }
        
    } catch (error) {
        console.error("Error:", error);
        removeLoader();
        enableButton();
        canClick = true;
    }
});

// Initialize counter
async function initCounter() {
    const docSnap = await getDoc(counterRef);
    if (!docSnap.exists()) {
        await setDoc(counterRef, { count: 0 });
    }
}

initCounter();
updateSessionCounterDisplay();