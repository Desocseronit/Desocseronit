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


onSnapshot(counterRef, (docSnapshot) => {
    if (docSnapshot.exists()) {
        clickCountSpan.innerText = docSnapshot.data().count || 0;
    }
});


hiButton.addEventListener('click', async () => {
    try {
        await updateDoc(counterRef, {
            count: increment(1)
        });
    } catch (error) {
        console.error("Ошибка:", error);
    }
});


async function initCounter() {
    const docSnap = await getDoc(counterRef);
    if (!docSnap.exists()) {
        await setDoc(counterRef, { count: 0 });
    }
}
initCounter();