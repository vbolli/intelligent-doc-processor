import React, { useState, useCallback } from 'react';
import Login from './components/auth/Login';
import DocumentProcessor from './components/processor/DocumentProcessor';

const App: React.FC = () => {
  const [user, setUser] = useState<{ email: string } | null>(null);

  const handleLogin = useCallback((email: string) => {
    // In a real application, this would trigger a magic link flow.
    // Here, we'll just simulate a successful login.
    console.log(`Simulating magic link for ${email}`);
    setUser({ email });
  }, []);

  const handleLogout = useCallback(() => {
    setUser(null);
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans">
      {!user ? (
        <Login onLogin={handleLogin} />
      ) : (
        <DocumentProcessor user={user} onLogout={handleLogout} />
      )}
    </div>
  );
};

export default App;