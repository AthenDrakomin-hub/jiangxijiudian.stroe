import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { User } from '../types';

interface AuthGuardProps {
  children: React.ReactNode;
  currentUser: User | null;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children, currentUser }) => {
  const location = useLocation();

  // 如果没有用户信息，重定向到登录页
  if (!currentUser) {
    // 保存当前路径，登录后可以重定向回来
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 用户已登录，渲染子组件
  return <>{children}</>;
};

export default AuthGuard;