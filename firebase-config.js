// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDbeNfctdy-XRUu2jd2d3Z3eH60KP-0Mck",
  authDomain: "cr3cka-security.firebaseapp.com",
  projectId: "cr3cka-security",
  storageBucket: "cr3cka-security.firebasestorage.app",
  messagingSenderId: "93880482057",
  appId: "1:93880482057:web:1e0615e010d5cc5d92fbd8",
  measurementId: "G-B5GBVJ8V0N"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
