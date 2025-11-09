import React, { useState } from 'react';
import { LogoIcon } from '../icons/LogoIcon';

interface LoginProps {
  onLogin: (email: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      onLogin(email);
      setSubmitted(true);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-900">
      <div className="w-full max-w-md p-8 space-y-8 bg-slate-800 rounded-lg shadow-lg">
        <div className="flex flex-col items-center">
          <LogoIcon className="h-12 w-12 text-teal-400" />
          <h2 className="mt-6 text-3xl font-extrabold text-center text-white">
            Sign in to your account
          </h2>
          <p className="mt-2 text-sm text-center text-slate-400">
            {submitted ? "Check your email for the magic link!" : "Enter your email to receive a magic link."}
          </p>
        </div>
        {!submitted ? (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="email-address" className="sr-only">
                  Email address
                </label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="relative block w-full px-3 py-3 text-white placeholder-slate-500 bg-slate-700 border border-slate-600 rounded-md appearance-none focus:outline-none focus:ring-teal-500 focus:border-teal-500 focus:z-10 sm:text-sm"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="relative flex justify-center w-full px-4 py-3 text-sm font-medium text-white bg-teal-600 border border-transparent rounded-md group hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 focus:ring-offset-slate-900 transition-colors"
              >
                Send Magic Link
              </button>
            </div>
            <p className="mt-4 text-xs text-center text-slate-500">
                This is a simulated login. Any valid email format will work.
            </p>
          </form>
        ) : (
             <div className="text-center p-4 bg-green-900/50 border border-green-700 rounded-md">
                <p className="font-medium text-green-300">Magic link sent!</p>
                <p className="text-sm text-slate-400">Please check your inbox to continue.</p>
             </div>
        )}
      </div>
    </div>
  );
};

export default Login;