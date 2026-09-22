function Footer({ theme = "dark" }) {
  const isRoomies = theme === "roomies";

  return (
    <footer
      className={`relative mt-24 ${
        isRoomies
          ? "bg-[#280B0F] text-[#F5EEE6]"
          : "bg-[#242423] text-[#EDE9E3]"
      }`}
    >

      {/* Newsletter */}
      <div className="absolute left-1/2 top-0 flex w-[90%] max-w-2xl -translate-x-1/2 -translate-y-1/2 items-center rounded-full border border-[#C6B39A] bg-[#F5EEE6] p-1.5 shadow-lg">

        <input
          type="email"
          placeholder="Enter your email address"
          className="min-w-0 flex-1 bg-transparent px-5 py-3 text-sm font-medium text-[#2A2A29] outline-none placeholder:text-[#8E8A83]"
        />

        <button
          className={`rounded-full px-6 py-3 text-xs font-black tracking-wide transition-all duration-300 ${
            isRoomies
              ? "bg-[#8D3A3C] text-[#F5EEE6] hover:bg-[#7B694E]"
              : "bg-[#C9C2B8] text-[#242423] hover:bg-[#EDE9E3]"
          }`}
        >
          SUBSCRIBE
        </button>

      </div>


      {/* Main Footer */}
      <div className="mx-auto max-w-7xl px-6 pb-8 pt-24 md:px-10">

        <div className="grid gap-12 lg:grid-cols-5">

          {/* Brand */}
          <div className="lg:col-span-2">

            <h2 className="text-4xl font-black tracking-tight md:text-5xl">
              Clockit
              <span
                className={
                  isRoomies
                    ? "text-[#C6B39A]"
                    : "text-[#C9C2B8]"
                }
              >
                .
              </span>
            </h2>

            <p className="mt-5 max-w-sm text-sm font-medium leading-7 text-[#A8A39B] md:text-base">
              Find your next flat, meet the right roommate,
              and discover great second-hand things — all in one place.
            </p>

            <a
              href="#"
              className="mt-6 inline-block text-sm font-bold text-[#D8D2C8] transition-colors duration-300 hover:text-[#EDE9E3]"
            >
              Explore ClockIt →
            </a>

          </div>


          {/* Explore */}
          <div>

            <h3 className="mb-5 text-sm font-black uppercase tracking-[0.15em]">
              Explore
            </h3>

            <ul className="space-y-4 text-sm font-medium text-[#A8A39B]">

              <li>
                <a
                  href="#"
                  className="transition-colors hover:text-[#EDE9E3]"
                >
                  Find Flats
                </a>
              </li>

              <li>
                <a
                  href="#"
                  className="transition-colors hover:text-[#EDE9E3]"
                >
                  Find Roommates
                </a>
              </li>

              <li>
                <a
                  href="#"
                  className="transition-colors hover:text-[#EDE9E3]"
                >
                  Marketplace
                </a>
              </li>

              <li>
                <a
                  href="#"
                  className="transition-colors hover:text-[#EDE9E3]"
                >
                  Post a Listing
                </a>
              </li>

            </ul>

          </div>


          {/* Community */}
          <div>

            <h3 className="mb-5 text-sm font-black uppercase tracking-[0.15em]">
              Community
            </h3>

            <ul className="space-y-4 text-sm font-medium text-[#A8A39B]">

              <li>
                <a
                  href="#"
                  className="transition-colors hover:text-[#EDE9E3]"
                >
                  About ClockIt
                </a>
              </li>

              <li>
                <a
                  href="#"
                  className="transition-colors hover:text-[#EDE9E3]"
                >
                  Student Community
                </a>
              </li>

              <li>
                <a
                  href="#"
                  className="transition-colors hover:text-[#EDE9E3]"
                >
                  Safety
                </a>
              </li>

              <li>
                <a
                  href="#"
                  className="transition-colors hover:text-[#EDE9E3]"
                >
                  Help Center
                </a>
              </li>

            </ul>

          </div>


          {/* Resources */}
          <div>

            <h3 className="mb-5 text-sm font-black uppercase tracking-[0.15em]">
              Resources
            </h3>

            <ul className="space-y-4 text-sm font-medium text-[#A8A39B]">

              <li>
                <a
                  href="#"
                  className="transition-colors hover:text-[#EDE9E3]"
                >
                  Flat Hunting Guide
                </a>
              </li>

              <li>
                <a
                  href="#"
                  className="transition-colors hover:text-[#EDE9E3]"
                >
                  Roommate Guide
                </a>
              </li>

              <li>
                <a
                  href="#"
                  className="transition-colors hover:text-[#EDE9E3]"
                >
                  Buying & Selling
                </a>
              </li>

              <li>
                <a
                  href="#"
                  className="transition-colors hover:text-[#EDE9E3]"
                >
                  FAQs
                </a>
              </li>

            </ul>

          </div>

        </div>


        {/* Divider */}
        <div
          className={`my-10 h-px ${
            isRoomies
              ? "bg-[#7B694E]/40"
              : "bg-[#454542]"
          }`}
        />


        {/* Bottom Bar */}
        <div className="flex flex-col gap-4 text-xs font-medium text-[#8E8A83] md:flex-row md:items-center md:justify-between">

          <p>
            © 2026 Clockit. All rights reserved.
          </p>

          <div className="flex gap-6">

            <a
              href="#"
              className="transition-colors hover:text-[#EDE9E3]"
            >
              Terms
            </a>

            <a
              href="#"
              className="transition-colors hover:text-[#EDE9E3]"
            >
              Privacy
            </a>

            <a
              href="#"
              className="transition-colors hover:text-[#EDE9E3]"
            >
              Cookies
            </a>

          </div>

        </div>

      </div>

    </footer>
  );
}

export default Footer;