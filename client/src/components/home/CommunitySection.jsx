function CommunitySection() {
  return (
    <section className="bg-[#EDE9E3] px-6 py-28 text-[#2A2A29]">
      <div className="mx-auto max-w-6xl">

        {/* ================= MAIN COMMUNITY BLOCK ================= */}

        <div className="relative overflow-hidden rounded-[28px] bg-[#C7B8A2] px-8 py-16 md:px-16 md:py-20">

          {/* Decorative circles */}

          <div
            className="
              pointer-events-none
              absolute
              -right-28
              -top-28
              h-80
              w-80
              rounded-full
              border
              border-[#8B7765]/40
            "
          />

          <div
            className="
              pointer-events-none
              absolute
              -bottom-36
              -left-20
              h-72
              w-72
              rounded-full
              border
              border-[#8B7765]/30
            "
          />

          {/* Decorative small circle */}

          <div
            className="
              pointer-events-none
              absolute
              right-[18%]
              bottom-[18%]
              h-16
              w-16
              rounded-full
              border
              border-[#EDE9E3]/40
            "
          />


          {/* ================= CONTENT ================= */}

          <div className="relative z-10 max-w-3xl">

            <p className="mb-5 text-sm font-semibold uppercase tracking-[0.22em] text-[#8B7765]">
              More than a place to live
            </p>

            <h2 className="text-5xl font-semibold leading-[0.98] tracking-tight md:text-7xl">
              Find your people.
              <br />
              Build your community.
            </h2>

            <p className="mt-8 max-w-xl text-base leading-7 text-[#4A4A47] md:text-lg">
              Moving to a new place can feel overwhelming. ClockIt makes
              it easier to find people, spaces and things that make a new
              city feel a little more like home.
            </p>

          </div>


          {/* ================= BOTTOM STATEMENT ================= */}

          <div className="relative z-10 mt-16 flex flex-col gap-8 border-t border-[#8B7765]/40 pt-7 md:flex-row md:items-end md:justify-between">

            <p className="max-w-md text-sm leading-6 text-[#4A4A47]">
              From your first roommate to your first piece of furniture,
              ClockIt is built around the little things that make student
              life easier.
            </p>

            <span className="text-sm font-semibold uppercase tracking-[0.18em] text-[#2A2A29]">
              Find. Connect. Settle.
            </span>

          </div>

        </div>

      </div>
    </section>
  );
}

export default CommunitySection;