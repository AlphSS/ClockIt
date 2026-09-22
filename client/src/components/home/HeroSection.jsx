import DepthCarousel from "./DepthCarousel";

function HeroSection() {
  return (
    <section className="relative min-h-[calc(100vh-88px)] overflow-hidden bg-[#EDE9E3] text-[#2A2A29]">
      
      <div className="mx-auto flex min-h-[calc(100vh-88px)] max-w-7xl items-center px-6 lg:px-10">

        {/* Main Hero Layout */}
        <div className="grid w-full items-center gap-16 py-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">

          {/* ================= LEFT — TEXT ================= */}
          <div className="max-w-2xl">

            {/* Eyebrow */}
            <p className="mb-8 text-sm font-semibold uppercase tracking-[0.25em] text-[#8B7765]">
              Everything students need
            </p>

            {/* Main Heading */}
            <h1 className="text-6xl font-semibold leading-[0.92] tracking-tight md:text-7xl lg:text-8xl">
              Find your
              <br /> 
              place.
              <br />
              Find your people.
            </h1>

            {/* Description */}
            <p className="mt-8 max-w-xl text-lg leading-relaxed text-[#4A4A47]">
              Find roommates, discover stays, buy and sell essentials,
              and connect with your student community — all in one place.
            </p>

            {/* CTA */}
            <div className="mt-10 flex flex-wrap gap-4">
              <button
                className="
                  rounded-full
                  bg-[#2A2A29]
                  px-7
                  py-3.5
                  text-sm
                  font-medium
                  text-[#EDE9E3]
                  transition-all
                  duration-300
                  hover:-translate-y-0.5
                  hover:shadow-[0_10px_30px_rgba(42,42,41,0.20)]
                "
              >
                Explore ClockIt
              </button>
            </div>

          </div>


          {/* ================= RIGHT — CAROUSEL ================= */}
          <div className="relative flex h-[500px] w-full items-center justify-center lg:translate-x-6">

            <DepthCarousel
              items={[
                {
                  image: "/hero1.jpg",
                  alt: "ClockIt student community",
                },
                {
                  image: "/hero2.jpg",
                  alt: "Student accommodation",
                },
                {
                  image: "/hero3.jpg",
                  alt: "Student lifestyle",
                },
                {
                  image: "/hero4.jpg",
                  alt: "Student community",
                },
                {
                  image: "/hero5.jpg",
                  alt: "Student community",
                },
                {
                  image: "/hero6.jpg",
                  alt: "Student community",
                },
                {
                  image: "/hero7.jpg",
                  alt: "Student community",
                },
                {
                  image: "/hero8.jpg",
                  alt: "Student community",
                },
              ]}

              depth={220}
              spread={90}
              tilt={22}
              tiltDirection="right"
              perspective={1400}

              visibleCards={4}
              falloff={0.2}
              blur={5}

              autoplay={false}
              loop

              cardWidth={300}
              cardHeight={380}
              radius={20}

              tint="#05060a"

              duration={700}
              ease="power3.out"

              showControls={false}
              showIndicators={true}
            />

          </div>

        </div>

      </div>

    </section>
  );
}

export default HeroSection;