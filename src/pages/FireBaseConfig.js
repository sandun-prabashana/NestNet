import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth'


const firebaseConfig = {
  apiKey: "AIzaSyA-3KRTxK0Ubulfvf0g5rPszn8aR1itc74",
  authDomain: "nestnet.firebaseapp.com",
  projectId: "nestnet",
  storageBucket: "nestnet.appspot.com",
  messagingSenderId: "377816150510",
  appId: "1:377816150510:web:a3812687c2fc7d349f1eff",
  databaseURL: "https://nestnet-default-rtdb.asia-southeast1.firebasedatabase.app",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const database = getAuth(app)

