// src/services/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Configuración de tu proyecto Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAuUPbG816hHvtEzv6wA3EgKlGeqR19cM4",
  authDomain: "proyecto-f-web.firebaseapp.com",
  projectId: "proyecto-f-web",
  storageBucket: "proyecto-f-web.appspot.com",
  messagingSenderId: "153777529737",
  appId: "1:153777529737:web:184be3b749fe6608e3b758"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Exporta los servicios que usarás en tu app
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
