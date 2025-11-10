// src/App.jsx
import { BrowserRouter } from "react-router-dom";
import AppRouter from "./routes/AppRouter";
import { AuthProvider } from "./context/AuthContext";
import Header from "./components/Header"; // si tienes header global
import { auth, db, storage } from "./services/firebaseConfig";

console.log("Firebase auth:", auth);
console.log("Firebase firestore (db):", db);
console.log("Firebase storage:", storage);

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Header />
        <div className="pt-16">
          <AppRouter />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
