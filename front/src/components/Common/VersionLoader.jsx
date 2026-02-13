import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { MdRocketLaunch, MdAirplanemodeActive } from 'react-icons/md';

const VersionLoader = ({ children }) => {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [targetVersion, setTargetVersion] = useState('');

  useEffect(() => {
    // //* [Modified Code] React 18 StrictMode 대응 및 애니메이션 안정성 강화 (v2.83)
    const currentVersion = location.pathname.startsWith('/v2') ? 'V2' : 'V1';
    const lastVersion = sessionStorage.getItem('lastVersion');

    // 1. 초기 진입 시: 버전 정보만 저장하고 애니메이션 없이 종료
    if (!lastVersion) {
      console.log(
        '[VersionLoader] Initial mount, version set to:',
        currentVersion,
      );
      sessionStorage.setItem('lastVersion', currentVersion);
      return;
    }

    // 2. 버전이 실제로 변경된 경우에만 애니메이션 실행
    if (currentVersion !== lastVersion) {
      console.log(
        `[VersionLoader] Transition Triggered: ${lastVersion} -> ${currentVersion}`,
      );
      setTargetVersion(currentVersion);
      setIsLoading(true);

      const timer = setTimeout(() => {
        console.log('[VersionLoader] Transition Completed');
        setIsLoading(false);
        // 애니메이션이 무사히 끝난 후에만 세션스토리지 업데이트 (StrictMode 타이머 캔슬 대응)
        sessionStorage.setItem('lastVersion', currentVersion);
      }, 2500);

      return () => clearTimeout(timer);
    }

    // 3. 버전은 같지만 하위 경로가 바뀐 경우 마지막 버전 정보 유지
    sessionStorage.setItem('lastVersion', currentVersion);
  }, [location.pathname]);

  return (
    <div className="relative w-full h-full">
      {/* Real App Content - 항상 유지하여 언마운트로 인한 상태 초기화 방지 */}
      {children}

      {/* Version Transition Overlay */}
      {isLoading && (
        <div className="fixed inset-0 z-[20000] bg-[#0a0c10]/95 backdrop-blur-3xl flex flex-col items-center justify-center overflow-hidden transition-all duration-500">
          {/* Background Decorative Stars & Nebula */}
          <div className="absolute inset-0 opacity-40 pointer-events-none">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.1)_0%,transparent_70%)]" />
            {[...Array(60)].map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full bg-blue-100 animate-pulse"
                style={{
                  width: Math.random() * 2 + 1 + 'px',
                  height: Math.random() * 2 + 1 + 'px',
                  top: Math.random() * 100 + '%',
                  left: Math.random() * 100 + '%',
                  animationDelay: Math.random() * 5 + 's',
                  opacity: Math.random() * 0.7 + 0.1,
                }}
              />
            ))}
          </div>

          {/* Screen Sweep Scanning Effect */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/10 to-transparent animate-scan pointer-events-none h-20 w-full" />

          {/* Main Content Area */}
          <div className="relative z-10 text-center">
            <div className="mb-10 overflow-hidden">
              {/* //* [Modified Code] 라벨 텍스트 변경: Neural Link -> INTERFACE MIGRATION (v2.68) */}
              <p className="text-blue-400 text-[11px] font-black uppercase tracking-[0.6em] mb-6 animate-tracking-in-expand drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]">
                DASHBOARD INTERFACE MIGRATION
              </p>
              <div className="flex items-center justify-center gap-8">
                <div className="relative group">
                  <span
                    className={`text-7xl font-black italic transition-all duration-700 ${targetVersion === 'V1' ? 'text-blue-500 scale-125 rotate-[-5deg] drop-shadow-[0_0_20px_rgba(59,130,246,0.5)]' : 'text-gray-600 group-hover:text-gray-400'}`}
                  >
                    V1
                  </span>
                  {targetVersion === 'V1' && (
                    <div className="absolute -inset-6 bg-blue-500/10 blur-2xl rounded-full animate-pulse" />
                  )}
                </div>

                <div className="h-[3px] w-32 bg-gray-800 relative overflow-hidden flex items-center rounded-full">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-400 to-transparent animate-progress" />
                  <div className="w-full h-full bg-blue-900/10" />
                </div>

                <div className="relative group">
                  <span
                    className={`text-7xl font-black italic transition-all duration-700 ${targetVersion === 'V2' ? 'text-blue-500 scale-125 rotate-[5deg] drop-shadow-[0_0_20px_rgba(59,130,246,0.5)]' : 'text-gray-600 group-hover:text-gray-400'}`}
                  >
                    V2
                  </span>
                  {targetVersion === 'V2' && (
                    <div className="absolute -inset-6 bg-blue-500/10 blur-2xl rounded-full animate-pulse" />
                  )}
                </div>
              </div>
            </div>
            <div className="flex flex-col items-center gap-2">
              <p className="text-gray-600 font-bold tracking-[0.4em] text-[10px] uppercase">
                System Synchronization in Progress
              </p>
              {/* Fallback Text: 애니메이션이 멈춰있더라도 시스템이 작동 중임을 알림 */}
              <p className="text-blue-500/40 text-[8px] font-bold animate-pulse">
                [ SYSTEM MIGRATING... ]
              </p>
              <div className="flex gap-1">
                <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce" />
              </div>
            </div>
          </div>

          {/* //* [Modified Code] 화면 전체를 크게 아우르는 궤적 애니메이션 강화 (v2.82) */}
          <div
            className={`absolute inset-0 pointer-events-none z-50 ${targetVersion === 'V2' ? 'animate-rocket-cross-v2' : 'animate-plane-cross-v2'}`}
          >
            <div className="relative w-full h-full flex items-center justify-center">
              {targetVersion === 'V2' ? (
                <div className="flex flex-col items-center rotate-[45deg] scale-[1.5] opacity-100">
                  <MdRocketLaunch className="text-blue-400 text-9xl drop-shadow-[0_0_50px_rgba(59,130,246,1)]" />
                  <div className="w-12 h-40 bg-gradient-to-t from-transparent via-orange-500 to-yellow-400 blur-2xl -mt-10 animate-rocket-trail-v2" />
                </div>
              ) : (
                <div className="flex items-center -rotate-[5deg] scale-[1.5] opacity-100">
                  <div className="w-80 h-[4px] bg-gradient-to-r from-transparent via-cyan-300 to-white blur-lg mr-[-50px]" />
                  <MdAirplanemodeActive className="text-white text-9xl drop-shadow-[0_0_40px_rgba(255,255,255,1)]" />
                </div>
              )}
            </div>
          </div>
          {/* //* [Added Code] Skip Transition Button (v2.86) */}
          <button
            onClick={() => {
              const currentVersion = location.pathname.startsWith('/v2')
                ? 'V2'
                : 'V1';
              setIsLoading(false);
              sessionStorage.setItem('lastVersion', currentVersion);
              console.log('[VersionLoader] Transition skipped by user');
            }}
            className="absolute bottom-10 right-10 text-gray-500 hover:text-white text-[10px] font-black uppercase tracking-widest border border-gray-800 px-4 py-2 rounded-full hover:bg-white/5 transition-all z-[60]"
          >
            Skip Transition
          </button>
        </div>
      )}
    </div>
  );
};

export default VersionLoader;
