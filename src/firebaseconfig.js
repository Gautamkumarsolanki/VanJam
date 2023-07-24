import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyAhQ7Sbk84OVSKQIL6gNUcZUADVueCVQTw",
  authDomain: "vanjam-d8601.firebaseapp.com",
  projectId: "vanjam-d8601",
  storageBucket: "vanjam-d8601.appspot.com",
  messagingSenderId: "706197546309",
  appId: "1:706197546309:web:d9e312d10fcccf0ea70a2c"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);