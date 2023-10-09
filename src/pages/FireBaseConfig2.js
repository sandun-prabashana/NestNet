import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"


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
export const db = getFirestore(app)

