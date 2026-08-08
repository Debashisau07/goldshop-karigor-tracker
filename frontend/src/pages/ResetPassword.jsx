import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import api from "../api/axios";
import toast from "react-hot-toast";

export default function ResetPassword() {
  const location = useLocation();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: location.state?.email || "",
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.newPassword !== form.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (form.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      await api.post("/auth/reset-password", {
        email: form.email,
        otp: form.otp,
        newPassword: form.newPassword,
      });
      toast.success("Password reset successfully");
      setSuccess(true);
      setTimeout(() => navigate("/login"), 3000);
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
            Reset Password
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Enter the OTP from your email
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-8">

          {!success ? (
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  required
                  className="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent bg-gray-50 text-gray-800 placeholder-gray-400 transition text-sm"
                />
              </div>

              {/* OTP */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  OTP Code
                </label>
                <input
                  type="text"
                  name="otp"
                  value={form.otp}
                  onChange={handleChange}
                  placeholder="Enter 6-digit OTP"
                  required
                  maxLength={6}
                  className="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent bg-gray-50 text-gray-800 placeholder-gray-400 transition text-sm tracking-widest text-center font-bold text-lg"
                />
                <p className="text-xs text-gray-400 mt-1 text-center">
                  Check your email for the 6-digit code
                </p>
              </div>

              {/* New Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="newPassword"
                    value={form.newPassword}
                    onChange={handleChange}
                    placeholder="Min 6 characters"
                    required
                    className="w-full px-4 pr-12 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent bg-gray-50 text-gray-800 placeholder-gray-400 transition text-sm"
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

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Confirm New Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="Repeat your new password"
                  required
                  className="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent bg-gray-50 text-gray-800 placeholder-gray-400 transition text-sm"
                />
                {/* Password match indicator */}
                {form.confirmPassword && (
                  <p className={`text-xs mt-1 ${form.newPassword === form.confirmPassword ? "text-green-500" : "text-red-400"}`}>
                    {form.newPassword === form.confirmPassword
                      ? "✅ Passwords match"
                      : "❌ Passwords do not match"}
                  </p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-white font-bold py-4 rounded-xl transition-all duration-200 shadow-lg shadow-yellow-100 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Resetting...
                  </span>
                ) : (
                  "Reset Password"
                )}
              </button>

            </form>
          ) : (

            /* Success State */
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">
                Password Reset Successfully
              </h3>
              <p className="text-gray-500 text-sm mb-2">
                Your password has been updated.
              </p>
              <p className="text-gray-400 text-xs">
                Redirecting to login in 3 seconds...
              </p>
            </div>

          )}

          {/* Links */}
          {!success && (
            <div className="mt-6 pt-6 border-t border-gray-100 flex justify-between">
              <Link
                to="/login"
                className="text-sm text-gray-500 hover:text-yellow-600 transition font-medium"
              >
                ← Back to Login
              </Link>
              <Link
                to="/forgot-password"
                className="text-sm text-yellow-600 hover:text-yellow-700 transition font-medium"
              >
                Resend OTP
              </Link>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}