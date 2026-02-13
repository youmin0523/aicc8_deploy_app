import './App_v2.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import HomeV2 from './components/v2/Home_v2';
import CalendarViewV2 from './components/v2/CalendarView_v2';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AppV2 = () => {
  return (
    <BrowserRouter>
      <div className="app-v2-container">
        <Routes>
          <Route path="/v2" element={<HomeV2 />} />
          <Route path="/v2/calendar" element={<CalendarViewV2 />} />
          {/* Default redirect to v2 for testing */}
          <Route path="/" element={<Navigate to="/v2" replace />} />
          {/* Add more V2 routes here (Calendar, Categories, etc.) */}
        </Routes>
        <ToastContainer
          position="bottom-center"
          autoClose={2000}
          theme="dark"
        />
      </div>
    </BrowserRouter>
  );
};

export default AppV2;
