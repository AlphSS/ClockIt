import { useNavigate } from "react-router-dom";

// Fraunces (serif, for headings/titles) + Inter (sans, for body/labels)
// If your project already loads these globally (e.g. in index.html), you can
// delete the <style> block below and just reference the font-family names.
const FontImports = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600&display=swap');
    .font-display { font-family: 'Fraunces', serif; }
    .font-body { font-family: 'Inter', sans-serif; }
  `}</style>
);

function QuickActions() {
  const navigate = useNavigate();

  const actions = [
    {
      title: "Find a Room",
      description: "Discover stays that fit your budget and lifestyle.",
      route: "/stay",
      number: "01",
      cardClass: "bg-[#2B2A26]",
      textClass: "text-[#F3EFE6]",
      mutedClass: "text-[#C9BBA3]",
      borderClass: "border-[#C9BBA3]/40",
      accentClass: "bg-[#C9BBA3]",
      iconCircleClass: "bg-[#45433C] border-transparent",
      iconStrokeClass: "text-[#F3EFE6]",
      glowClass: "hover:shadow-[0_0_30px_rgba(201,187,163,0.25)]",
    },
    {
      title: "Find Roomies",
      description: "Meet students who match your lifestyle and preferences.",
      route: "/roomies",
      number: "02",
      cardClass: "bg-[#E7DBC3]",
      textClass: "text-[#2B2A26]",
      mutedClass: "text-[#6B5A44]",
      borderClass: "border-[black]/45",
      accentClass: "bg-[#8B6F47]",
      iconCircleClass: "bg-[#8B6F47] border-transparent",
      iconStrokeClass: "text-[#F3EFE6]",
      glowClass: "hover:shadow-[0_0_30px_rgba(139,111,71,0.30)]",
    },
    {
      title: "Marketplace",
      description: "Buy, sell and discover useful student essentials.",
      route: "/marketplace",
      number: "03",
      cardClass: "bg-[#6E6D5A]",
      textClass: "text-[#F3EFE6]",
      mutedClass: "text-[#DAD6C8]",
      borderClass: "border-[#F3EFE6]/45",
      accentClass: "bg-[#F3EFE6]",
      iconCircleClass: "bg-[#F3EFE6] border-transparent",
      iconStrokeClass: "text-[#2B2A26]",
      glowClass: "hover:shadow-[0_0_30px_rgba(243,239,230,0.20)]",
    },
  ];

  return (
    <section className="font-body bg-[#EDE9E3] px-6 py-24 text-[#2A2A29]">
      <FontImports />
      <div className="mx-auto max-w-6xl">
        {/* ================= SECTION HEADING ================= */}
        <div className="mb-12 flex items-end justify-between">
          <div>
            <p className="mb-3 text-s font-semibold uppercase tracking-[0.22em] text-[#8B6F47]">
              Get started
            </p>

            <h2 className="font-display text-[25px] font-medium tracking-tight text-[#2B2A26] md:text-[30px]">
              What are you looking for?
            </h2>
          </div>

          <p className="hidden max-w-sm text-right text-xl leading-relaxed text-[#8B7765] md:block">
            Everything you need to settle into student life, all in one place.
          </p>
        </div>

        {/* ================= ACTION CARDS ================= */}
        <div className="grid gap-6 md:grid-cols-3">
          {actions.map((action) => (
            <button
              key={action.number}
              onClick={() => navigate(action.route)}
              className={`
                group relative h-[430px] overflow-hidden rounded-[22px]
                p-7 text-left
                transition-all duration-500
                hover:-translate-y-2
                ${action.cardClass}
                ${action.glowClass}
              `}
            >
              {/* ================= NUMBER ================= */}
              <span
                className={`
                  absolute left-7 top-7
                  font-body text-sm font-medium tracking-widest
                  ${action.textClass}
                `}
              >
                {action.number}
              </span>

              {/* ================= VERTICAL LINE ================= */}
              <div
                className={`
                  absolute left-10 top-[78px] h-[300px] w-px
                  opacity-60
                  ${action.accentClass}
                `}
              />

              {/* ================= INNER ARCH ================= */}
              <div
                className={`
                  absolute left-1/2 top-[74px]
                  h-[300px] w-[68%]
                  -translate-x-1/2
                  rounded-t-[150px]
                  rounded-b-[4px]
                  border
                  opacity-70
                  transition-all duration-500
                  group-hover:scale-[1.02]
                  ${action.borderClass}
                `}
              />

              {/* ================= CONTENT ================= */}
              <div className="relative z-10 flex h-full flex-col items-center">
                {/* ICON */}
                <div
                  className={`
                    mt-7 flex h-[68px] w-[68px]
                    items-center justify-center
                    rounded-full
                    border
                    transition-all duration-500
                    group-hover:scale-110
                    ${action.iconCircleClass}
                  `}
                >
                  {/* HOME ICON */}
                  {action.number === "01" && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="28"
                      height="28"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={action.iconStrokeClass}
                    >
                      <path d="m3 11 9-8 9 8" />
                      <path d="M5 10v10h14V10" />
                      <path d="M9 20v-6h6v6" />
                    </svg>
                  )}

                  {/* ROOMIES ICON */}
                  {action.number === "02" && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="28"
                      height="28"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={action.iconStrokeClass}
                    >
                      <circle cx="9" cy="8" r="3" />
                      <circle cx="17" cy="9" r="2.5" />
                      <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" />
                      <path d="M15 14c3.3 0 6 2 6 5" />
                    </svg>
                  )}

                  {/* MARKETPLACE ICON */}
                  {action.number === "03" && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="28"
                      height="28"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={action.iconStrokeClass}
                    >
                      <path d="M6 8h12l1 13H5L6 8Z" />
                      <path d="M9 8V6a3 3 0 0 1 6 0v2" />
                    </svg>
                  )}
                </div>

                {/* ================= TEXT ================= */}
                <div className="mt-9 flex w-full flex-col items-center text-center">
                  <h3
                    className={`
                      font-display text-[26px] font-medium tracking-tight
                      ${action.textClass}
                    `}
                  >
                    {action.title}
                  </h3>

                  {/* Divider */}
                  <div
                    className={`
                      my-4 h-px w-8
                      opacity-80
                      ${action.accentClass}
                    `}
                  />

                  <p
                    className={`
                      max-w-[230px]
                      font-body text-sm leading-6
                      ${action.mutedClass}
                    `}
                  >
                    {action.description}
                  </p>
                </div>

                {/* ================= EXPLORE ================= */}
                <div
                  className={`
                    absolute bottom-7
                    mb-5
                    flex w-[145px]
                    items-center justify-between
                    rounded-md
                    border
                    px-4 py-2.5
                    font-body text-sm font-medium
                    transition-all duration-300
                    group-hover:w-[155px]
                    ${action.borderClass}
                    ${action.textClass}
                  `}
                >
                  <span >Explore</span>

                  <span
                    className="
                      text-lg
                      transition-transform duration-300
                      group-hover:translate-x-1
                    "
                  >
                    →
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

export default QuickActions;