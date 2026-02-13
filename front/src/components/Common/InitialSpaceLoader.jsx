import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

const InitialSpaceLoader = ({ children }) => {
  const [loadingStep, setLoadingStep] = useState('initial'); // 'initial', 'fading', 'none', 'login-success', 'done'
  const auth = useSelector((state) => state.auth.authData);
  const [hasShownIntro, setHasShownIntro] = useState(false);

  useEffect(() => {
    // //* [Modified Code] 로그인하지 않은 경우 매 새로고침마다 인트로 노출 (v2.72)
    // 로그인된 상태이면서 세션 기록이 있을 때만 인트로를 스킵함
    const visited = sessionStorage.getItem('hasVisitedSpace');
    if (visited && auth) {
      setLoadingStep('none');
      setHasShownIntro(true);
      return;
    }

    // 인트로 시퀀스 시작
    console.log('[InitialSpaceLoader] Sequence started');
    setLoadingStep('initial');

    const timer = setTimeout(() => {
      setLoadingStep('fading');
      setTimeout(() => {
        console.log('[InitialSpaceLoader] Intro finished');
        setLoadingStep('none');
        setHasShownIntro(true);
        // //* [Modified Code] 로그인된 상태에서만 세션 기록을 남겨 중복 노출 방지 (v2.72)
        if (auth) {
          sessionStorage.setItem('hasVisitedSpace', 'true');
        }
      }, 800);
    }, 2500);

    return () => clearTimeout(timer);
  }, [auth]); // auth 상태 변화에 따라 조건부 재실행 가능하도록 의존성 추가

  useEffect(() => {
    // //* [Modified Code] 로그인 성공 시 시네마틱 줌인 연출 트리거 (v2.71)
    if (hasShownIntro && auth && loadingStep === 'none') {
      setLoadingStep('login-success');
      setTimeout(() => {
        setLoadingStep('done');
      }, 2500);
    }
  }, [auth, hasShownIntro]);

  const handleSkip = () => {
    setLoadingStep('none');
    setHasShownIntro(true);
    sessionStorage.setItem('hasVisitedSpace', 'true');
  };

  return (
    <div className="relative w-full h-full">
      {/* Real App Content (Always mounted to prevent loading issues) */}
      <div
        className={`w-full h-full transition-all duration-1000 ${
          loadingStep === 'initial' || loadingStep === 'login-success'
            ? 'blur-md opacity-50 scale-95'
            : 'blur-0 opacity-100 scale-100'
        }`}
      >
        {children}
      </div>

      {/* Cinematic Space Overlay */}
      {loadingStep !== 'none' && loadingStep !== 'done' && (
        <div
          className={`fixed inset-0 z-[10000] bg-black/95 backdrop-blur-3xl flex items-center justify-center overflow-hidden transition-opacity duration-700
            ${loadingStep === 'fading' ? 'opacity-0' : 'opacity-100'}
          `}
        >
          {/* Space Background */}
          <div className="absolute inset-0">
            {[...Array(80)].map((_, i) => (
              <div
                key={i}
                className={`absolute rounded-full bg-white opacity-40 ${loadingStep === 'login-success' ? 'animate-star-streak' : 'animate-pulse'}`}
                style={{
                  width: Math.random() * 2 + 1 + 'px',
                  height: Math.random() * 2 + 1 + 'px',
                  top: Math.random() * 100 + '%',
                  left: Math.random() * 100 + '%',
                  animationDelay: Math.random() * 5 + 's',
                }}
              />
            ))}
          </div>

          {/* Earth Container */}
          <div
            className={`relative transition-all duration-[2500ms] ease-in-out transform
            ${loadingStep === 'initial' ? 'scale-100 opacity-100' : 'scale-[15] opacity-0 blur-2xl'}
          `}
          >
            {/* Earth CSS Art */}
            <div className="w-64 h-64 rounded-full relative shadow-[0_0_100px_rgba(34,197,94,0.2)] overflow-hidden animate-earth-rotate">
              <div className="absolute inset-0 bg-blue-700" />
              <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_30%_30%,#fff_0%,transparent_60%),radial-gradient(circle_at_70%_60%,#22c55e_0%,transparent_50%)]" />
              <div className="absolute inset-0 bg-gradient-to-tr from-black/60 via-transparent to-transparent" />
              <div className="absolute inset-0 border-[8px] border-blue-400/10 blur-[2px] rounded-full" />
            </div>

            {/* Cinematic Text */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-12 text-center w-max">
              {loadingStep !== 'login-success' ? (
                <div className="animate-fade-in-up">
                  <h1 className="text-4xl font-black italic tracking-[0.2em] text-white mb-2">
                    WELCOME TO YOUMINSU
                  </h1>
                  <p className="text-blue-500/60 font-bold tracking-[0.4em] text-[10px] uppercase">
                    Initializing Core Interface...
                  </p>
                </div>
              ) : (
                <div className="animate-zoom-text">
                  <h1 className="text-6xl font-black italic text-blue-500">
                    ACCESS GRANTED
                  </h1>
                </div>
              )}
            </div>
          </div>

          {/* User Control: Skip Button */}
          {loadingStep === 'initial' && (
            <button
              onClick={handleSkip}
              className="absolute bottom-10 right-10 text-gray-500 hover:text-white text-[10px] font-black uppercase tracking-widest border border-gray-800 px-4 py-2 rounded-full hover:bg-white/5 transition-all"
            >
              Skip Intro
            </button>
          )}

          {/* Light Flash Effect */}
          {loadingStep === 'login-success' && (
            <div className="absolute inset-0 bg-white animate-flash-entry z-[10001] pointer-events-none" />
          )}
        </div>
      )}
    </div>
  );
};

export default InitialSpaceLoader;
