import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState({});
  const refs = useRef({});

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting)
            setVisible((p) => ({ ...p, [e.target.id]: true }));
        }),
      { threshold: 0.12 }
    );
    Object.values(refs.current).forEach((el) => el && obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const ref = (id) => (el) => { refs.current[id] = el; };
  const vis = (id) =>
    `transition-all duration-700 ease-out ${
      visible[id] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
    }`;

  const gold = "#B8960C";
  const ivory = "#FAFAF7";
  const near = "#1A1A1A";
  const warm = "#6B6560";
  const div = "#E8E4DC";

  return (
    <div style={{ background: ivory, color: near }}>

      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        style={{
          background: scrolled ? "rgba(250,250,247,0.96)" : "transparent",
          backdropFilter: scrolled ? "blur(16px)" : "none",
          borderBottom: scrolled ? `1px solid ${div}` : "none",
        }}>
        <div className="max-w-6xl mx-auto px-8 sm:px-12 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span style={{ color: gold, fontSize: "18px" }}>⚒</span>
            <span className="serif tracking-widest text-sm font-normal"
              style={{ color: near, letterSpacing: "0.22em", textTransform: "uppercase" }}>
              Karigor
            </span>
          </div>
          <button onClick={() => navigate("/login")}
            className="text-xs font-medium tracking-widest transition-colors duration-200"
            style={{ color: warm, letterSpacing: "0.18em", textTransform: "uppercase" }}
            onMouseEnter={(e) => (e.target.style.color = gold)}
            onMouseLeave={(e) => (e.target.style.color = warm)}>
            Login
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 pt-20 pb-32">

        {/* Eyebrow */}
        <div className="flex items-center justify-center gap-3 mb-10"
          style={{ animation: "fadeUp 0.8s 0.1s ease both" }}>
          <div className="h-px w-8" style={{ background: gold }} />
          <span className="text-xs font-medium tracking-widest"
            style={{ color: gold, letterSpacing: "0.28em", textTransform: "uppercase" }}>
            Gold Workshop Management
          </span>
          <div className="h-px w-8" style={{ background: gold }} />
        </div>

        {/* Heading */}
        <h1 className="serif mb-6 mx-auto"
          style={{
            fontSize: "clamp(3.5rem, 9vw, 8rem)",
            fontWeight: "400",
            lineHeight: "1.03",
            letterSpacing: "-0.025em",
            color: near,
            maxWidth: "900px",
            animation: "fadeUp 0.8s 0.2s ease both",
          }}>
          Every Piece.
          <br />
          <em style={{ color: gold }}>Accounted For.</em>
        </h1>

        {/* Subtext */}
        <p className="mx-auto mb-12 text-base leading-relaxed"
          style={{
            color: warm,
            fontWeight: "300",
            maxWidth: "420px",
            animation: "fadeUp 0.8s 0.3s ease both",
          }}>
          A precision management system for gold workshops.
          Track every karigor work item from issue to return —
          with automated alerts and complete accountability.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6"
          style={{ animation: "fadeUp 0.8s 0.4s ease both" }}>
          <button onClick={() => navigate("/login")}
            className="px-10 py-4 text-sm font-medium tracking-widest transition-all duration-300"
            style={{
              background: near,
              color: ivory,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = gold)}
            onMouseLeave={(e) => (e.currentTarget.style.background = near)}>
            Enter Workspace
          </button>
          <button onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}
            className="text-sm font-medium tracking-widest transition-colors duration-200"
            style={{ color: warm, letterSpacing: "0.15em", textTransform: "uppercase" }}
            onMouseEnter={(e) => (e.target.style.color = gold)}
            onMouseLeave={(e) => (e.target.style.color = warm)}>
            Discover More ↓
          </button>
        </div>

        {/* Scroll line */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          style={{ animation: "fadeUp 0.8s 0.6s ease both" }}>
          <span className="text-xs tracking-widest"
            style={{ color: "#C4BFB8", letterSpacing: "0.2em" }}>Scroll</span>
          <div className="w-px h-10 overflow-hidden" style={{ background: div }}>
            <div className="w-full animate-bounce"
              style={{ height: "50%", background: gold }} />
          </div>
        </div>
      </section>

      {/* DIVIDER */}
      <div className="max-w-6xl mx-auto px-8">
        <div className="h-px" style={{ background: div }} />
      </div>

      {/* STATS */}
      <section id="stats" ref={ref("stats")} className="py-24 px-6">
  <div style={{
    maxWidth: "64rem",
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "40px",
    textAlign: "center",
  }}
  className={vis("stats")}>
          {[
            { value: "100%", label: "Work Accountability" },
            { value: "10AM", label: "Daily Auto Alert" },
            { value: "Zero", label: "Paperwork Required" },
            { value: "Live", label: "Real-Time Dashboard" },
          ].map((s) => (
            <div key={s.label}>
              <p className="serif mb-3"
                style={{ fontSize: "2.25rem", fontWeight: "400", color: gold, fontStyle: "italic" }}>
                {s.value}
              </p>
              <div className="mx-auto mb-3 h-px w-8" style={{ background: gold }} />
              <p className="text-xs font-medium tracking-widest"
                style={{ color: warm, letterSpacing: "0.18em", textTransform: "uppercase" }}>
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* DIVIDER */}
      <div className="max-w-6xl mx-auto px-8">
        <div className="h-px" style={{ background: div }} />
      </div>

      {/* FEATURES */}
      <section id="features" ref={ref("features")} className="py-28 px-6">
        <div className="max-w-6xl mx-auto">

          <div className={`text-center mb-20 ${vis("features")}`}>
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="h-px w-8" style={{ background: gold }} />
              <span className="text-xs tracking-widest font-medium"
                style={{ color: gold, letterSpacing: "0.28em", textTransform: "uppercase" }}>
                Capabilities
              </span>
              <div className="h-px w-8" style={{ background: gold }} />
            </div>
<h2 className="serif"
  style={{
    fontSize: "clamp(2rem, 4vw, 3.25rem)",
    fontWeight: "400",
    color: near,
    maxWidth: "600px",
    margin: "0 auto",
    textAlign: "center",
  }}>
  Precision at Every Step
</h2>
          </div>

          <div className={`grid md:grid-cols-3 gap-px ${vis("features")}`}
            style={{ background: div }}>
            {[
              { n: "01", t: "Work Item Tracking", d: "Issue gold to karigor with full weight documentation. Every gram accounted for from start to finish." },
              { n: "02", t: "Automated Alerts", d: "Daily 10AM email alerts sent automatically to every active manager when items are overdue." },
              { n: "03", t: "Role-Based Access", d: "Admin and Manager roles. Invite-only registration keeps your data protected and controlled." },
              { n: "04", t: "Repair Tracking", d: "Separate tracking for new work and repair items with distinct visibility and status filters." },
              { n: "05", t: "Excel Export", d: "Export all completed records to Excel for archiving, auditing, and record keeping any time." },
              { n: "06", t: "Smart Status System", d: "Auto color-coded status — on time, pending at 2 days, overdue at 4 days. Zero manual work." },
            ].map((f) => (
              <div key={f.n}
                className="p-10 group transition-colors duration-300"
                style={{ background: ivory }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#F5F0E8")}
                onMouseLeave={(e) => (e.currentTarget.style.background = ivory)}>
                <p className="serif text-xs mb-5"
                  style={{ color: "#C4BFB8", fontStyle: "italic" }}>{f.n}</p>
                <div className="h-px w-6 mb-6 transition-all duration-500 group-hover:w-14"
                  style={{ background: gold }} />
                <h3 className="serif mb-4"
                  style={{ fontSize: "1.2rem", fontWeight: "400", color: near }}>
                  {f.t}
                </h3>
                <p className="text-sm leading-relaxed"
                  style={{ color: warm, fontWeight: "300" }}>
                  {f.d}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DIVIDER */}
      <div className="max-w-6xl mx-auto px-8">
        <div className="h-px" style={{ background: div }} />
      </div>

      {/* QUOTE */}
      <section id="quote" ref={ref("quote")} className="py-32 px-6">
        <div className={`max-w-3xl mx-auto text-center ${vis("quote")}`}>
          <span className="serif block mb-6"
            style={{ fontSize: "5rem", color: gold, lineHeight: "1", fontStyle: "italic" }}>
            "
          </span>
          <blockquote className="serif mb-8"
  style={{
    fontSize: "clamp(1.2rem, 2.5vw, 1.6rem)",
    fontWeight: "400",
    lineHeight: "1.65",
    color: near,
    fontStyle: "italic",
    maxWidth: "680px",
    margin: "0 auto 2rem auto",
    textAlign: "center",
  }}>
            A gold workshop runs on trust and precision.
            Every gram given must be a gram returned.
            This system makes that promise enforceable.
          </blockquote>
          <div style={{
  height: "1px", width: "40px",
  background: gold,
  margin: "0 auto 20px auto",
}} />
          <p style={{
  fontSize: "11px",
  fontWeight: "600",
  letterSpacing: "0.2em",
  textTransform: "uppercase",
  color: warm,
  textAlign: "center",
}}>
  Built for Gold Businesses That Value Accountability
</p>
        </div>
      </section>

      {/* DIVIDER */}
      <div className="max-w-6xl mx-auto px-8">
        <div className="h-px" style={{ background: div }} />
      </div>

      {/* CTA */}
      <section id="cta" ref={ref("cta")} className="py-32 px-6">
        <div className={`max-w-xl mx-auto text-center ${vis("cta")}`}>
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="h-px w-8" style={{ background: gold }} />
            <span className="text-xs tracking-widest font-medium"
              style={{ color: gold, letterSpacing: "0.28em", textTransform: "uppercase" }}>
              Access
            </span>
            <div className="h-px w-8" style={{ background: gold }} />
          </div>
          <h2 className="serif mb-6"
  style={{
    fontSize: "clamp(2rem, 4vw, 3rem)",
    fontWeight: "400",
    color: near,
    textAlign: "center",
  }}>
  Ready to Begin?
</h2>
          <p style={{
  color: warm,
  fontWeight: "300",
  maxWidth: "380px",
  margin: "0 auto 48px auto",
  textAlign: "center",
  fontSize: "15px",
  lineHeight: "1.7",
}}>
            Access is by invitation only.
            Sign in below if you have been invited
            by your administrator.
          </p>
          <button onClick={() => navigate("/login")}
            className="px-14 py-5 text-sm font-medium tracking-widest transition-all duration-300"
            style={{
              background: near,
              color: ivory,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = gold)}
            onMouseLeave={(e) => (e.currentTarget.style.background = near)}>
            Enter Workspace
          </button>
          <p className="mt-6 text-xs tracking-widest"
            style={{ color: "#C4BFB8", letterSpacing: "0.15em" }}>
            Invitation required · Secure access
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-10 px-8" style={{ borderTop: `1px solid ${div}` }}>
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <span style={{ color: gold }}>⚒</span>
            <span className="serif text-sm tracking-widest"
              style={{ color: warm, letterSpacing: "0.2em", textTransform: "uppercase" }}>
              Gold Karigor Tracker
            </span>
          </div>
          <p className="text-xs" style={{ color: "#C4BFB8", letterSpacing: "0.1em" }}>
            © 2025 · Built with precision · All rights reserved
          </p>
        </div>
      </footer>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .serif { font-family: Georgia, 'Times New Roman', serif; }
      `}</style>
    </div>
  );
}