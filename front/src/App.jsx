import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Completed from './components/Completed';
import Important from './components/Important';
import Proceeding from './components/Proceeding';

const App = () => {
  return (
    <BrowserRouter>
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/completed" element={<Completed />} />
          <Route path="/important" element={<Important />} />
          <Route path="/proceeding" element={<Proceeding />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
