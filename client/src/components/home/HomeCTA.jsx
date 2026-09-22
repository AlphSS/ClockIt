import { useNavigate } from "react-router-dom";

function HomeCTA() {
  const navigate = useNavigate();

  return (
    <section className="bg-[#2A2A29] px-6 py-28 text-[#EDE9E3]">
      <div className="mx-auto max-w-6xl">

        <div className="relative overflow-hidden rounded-[28px] border border-[#8B7765]/40 bg-[#4A4A47] px-8 py-16 md:px-16 md:py-20">

          {/* ================= DECORATIVE SHAPES ================= */}

          <div
            className="
              pointer-events-none
              absolute
              -right-24
              -top-24
              h-72
              w-72
              rounded-full
              border
              border-[#C7B8A2]/20
            "
          />

          <div
            className="
              pointer-events-none
              absolute
              -bottom-28
              left-[35%]
              h-64
              w-64
              rounded-full
              border
              border-[#C7B8A2]/10
            "
          />


          {/* ================= CONTENT ================= */}

          <div className="relative z-10 max-w-3xl">

            <p className="mb-5 text-sm font-semibold uppercase tracking-[0.22em] text-[#C7B8A2]">
              Your next chapter starts here
            </p>

            <h2 className="text-5xl font-semibold leading-[0.98] tracking-tight md:text-7xl">
              Ready to find
              <br />
              your place?
            </h2>

            <p className="mt-7 max-w-xl text-base leading-7 text-[#C7B8A2] md:text-lg">
              Find a place, meet your people and make student life a little
              easier with ClockIt.
            </p>


            {/* ================= BUTTON ================= */}

            <button
              onClick={() => navigate("/roomies")}
              className="
                group
                mt-9
                inline-flex
                items-center
                gap-4
                rounded-full
                bg-[#EDE9E3]
                px-7
                py-3.5
                text-sm
                font-semibold
                text-[#2A2A29]
                transition-all
                duration-300
                hover:-translate-y-1
                hover:shadow-[0_0_30px_rgba(237,233,227,0.22)]
              "
            >
              Get Started

              <span className="text-lg transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </button>

          </div>


          {/* ================= BOTTOM LABEL ================= */}

          <div className="relative z-10 mt-16 border-t border-[#C7B8A2]/20 pt-6">

            <div className="flex items-center justify-between">

              <span className="text-xs uppercase tracking-[0.25em] text-[#C7B8A2]/70">
                ClockIt
              </span>

              <span className="text-xs uppercase tracking-[0.2em] text-[#C7B8A2]/50">
                Find · Connect · Settle
              </span>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

export default HomeCTA;