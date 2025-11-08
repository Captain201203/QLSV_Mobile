"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Student } from "@/app/types/student";
import { authService, LoginResponse } from "@/app/services/authService";

interface AuthContextType {
  user: LoginResponse | null;
  student: Student | null;
  role: string | null;
  login: (email: string, password: string) => Promise<LoginResponse>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<LoginResponse | null>(null);
  const [student, setStudent] = useState<Student | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load user từ localStorage khi app khởi động
    const savedUser = authService.getCurrentUser();
    if (savedUser) {
      setUser(savedUser);
      // Nếu là student, cũng set student
      if (savedUser.role === 'sinh viên' && savedUser.studentId) {
        setStudent(savedUser as Student);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<LoginResponse> => {
    const response: LoginResponse = await authService.login(email, password);
    setUser(response);
    
    // Lưu vào localStorage
    localStorage.setItem("user", JSON.stringify(response));
    localStorage.setItem("role", response.role);
    localStorage.setItem("email", response.email);
    
    // Nếu là student, lưu thêm thông tin student
    if (response.role === 'sinh viên') {
      setStudent(response as Student);
      localStorage.setItem("student", JSON.stringify(response));
      if (response.studentId) {
        localStorage.setItem("studentId", response.studentId);
      }
      if (response.studentName) {
        localStorage.setItem("studentName", response.studentName);
      }
    }
    
    return response;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setStudent(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        student,
        role: user?.role || null,
        login,
        logout,
        isLoading,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}