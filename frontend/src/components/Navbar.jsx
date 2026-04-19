import { Link, NavLink, useNavigate } from "react-router-dom";
import { Sparkles, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";

const links = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/resume", label: "Resume" },
  { to: "/skills", label: "Skills" },
  { to: "/interview", label: "Interview" },
  { to: "/story", label: "Story" },
  { to: "/chat", label: "Chat" },
];

export const Navbar = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  return (
    <header
      className="sticky top-0 z-40 glass border-b border-white/40"
      data-testid="main-navbar"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2" data-testid="nav-logo">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-[#7C6CF6] to-[#FFB7A5] flex items-center justify-center shadow-soft">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="font-heading font-bold text-lg tracking-tight">ReLaunch<span className="text-[#7C6CF6]">.</span>AI</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1" data-testid="nav-links">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              data-testid={`nav-${l.label.toLowerCase()}`}
              className={({ isActive }) =>
                `px-3 py-2 rounded-full text-sm font-medium transition-all ${
                  isActive
                    ? "bg-[#ECE9FE] text-[#5A4BD4]"
                    : "text-gray-600 hover:text-[#5A4BD4] hover:bg-[#F3F0FF]"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden md:block">
          <Button
            onClick={() => navigate("/dashboard")}
            className="rounded-full bg-[#1A1A24] hover:bg-black text-white px-5"
            data-testid="nav-cta-btn"
          >
            Get Started
          </Button>
        </div>

        <button
          aria-label="menu"
          className="md:hidden p-2 rounded-xl bg-white border border-gray-100"
          onClick={() => setOpen((o) => !o)}
          data-testid="nav-menu-toggle"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-white/50 bg-white/85 backdrop-blur-xl px-5 py-3 space-y-1" data-testid="mobile-menu">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              data-testid={`mnav-${l.label.toLowerCase()}`}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-xl text-sm ${
                  isActive ? "bg-[#ECE9FE] text-[#5A4BD4]" : "text-gray-700"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </div>
      )}
    </header>
  );
};

export default Navbar;
