import React, { useCallback, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { navMenus } from '../../utils/naviList';
import { FcGoogle } from 'react-icons/fc';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { useDispatch, useSelector } from 'react-redux';
import { login, logout } from '../../redux/slices/authSlice';

//* 개인적으로 정리해볼 것
const Navbar = () => {
  const path = useLocation();
  const isActive = (location) => path.pathname === location;

  const googleClientId = import.meta.env.VITE_AUTH_CLIENT_ID;
  // console.log(googleClientId);

  const dispatch = useDispatch();
  const state = useSelector((state) => state.auth.authData);
  // console.log(state);
  const { name } = state || {};

  //  !: 부정 !!name: name 값이 있는지 엄격히 체크 -> name이 존재하면 true, null이면 false
  const [isAuth, setIsAuth] = useState(!!name);

  const handleLoginSuccess = useCallback(
    (credentialResponse) => {
      console.log(credentialResponse);
      try {
        const decoded = jwtDecode(credentialResponse.credential);
        dispatch(login({ authData: decoded }));
        setIsAuth(true);
        // console.log(decoded);
      } catch (error) {
        console.error('Google Login Error: ', error);
      }
    },
    [dispatch],
  );

  const handleLogoutClick = () => {
    dispatch(logout());
    setIsAuth(false);
  };

  const handleLoginError = (error) => {
    console.log('Google Login Error: ', error);
  };

  return (
    <nav className="bg-[#212121] w-1/5 h-full rounded-sm border border-gray-500 py-10 px-4 flex flex-col justify-between items-center">
      <div className="logo-wrapper flex w-full items-center justify-center gap-8">
        <div className="logo"></div>
        <h2 className="font-semibold text-xl">
          <Link to="/">MARSHALL</Link>
        </h2>
      </div>
      <ul className="menus">
        {navMenus.map((menu, idx) => (
          <li
            key={idx}
            className={`rounded-sm mb-2 border border-gray-700 hover:bg-gray-950 transition-all duration-300 ${isActive(menu.to) ? 'bg-gray-950' : ''}`}
          >
            <Link to={menu.to} className="flex gap-x-4 items-center py-2 px-10">
              {menu.icon} {menu.label}
            </Link>
          </li>
        ))}
      </ul>
      {isAuth ? (
        <div className="auth-button w-4/5 flex items-center">
          <button
            className="flex justify-center items-center gap-2 bg-gray-300 text-gray-900 py-3 px-4 rounded-md w-full"
            onClick={handleLogoutClick}
          >
            <FcGoogle className="w-5 h-5" />
            <span className="text-sm">{name}님 Logout</span>
          </button>
        </div>
      ) : (
        <div className="auth-warpper flex justify-center w-4/5 login-btn">
          <GoogleOAuthProvider clientId={googleClientId}>
            <GoogleLogin
              onSuccess={handleLoginSuccess}
              onError={handleLoginError}
            />
            <button className="flex justify-center items-center gap-2 bg-gray-300 text-gray-500 py-3 px-4 rounded-md w-full">
              <FcGoogle className="w-5 h-5" />
              <span className="text-sm">Google Login</span>
            </button>
          </GoogleOAuthProvider>
        </div>
      )}
      {/* <div className="auth-button w-4/5 flex items-center">
        <button className="flex justify-center items-center gap-2 bg-gray-300 text-gray-900 py-3 px-4 rounded-md w-full">
          <FcGoogle />
          <span className="text-sm">마샬님 로그아웃</span>
        </button>
      </div> */}
      {/* <GoogleOAuthProvider clientId={googleClientId}>
        <h1>Google 로그인 테스트</h1>

        <GoogleLogin
          onSuccess={handleLoginSuccess}
          onError={() => {
            console.log('로그인 실패');
          }}
        />
      </GoogleOAuthProvider> */}
    </nav>
  );
};

export default Navbar;
