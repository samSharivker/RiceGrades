// Import the functions you need from the SDKs you need
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js";
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAmxbM9wW6RtgSO-MPUGYVTpI1KeukpMz0",
  authDomain: "rice-grades.firebaseapp.com",
  projectId: "rice-grades",
  storageBucket: "rice-grades.appspot.com",
  messagingSenderId: "944015683449",
  appId: "1:944015683449:web:3779c89a3196ca590449a8",
  measurementId: "G-00PRWQ4SWQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { app };

const auth = getAuth(app)
auth.useDeviceLanguage();
export { auth };
