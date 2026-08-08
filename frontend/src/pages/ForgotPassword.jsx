import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import toast from "react-hot-toast";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/auth/forgot-password", { email });
      toast.success("OTP sent to your email");
      setOtpSent(true);
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 shadow-lg shadow-yellow-100">
            💛
          </div>
          <h1 className="text-2xl font-bold text-gray-800">
            Forgot Password
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Enter your email to receive an OTP
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-8">

          {!otpSent ? (
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Info box */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                <p className="text-yellow-800 text-sm">
                  📧 We will send a 6-digit OTP to your registered
                  email address. OTP expires in 10 minutes.
                </p>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
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
                    className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent bg-gray-50 text-gray-800 placeholder-gray-400 transition text-sm"
                  />
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-white font-bold py-4 rounded-xl transition-all duration-200 shadow-lg shadow-yellow-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Sending OTP...
                  </span>
                ) : (
                  "Send OTP"
                )}
              </button>

            </form>
          ) : (

            /* Success State */
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">
                OTP Sent Successfully
              </h3>
              <p className="text-gray-500 text-sm mb-6">
                Check your email <strong>{email}</strong> for the
                6-digit OTP. It expires in 10 minutes.
              </p>
              <Link
                to="/reset-password"
                state={{ email }}
                className="block w-full bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-white font-bold py-4 rounded-xl transition text-center shadow-lg shadow-yellow-100"
              >
                Enter OTP & Reset Password →
              </Link>
            </div>

          )}

          {/* Back to login */}
          <div className="mt-6 pt-6 border-t border-gray-100 text-center">
            <Link
              to="/login"
              className="text-sm text-gray-500 hover:text-yellow-600 transition font-medium"
            >
              ← Back to Login
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}