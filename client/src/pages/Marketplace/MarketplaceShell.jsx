import {
  GraduationCap,
  Store,
  ClipboardList,
  PlusCircle,
  Heart,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

const NAV = [
  { key: "market", label: "Marketplace", path: "/marketplace", icon: Store },
  {
    key: "mine",
    label: "My Listings",
    path: "/marketplace/my-listings",
    icon: ClipboardList,
  },
  {
    key: "add",
    label: "Sell an Item",
    path: "/marketplace/add",
    icon: PlusCircle,
  },
];

export const Styles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,500;0,9..144,600;0,9..144,700;1,9..144,500;1,9..144,600&family=DM+Sans:wght@400;500;600;700&family=Caveat:wght@500;600&display=swap');

    .ck-root { font-family: 'DM Sans', system-ui, sans-serif; color: #2B1B1E; }
    .ck-display { font-family: 'Fraunces', Georgia, serif; letter-spacing: -0.015em; }
    .ck-script { font-family: 'Caveat', 'Segoe Script', cursive; }

    .ck-bg { background: linear-gradient(160deg, #FCF5EE 0%, #F8E8DC 55%, #F3D9C9 100%); }

    .ck-panel {
      background: rgba(255, 251, 247, 0.8);
      -webkit-backdrop-filter: blur(10px);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.75);
      box-shadow: 0 24px 60px rgba(120, 70, 50, 0.12);
    }
    .ck-card {
      background: #FFFFFF;
      border: 1px solid #F0E3DA;
      box-shadow: 0 8px 24px rgba(120, 70, 50, 0.07);
    }

    .ck-field {
      width: 100%;
      padding: 0.8rem 1rem;
      border-radius: 0.8rem;
      background: #F8F0EA;
      color: #2B1B1E;
      border: 1.5px solid #EBDCD2;
      transition: border-color .15s ease, background-color .15s ease;
    }
    .ck-field::placeholder { color: #A8968F; }
    .ck-field:hover { border-color: #DCC4B8; }
    .ck-field:focus { outline: none; background: #FFFFFF; border-color: #8C2B3F; }

    .ck-btn {
      display: inline-flex; align-items: center; justify-content: center; gap: .5rem;
      font-weight: 600; border-radius: .9rem;
      transition: background-color .15s ease, border-color .15s ease, transform .15s ease;
    }
    .ck-btn:disabled { opacity: .55; cursor: not-allowed; }
    .ck-btn-wine { background: #8C2B3F; color: #fff; box-shadow: 0 8px 18px rgba(140, 43, 63, .25); }
    .ck-btn-wine:hover:not(:disabled) { background: #732233; }
    .ck-btn-green { background: #3F6B57; color: #fff; box-shadow: 0 8px 18px rgba(63, 107, 87, .25); }
    .ck-btn-green:hover:not(:disabled) { background: #325847; }
    .ck-btn-ghost { background: #fff; color: #2B1B1E; border: 1px solid #E6D5CB; }
    .ck-btn-ghost:hover:not(:disabled) { background: #FBF4EE; border-color: #CDB3A6; }

    .ck-note {
      position: relative;
      background: #F6E2C3;
      background-image: linear-gradient(180deg, rgba(255,255,255,.4), rgba(255,255,255,0));
      box-shadow: 0 10px 20px rgba(120, 70, 50, 0.18);
    }
    .ck-note::before {
      content: ""; position: absolute; top: -10px; left: 50%;
      width: 64px; height: 20px; transform: translateX(-50%) rotate(-3deg);
      background: rgba(255,255,255,.6); border: 1px solid rgba(0,0,0,.05);
    }

    .ck-root :is(button, a, input, select, textarea):focus-visible { outline: 3px solid #8C2B3F; outline-offset: 2px; }
    .ck-drop:focus-within { border-color: #8C2B3F; background: #FBEFE9; }

    @media (prefers-reduced-motion: reduce) {
      .ck-field, .ck-btn, .ck-card { transition: none !important; }
    }
  `}</style>
);

/* A small sprig of leaves, purely decorative */
const Leaves = ({ className = "", flip = false }) => {
  const leaf = "M0 0 C 18 -14 44 -14 60 0 C 44 14 18 14 0 0 Z";
  const items = [
    { x: 100, y: 235, r: -120, s: 1, c: "#6E8F6F" },
    { x: 100, y: 235, r: -60, s: 1, c: "#8FAF8C" },
    { x: 101, y: 185, r: -135, s: 0.9, c: "#5F7F62" },
    { x: 101, y: 185, r: -45, s: 0.95, c: "#A9C3A5" },
    { x: 102, y: 130, r: -150, s: 0.8, c: "#8FAF8C" },
    { x: 102, y: 130, r: -30, s: 0.85, c: "#6E8F6F" },
    { x: 100, y: 78, r: -100, s: 0.7, c: "#A9C3A5" },
    { x: 100, y: 78, r: -80, s: 0.7, c: "#5F7F62" },
  ];

  return (
    <svg
      viewBox="0 0 200 260"
      className={className}
      style={flip ? { transform: "scaleX(-1)" } : undefined}
      aria-hidden="true"
    >
      <path
        d="M100 260 C 96 190 104 120 100 50"
        stroke="#5F7F62"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
      {items.map((l, i) => (
        <g
          key={i}
          transform={`translate(${l.x} ${l.y}) rotate(${l.r}) scale(${l.s})`}
        >
          <path d={leaf} fill={l.c} />
        </g>
      ))}
    </svg>
  );
};

const Logo = ({ onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="flex items-center gap-2.5 text-left"
    aria-label="ClockIt marketplace home"
  >
    <span className="w-10 h-10 rounded-xl bg-[#2B1B1E] text-white flex items-center justify-center">
      <GraduationCap size={22} />
    </span>
    <span className="ck-display text-2xl font-bold tracking-tight">
      ClockIt
    </span>
  </button>
);

function MarketplaceShell({ children, note = "Campus Needs Campus People" }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const activeKey =
    pathname.startsWith("/marketplace/my-listings") ||
    pathname.endsWith("/edit")
      ? "mine"
      : pathname.startsWith("/marketplace/add")
        ? "add"
        : "market";

  return (
    <div className="ck-root ck-bg relative min-h-screen overflow-x-hidden">
      <Styles />

      {/* Watercolor washes */}
      <div
        className="fixed inset-0 pointer-events-none overflow-hidden"
        aria-hidden="true"
      >
        <div className="absolute -top-32 -left-24 w-[26rem] h-[26rem] rounded-full bg-[#E9B7A0]/45 blur-[90px]" />
        <div className="absolute top-1/4 -right-32 w-[28rem] h-[28rem] rounded-full bg-[#BFD2BB]/45 blur-[100px]" />
        <div className="absolute -bottom-40 left-1/3 w-[30rem] h-[30rem] rounded-full bg-[#F1C4AE]/50 blur-[110px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1500px] p-3 sm:p-5 lg:p-6 flex gap-5 lg:gap-6 items-start">
        {/* Sidebar */}
        <aside className="hidden lg:flex flex-col w-56 xl:w-60 shrink-0 sticky top-6 ck-panel rounded-[28px] p-5 min-h-[calc(100vh-3rem)]">
          <Logo onClick={() => navigate("/marketplace")} />

          <nav className="mt-9 flex flex-col gap-1.5" aria-label="Marketplace">
            {NAV.map(({ key, label, path, icon: Icon }) => {
              const active = key === activeKey;

              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => navigate(path)}
                  aria-current={active ? "page" : undefined}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    active
                      ? "bg-[#DDE8DA] text-[#2F5644]"
                      : "text-[#5E4F4B] hover:bg-[#F6E9E0]"
                  }`}
                >
                  <Icon size={18} />
                  {label}
                </button>
              );
            })}
          </nav>

          <div className="mt-auto pt-10" aria-hidden="true">
            <p className="ck-script text-[1.7rem] leading-[1.05] text-[#5E4F4B] -rotate-6 origin-left">
              {note}
              <Heart
                size={16}
                className="inline ml-1 -mt-1 text-[#D9756E] fill-[#D9756E]"
              />
            </p>
          </div>
        </aside>

        {/* Main column */}
        <main className="flex-1 min-w-0">
          {/* Compact top bar for small screens */}
          <div className="lg:hidden ck-panel rounded-2xl px-3 py-3 mb-4 flex items-center justify-between gap-3">
            <Logo onClick={() => navigate("/marketplace")} />

            <nav className="flex items-center gap-1" aria-label="Marketplace">
              {NAV.map(({ key, label, path, icon: Icon }) => {
                const active = key === activeKey;

                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => navigate(path)}
                    aria-label={label}
                    aria-current={active ? "page" : undefined}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                      active
                        ? "bg-[#DDE8DA] text-[#2F5644]"
                        : "text-[#5E4F4B] hover:bg-[#F6E9E0]"
                    }`}
                  >
                    <Icon size={19} />
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="ck-panel rounded-[28px] sm:rounded-[32px] p-5 sm:p-8 lg:p-10 pb-16 sm:pb-20">
            {children}
          </div>
        </main>
      </div>

      {/* Foliage in the bottom corners */}
      <Leaves className="absolute bottom-0 left-0 w-24 sm:w-36 opacity-80 pointer-events-none z-0" />
      <Leaves
        className="absolute bottom-0 right-0 w-24 sm:w-40 opacity-80 pointer-events-none z-0"
        flip
      />
    </div>
  );
}

export default MarketplaceShell;
