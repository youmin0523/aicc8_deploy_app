import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './components/Home';
import Completed from './components/Completed';
import Important from './components/Important';
import Proceeding from './components/Proceeding';

// V2 Components
import HomeV2 from './components/v2/Home_v2';
import CalendarViewV2 from './components/v2/CalendarView_v2';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import './App_v2.css';

// Version Transition Loader
import VersionLoader from './components/Common/VersionLoader';
// Initial Cinematic Loader
import InitialSpaceLoader from './components/Common/InitialSpaceLoader';

const App = () => {
  return (
    <BrowserRouter>
      {/* //* [Modified Code] 시네마틱 인트로 및 로그인 성공 연출 적용 (v2.69) */}
      {/* 초기 진입 시 우주 배경, 로그인 성공 시 지구로 돌진하는 애니메이션 구현 */}
      <VersionLoader>
        <InitialSpaceLoader>
          <div className="app-container">
            <Routes>
              {/* V1 Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/completed" element={<Completed />} />
              <Route path="/important" element={<Important />} />
              <Route path="/proceeding" element={<Proceeding />} />

              {/* V2 Routes */}
              <Route path="/v2" element={<HomeV2 />} />
              <Route path="/v2/calendar" element={<CalendarViewV2 />} />

              {/* Catch-all or Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            <ToastContainer
              position="bottom-center"
              autoClose={2000}
              theme="dark"
            />
          </div>
        </InitialSpaceLoader>
      </VersionLoader>
    </BrowserRouter>
  );
};

export default App;
