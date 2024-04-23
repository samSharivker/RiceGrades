import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect, useState } from "react";
import { auth } from ".//firebase";
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js'


import Home from './pages/Home';
import Developers from './pages/Developers';
import ChangeLog from './pages/ChangeLog';
import NoPage from './pages/NoPage';
import Student from './pages/Student';
import Teacher from './pages/Teacher';
import Support from './pages/Support';
import Login from './pages/Login';
import { ProtectedRoute } from "./components/protectedRoute";

function App() {

  const [user, setUser] = useState(null);
  const [isFetching, setIsFetching] = useState(true);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        setIsFetching(false);
        return;
      }

      setUser(null);
      setIsFetching(false);
    });
    return () => unsubscribe();
  }, []);

  if (isFetching) {
    return <h2>Loading...</h2>;
  }
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route index element={<Home />} />
          <Route path="/developers" element={<Developers />} />
          <Route path="/changelog" element={<ChangeLog />} />
          <Route path="/student" element={<ProtectedRoute user={user}><Student /></ProtectedRoute>} />
          <Route path="/teacher" element={<ProtectedRoute user={user}><Teacher /></ProtectedRoute>} />
          <Route path="/support" element={<Support />} />
          <Route path="/login" element={<Login user={user}/>} />
          <Route path="*" element={<NoPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
