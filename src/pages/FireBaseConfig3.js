import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyA-3KRTxK0Ubulfvf0g5rPszn8aR1itc74",
  authDomain: "nestnet.firebaseapp.com",
  projectId: "nestnet",
  storageBucket: "nestnet.appspot.com",
  messagingSenderId: "377816150510",
  appId: "1:377816150510:web:a3812687c2fc7d349f1eff",
  databaseURL: "https://nestnet-default-rtdb.asia-southeast1.firebasedatabase.app",
};

const app = initializeApp(firebaseConfig);

// Export Firestore database
export const db = getFirestore(app);

// Export Firebase storage
export const storage = getStorage(app);


