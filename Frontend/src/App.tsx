import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Homepage from './Homepage';
import Home  from './App1';

export default function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/images" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}