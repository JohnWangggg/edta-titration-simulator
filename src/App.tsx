import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Simulator from '@/pages/Simulator';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Simulator />} />
        <Route path="*" element={<Simulator />} />
      </Routes>
    </Router>
  );
}