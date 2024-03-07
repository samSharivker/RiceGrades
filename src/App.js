import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Developers from './pages/Developers';
import ChangeLog from './pages/ChangeLog';
import NoPage from './pages/NoPage';
import Student from './pages/Student';
import Teacher from './pages/Teacher';
import Support from './pages/Support';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route index element={<Home />} />
          <Route path="/developers" element={<Developers />} />
          <Route path="/changelog" element={<ChangeLog />} />
          <Route path="/student" element={<Student />} />
          <Route path="/teacher" element={<Teacher />} />
          <Route path="/support" element={<Support />} />
          <Route path="*" element={<NoPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
