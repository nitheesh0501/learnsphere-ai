import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({
    name: 'Rohan Mehta',
    email: 'rohan.mehta@university.edu',
    role: 'student',
    studentCode: 'CSE-2026-018',
    semester: 'Sem 4 • CSE',
    gpa: 3.82
  });

  const [activePortal, setActivePortal] = useState('student'); // 'student' or 'teacher'

  const login = (userData, token) => {
    setUser(userData);
    localStorage.setItem('learnsphere_token', token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('learnsphere_token');
  };

  const switchPortal = (portal) => {
    setActivePortal(portal);
  };

  return (
    <AuthContext.Provider value={{ user, activePortal, login, logout, switchPortal }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
