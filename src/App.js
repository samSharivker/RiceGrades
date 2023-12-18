import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Developers from './pages/Developers';
import Contact from './pages/Contact';
import ChangeLog from './pages/ChangeLog';
import NoPage from './pages/NoPage';
import Student from './pages/Student';
import Teacher from './pages/Teacher';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route index element={<Home />} />
          <Route path="/developers" element={<Developers />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/changelog" element={<ChangeLog />} />
          <Route path="/Student" element={<Student />} />
          <Route path="/Teacher" element={<Teacher />} />
          <Route path="*" element={<NoPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;