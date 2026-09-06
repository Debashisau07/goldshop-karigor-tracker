import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
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

  const inputStyle = {
    width: "100%",
    background: "transparent",
    border: "none",
    borderBottom: "1px solid #D4C9B0",
    padding: "12px 0",
    fontSize: "14px",
    color: "#1A1A1A",
    outline: "none",
    transition: "border-color 0.3s ease",
    letterSpacing: "0.05em",
  };

  return (
    <div className="min-h-screen flex" style={{ background: "#FAFAF7" }}>

      {/* Left — Decorative panel */}
      <div className="hidden lg:flex lg:w-5/12 flex-col justify-between p-16 relative overflow-hidden"
        style={{ background: "#F2EDE3" }}>

        {/* Subtle grid texture */}
        <div className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: "radial-gradient(circle, #B8960C15 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }} />

        {/* Top */}
        <div className="relative">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-xl" style={{ color: "#B8960C" }}>⚒</span>
            <span className="serif tracking-widest uppercase text-sm"
              style={{ color: "#1A1A1A", letterSpacing: "0.2em" }}>
              Karigor
            </span>
          </div>
          <button
            onClick={() => navigate("/")}
            className="luxury-link text-xs mt-1"
            style={{ color: "#B8960C", letterSpacing: "0.1em" }}>
            ← Back to home
          </button>
        </div>

        {/* Center quote */}
        <div className="relative">
          <div className="h-px w-10 mb-10" style={{ background: "#B8960C" }} />
          <blockquote className="serif mb-6"
            style={{
              fontSize: "1.75rem",
              fontWeight: "400",
              lineHeight: "1.4",
              color: "#1A1A1A",
              fontStyle: "italic",
            }}>
            "Craftsmanship
            <br />
            demands precision.
            <br />
            So does management."
          </blockquote>
          <p className="text-xs tracking-widest uppercase"
            style={{ color: "#B8960C", letterSpacing: "0.2em" }}>
            Gold Karigor Tracker
          </p>
        </div>

        {/* Bottom stats */}
        <div className="relative grid grid-cols-2 gap-8">
          {[
            { value: "100%", label: "Accountability" },
            { value: "0", label: "Paperwork" },
          ].map((s) => (
            <div key={s.label}>
              <p className="serif mb-1"
                style={{
                  fontSize: "2rem",
                  fontWeight: "400",
                  color: "#B8960C",
                  fontStyle: "italic",
                }}>
                {s.value}
              </p>
              <div className="h-px w-6 mb-2" style={{ background: "#B8960C" }} />
              <p className="text-xs tracking-widest uppercase"
                style={{ color: "#6B6560", letterSpacing: "0.15em" }}>
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Right — Login form */}
      <div className="w-full lg:w-7/12 flex items-center justify-center p-8 lg:p-20">
        <div className="w-full max-w-sm">

          {/* Mobile logo */}
          <div className="lg:hidden mb-12 flex items-center gap-3">
            <span className="text-xl" style={{ color: "#B8960C" }}>⚒</span>
            <span className="serif tracking-widest uppercase text-sm"
              style={{ color: "#1A1A1A", letterSpacing: "0.2em" }}>
              Gold Karigor Tracker
            </span>
          </div>

          {/* Header */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px w-6" style={{ background: "#B8960C" }} />
              <span className="text-xs tracking-widest uppercase"
                style={{ color: "#B8960C", letterSpacing: "0.2em" }}>
                Workspace Access
              </span>
            </div>
            <h1 className="serif mb-3"
              style={{
                fontSize: "2.5rem",
                fontWeight: "400",
                color: "#1A1A1A",
                lineHeight: "1.1",
              }}>
              Welcome
              <br />
              <span style={{ fontStyle: "italic" }}>Back.</span>
            </h1>
            <p className="text-sm"
              style={{ color: "#6B6560", fontWeight: "300", letterSpacing: "0.03em" }}>
              Sign in to continue to your workspace
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-10">

            {/* Email */}
            <div>
              <label className="block text-xs tracking-widest uppercase mb-3"
                style={{ color: "#B8960C", letterSpacing: "0.2em" }}>
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                style={inputStyle}
                onFocus={(e) =>
                  (e.target.style.borderBottomColor = "#B8960C")
                }
                onBlur={(e) =>
                  (e.target.style.borderBottomColor = "#D4C9B0")
                }
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-xs tracking-widest uppercase"
                  style={{ color: "#B8960C", letterSpacing: "0.2em" }}>
                  Password
                </label>
                <Link to="/forgot-password"
                  className="luxury-link text-xs"
                  style={{ color: "#6B6560", letterSpacing: "0.05em" }}>
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  style={{ ...inputStyle, paddingRight: "32px" }}
                  onFocus={(e) =>
                    (e.target.style.borderBottomColor = "#B8960C")
                  }
                  onBlur={(e) =>
                    (e.target.style.borderBottomColor = "#D4C9B0")
                  }
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 bottom-3 text-xs"
                  style={{ color: "#B8960C" }}>
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 text-sm tracking-widest uppercase font-medium transition-all duration-300 disabled:opacity-50"
              style={{
                background: "#1A1A1A",
                color: "#FAFAF7",
                letterSpacing: "0.2em",
              }}
              onMouseEnter={(e) => {
                if (!loading)
                  e.currentTarget.style.background = "#B8960C";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#1A1A1A";
              }}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>

          </form>

          {/* Footer */}
          <div className="mt-16 pt-8" style={{ borderTop: "1px solid #E8E4DC" }}>
            <p className="text-xs text-center"
              style={{ color: "#C4BFB8", letterSpacing: "0.1em" }}>
              Gold Karigor Tracker · Secure Workspace
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}