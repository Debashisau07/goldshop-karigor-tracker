import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState({});
  const sectionRefs = useRef({});

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible((prev) => ({
              ...prev,
              [entry.target.id]: true,
            }));
          }
        });
      },
      { threshold: 0.15 }
    );
    Object.values(sectionRefs.current).forEach((el) => {
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const setRef = (id) => (el) => {
    sectionRefs.current[id] = el;
  };

  const fadeClass = (id) =>
    visible[id]
      ? "opacity-100 translate-y-0 transition-all duration-700 ease-out"
      : "opacity-0 translate-y-8";

  return (
    <div style={{ background: "#FAFAF7", color: "#1A1A1A" }}
      className="min-h-screen">

      {/* ── NAVBAR ── */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        style={{
          background: scrolled ? "rgba(250,250,247,0.95)" : "transparent",
          backdropFilter: scrolled ? "blur(12px)" : "none",
          borderBottom: scrolled ? "1px solid #E8E4DC" : "none",
        }}
      >
        <div className="max-w-6xl mx-auto px-8 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xl" style={{ color: "#B8960C" }}>⚒</span>
            <span className="serif text-lg font-normal tracking-widest uppercase"
              style={{ color: "#1A1A1A", letterSpacing: "0.2em" }}>
              Karigor
            </span>
          </div>
          <button
            onClick={() => navigate("/login")}
            className="luxury-link text-sm tracking-widest uppercase font-medium"
            style={{ color: "#6B6560", letterSpacing: "0.15em" }}
            onMouseEnter={(e) => e.target.style.color = "#B8960C"}
            onMouseLeave={(e) => e.target.style.color = "#6B6560"}
          >
            Enter
          </button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="min-h-screen flex flex-col items-center justify-center text-center px-6 pt-24 pb-20">

        {/* Eyebrow */}
        <div className="fade-up fade-up-delay-1 flex items-center gap-3 mb-10">
          <div className="h-px w-8" style={{ background: "#B8960C" }} />
          <span className="text-xs tracking-widest uppercase font-medium"
            style={{ color: "#B8960C", letterSpacing: "0.25em" }}>
            Gold Workshop Management
          </span>
          <div className="h-px w-8" style={{ background: "#B8960C" }} />
        </div>

        {/* Main heading */}
        <h1 className="serif fade-up fade-up-delay-2 mb-6"
          style={{
            fontSize: "clamp(3rem, 8vw, 7rem)",
            fontWeight: "400",
            lineHeight: "1.05",
            letterSpacing: "-0.02em",
            color: "#1A1A1A",
          }}>
          Every Piece.
          <br />
          <span style={{ color: "#B8960C", fontStyle: "italic" }}>
            Accounted For.
          </span>
        </h1>

        {/* Subtext */}
        <p className="fade-up fade-up-delay-3 max-w-md mx-auto text-base leading-relaxed mb-12"
          style={{ color: "#6B6560", fontWeight: "300" }}>
          A precision management system built for gold workshops.
          Track every karigor work item from issue to return —
          with automated alerts and complete accountability.
        </p>

        {/* CTA */}
        <div className="fade-up fade-up-delay-4 flex flex-col sm:flex-row items-center gap-6">
          <button
            onClick={() => navigate("/login")}
            className="group px-10 py-4 text-sm tracking-widest uppercase font-medium transition-all duration-300"
            style={{
              background: "#1A1A1A",
              color: "#FAFAF7",
              letterSpacing: "0.2em",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#B8960C";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#1A1A1A";
            }}
          >
            Enter Workspace
          </button>
          <button
            onClick={() => {
              document.getElementById("features")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
            className="luxury-link text-sm tracking-widest uppercase font-medium"
            style={{ color: "#6B6560", letterSpacing: "0.15em" }}
          >
            Discover More
          </button>
        </div>

        {/* Scroll indicator */}
        <div className="fade-up fade-up-delay-5 absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <span className="text-xs tracking-widest uppercase"
            style={{ color: "#C4BFB8", letterSpacing: "0.2em" }}>
            Scroll
          </span>
          <div className="w-px h-12 overflow-hidden" style={{ background: "#E8E4DC" }}>
            <div className="w-full h-1/2 animate-bounce"
              style={{ background: "#B8960C" }} />
          </div>
        </div>
      </section>

      {/* ── THIN GOLD DIVIDER ── */}
      <div className="max-w-6xl mx-auto px-8">
        <div className="h-px" style={{ background: "#E8E4DC" }} />
      </div>

      {/* ── STATS ── */}
      <section
        id="stats"
        ref={setRef("stats")}
        className="py-24 px-6"
      >
        <div className={`max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12 ${fadeClass("stats")}`}>
          {[
            { value: "100%", label: "Work Accountability" },
            { value: "10AM", label: "Daily Automated Alert" },
            { value: "Zero", label: "Paperwork Required" },
            { value: "Live", label: "Real-Time Dashboard" },
          ].map((s, i) => (
            <div key={i} className="text-center">
              <p className="serif mb-3"
                style={{
                  fontSize: "2.5rem",
                  fontWeight: "400",
                  color: "#B8960C",
                  fontStyle: "italic",
                }}>
                {s.value}
              </p>
              <div className="gold-line mb-3" />
              <p className="text-xs tracking-widest uppercase"
                style={{ color: "#6B6560", letterSpacing: "0.15em" }}>
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── THIN GOLD DIVIDER ── */}
      <div className="max-w-6xl mx-auto px-8">
        <div className="h-px" style={{ background: "#E8E4DC" }} />
      </div>

      {/* ── FEATURES ── */}
      <section
        id="features"
        ref={setRef("features")}
        className="py-28 px-6"
      >
        <div className="max-w-6xl mx-auto">

          {/* Section label */}
          <div className={`text-center mb-20 ${fadeClass("features")}`}>
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="h-px w-8" style={{ background: "#B8960C" }} />
              <span className="text-xs tracking-widest uppercase"
                style={{ color: "#B8960C", letterSpacing: "0.25em" }}>
                Capabilities
              </span>
              <div className="h-px w-8" style={{ background: "#B8960C" }} />
            </div>
            <h2 className="serif"
              style={{
                fontSize: "clamp(2rem, 4vw, 3.5rem)",
                fontWeight: "400",
                lineHeight: "1.1",
                color: "#1A1A1A",
              }}>
              Precision at Every Step
            </h2>
          </div>

          {/* Features grid */}
          <div className="grid md:grid-cols-3 gap-px"
            style={{ background: "#E8E4DC" }}>
            {[
              {
                number: "01",
                title: "Work Item Tracking",
                desc: "Issue gold to karigor with full weight documentation. Every gram accounted for from start to finish.",
              },
              {
                number: "02",
                title: "Automated Alerts",
                desc: "Daily 10AM email alerts sent automatically to all active managers when items are overdue.",
              },
              {
                number: "03",
                title: "Role-Based Access",
                desc: "Admin and Manager roles with invite-only registration. Your data stays protected and controlled.",
              },
              {
                number: "04",
                title: "Repair Tracking",
                desc: "Separate tracking for new work and repair items with distinct status visibility.",
              },
              {
                number: "05",
                title: "Excel Export",
                desc: "Export all completed records to Excel for archiving, auditing, and record keeping.",
              },
              {
                number: "06",
                title: "Smart Status System",
                desc: "Automatic color coding — on time, pending at 2 days, overdue at 4 days. No manual updates needed.",
              },
            ].map((f, i) => (
              <div
                key={i}
                className="p-10 transition-all duration-300 group"
                style={{ background: "#FAFAF7" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "#F5F0E8")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "#FAFAF7")
                }
              >
                <p className="serif text-xs mb-6"
                  style={{ color: "#C4BFB8", fontStyle: "italic" }}>
                  {f.number}
                </p>
                <div className="h-px w-6 mb-6 transition-all duration-300 group-hover:w-12"
                  style={{ background: "#B8960C" }} />
                <h3 className="serif mb-4"
                  style={{
                    fontSize: "1.25rem",
                    fontWeight: "400",
                    color: "#1A1A1A",
                  }}>
                  {f.title}
                </h3>
                <p className="text-sm leading-relaxed"
                  style={{ color: "#6B6560", fontWeight: "300" }}>
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── THIN GOLD DIVIDER ── */}
      <div className="max-w-6xl mx-auto px-8">
        <div className="h-px" style={{ background: "#E8E4DC" }} />
      </div>

      {/* ── TESTIMONIAL / QUOTE ── */}
      <section
        id="quote"
        ref={setRef("quote")}
        className="py-32 px-6"
      >
        <div className={`max-w-3xl mx-auto text-center ${fadeClass("quote")}`}>
          <span className="serif block mb-8"
            style={{
              fontSize: "4rem",
              color: "#B8960C",
              lineHeight: "1",
              fontStyle: "italic",
            }}>
            "
          </span>
          <blockquote className="serif mb-8"
            style={{
              fontSize: "clamp(1.25rem, 2.5vw, 1.75rem)",
              fontWeight: "400",
              lineHeight: "1.6",
              color: "#1A1A1A",
              fontStyle: "italic",
            }}>
            A gold workshop runs on trust and precision.
            Every gram given must be a gram returned.
            This system makes that promise enforceable.
          </blockquote>
          <div className="gold-line mb-4" />
          <p className="text-xs tracking-widest uppercase"
            style={{ color: "#6B6560", letterSpacing: "0.2em" }}>
            Built for Gold Businesses That Value Accountability
          </p>
        </div>
      </section>

      {/* ── THIN GOLD DIVIDER ── */}
      <div className="max-w-6xl mx-auto px-8">
        <div className="h-px" style={{ background: "#E8E4DC" }} />
      </div>

      {/* ── CTA SECTION ── */}
      <section
        id="cta"
        ref={setRef("cta")}
        className="py-32 px-6"
      >
        <div className={`max-w-2xl mx-auto text-center ${fadeClass("cta")}`}>
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="h-px w-8" style={{ background: "#B8960C" }} />
            <span className="text-xs tracking-widest uppercase"
              style={{ color: "#B8960C", letterSpacing: "0.25em" }}>
              Access
            </span>
            <div className="h-px w-8" style={{ background: "#B8960C" }} />
          </div>
          <h2 className="serif mb-6"
            style={{
              fontSize: "clamp(2rem, 4vw, 3rem)",
              fontWeight: "400",
              color: "#1A1A1A",
            }}>
            Ready to Begin?
          </h2>
          <p className="mb-12 text-base leading-relaxed"
            style={{ color: "#6B6560", fontWeight: "300" }}>
            Access is by invitation only.
            If you have been invited by your administrator,
            you may enter your workspace below.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="px-14 py-5 text-sm tracking-widest uppercase font-medium transition-all duration-300"
            style={{
              background: "#1A1A1A",
              color: "#FAFAF7",
              letterSpacing: "0.2em",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#B8960C";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#1A1A1A";
            }}
          >
            Enter Workspace
          </button>
          <p className="mt-6 text-xs tracking-widest"
            style={{ color: "#C4BFB8", letterSpacing: "0.15em" }}>
            Invitation required • Secure access
          </p>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="py-10 px-8 border-t"
        style={{ borderColor: "#E8E4DC" }}>
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span style={{ color: "#B8960C" }}>⚒</span>
            <span className="serif text-sm tracking-widest uppercase"
              style={{ color: "#6B6560", letterSpacing: "0.2em" }}>
              Gold Karigor Tracker
            </span>
          </div>
          <p className="text-xs"
            style={{ color: "#C4BFB8", letterSpacing: "0.1em" }}>
            © 2025 · Built with precision · All rights reserved
          </p>
        </div>
      </footer>

    </div>
  );
}