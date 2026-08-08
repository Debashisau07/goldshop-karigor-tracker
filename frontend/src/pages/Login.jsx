import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await login(email, password);
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex">

      {/* Left Side — Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-yellow-400 via-yellow-500 to-amber-600 flex-col justify-between p-12">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-xl">
              💛
            </div>
            <span className="text-white font-bold text-xl">
              Gold Karigor Tracker
            </span>
          </div>
        </div>

        <div>
          <h1 className="text-5xl font-bold text-white leading-tight mb-6">
            Manage Your
            <br />
            Gold Workshop
            <br />
            <span className="text-yellow-100">Effortlessly</span>
          </h1>
          <p className="text-yellow-100 text-lg leading-relaxed">
            Track karigor work items, monitor delivery status,
            and get automatic alerts for overdue tasks.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {[
            { number: "100%", label: "Accurate Tracking" },
            { number: "10AM", label: "Daily Alerts" },
            { number: "Excel", label: "Easy Export" },
          ].map((item) => (
            <div
              key={item.label}
              className="bg-white bg-opacity-20 rounded-2xl p-4 text-center"
            >
              <p className="text-white font-bold text-xl">{item.number}</p>
              <p className="text-yellow-100 text-xs mt-1">{item.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right Side — Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">

          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="w-16 h-16 bg-yellow-500 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-3">
              💛
            </div>
            <h1 className="text-2xl font-bold text-gray-800">
              Gold Karigor Tracker
            </h1>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-3xl shadow-xl p-8">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-800">
                Welcome back
              </h2>
              <p className="text-gray-500 mt-2">
                Sign in to your account to continue
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent bg-gray-50 text-gray-800 placeholder-gray-400 transition"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full pl-12 pr-12 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent bg-gray-50 text-gray-800 placeholder-gray-400 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
              {/* Forgot Password Link */}
<div className="text-right">
  <Link
    to="/forgot-password"
    className="text-sm text-yellow-600 hover:text-yellow-700 font-medium transition"
  >
    Forgot password?
  </Link>
</div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-white font-bold py-4 rounded-xl transition-all duration-200 shadow-lg shadow-yellow-200 hover:shadow-yellow-300 disabled:opacity-50 disabled:cursor-not-allowed text-lg mt-2"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  "Sign In"
                )}
              </button>

            </form>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-gray-100 text-center">
              <p className="text-xs text-gray-400">
                Gold Karigor Tracker • Secure Management System
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}