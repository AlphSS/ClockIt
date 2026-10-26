import NavBar from "../../components/common/NavBar";
import Footer from "../../components/common/Footer";
import "./About.css";

import {
  ArrowRight,
  Home,
  Users,
  ShoppingBag,
  ShieldCheck,
  Heart,
  Sparkles,
  MoveUpRight,
} from "lucide-react";

function About() {
  return (
    <div className="about-page">
      <NavBar />

      {/* =====================================================
          HERO SECTION
      ===================================================== */}

      <section className="about-hero">

        <div className="hero-shape hero-shape-one"></div>
        <div className="hero-shape hero-shape-two"></div>

        <div className="about-hero-content">

          <div className="about-label">
            <span></span>
            ABOUT ClockIt
          </div>

          <h1>
            Find your place.
            <br />
            <i>Find your people.</i>
          </h1>

          <p>
            ClockIt brings together everything students need to
            settle into a new place — from finding the right flat
            and roommate to giving pre-loved things a second life.
          </p>

          <a href="#our-story" className="hero-explore-btn">
            Discover our story
            <ArrowRight size={18} />
          </a>

        </div>

        <div className="hero-side-text">
          <span>01</span>
          <p>OUR STORY</p>
        </div>

      </section>


      {/* =====================================================
          OUR STORY
      ===================================================== */}

      <section className="story-section" id="our-story">

        <div className="section-top-line">
          <span>01</span>
          <p>OUR STORY</p>
        </div>

        <div className="story-grid">

          <div className="story-heading">

            <p className="mini-title">
              A platform built around real student life.
            </p>

            <h2>
              Starting somewhere
              <br />
              <em>new shouldn't be hard.</em>
            </h2>

          </div>

          <div className="story-description">

            <p>
              Moving to a new city is exciting. But finding a
              comfortable place to live, a compatible roommate,
              and affordable essentials can make that first step
              surprisingly difficult.
            </p>

            <p>
              Too many searches. Too many scattered listings.
              Too many decisions to make on your own.
            </p>

            <p>
              ClockItt was created to bring these everyday student
              needs together in one simple space.
            </p>

            <div className="story-note">
              <span></span>
              <p>
                Because finding your place should feel like the
                beginning of something exciting.
              </p>
            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          WHAT IS ClockIt
      ===================================================== */}

      <section className="clockit-section">

        <div className="clockit-intro">

          <div className="section-top-line light-line">
            <span>02</span>
            <p>WHAT IS ClockIt?</p>
          </div>

          <h2>
            One place.
            <br />
            <em>Three possibilities.</em>
          </h2>

          <p>
            Whether you're moving into your first flat, looking
            for someone to share it with, or trying to find
            affordable essentials — ClockIt keeps it all together.
          </p>

        </div>


        <div className="clockit-features">

          {/* FLATS */}

          <div className="clockit-feature-card">

            <div className="feature-top">

              <div className="feature-icon">
                <Home size={25} strokeWidth={1.6} />
              </div>

              <span>01</span>

            </div>

            <div className="feature-content">

              <h3>Find a Flat</h3>

              <p>
                Explore flats that fit your location, budget,
                preferences, and lifestyle.
              </p>

            </div>

            <div className="feature-arrow">
              <MoveUpRight size={18} />
            </div>

          </div>


          {/* ROOMMATES */}

          <div className="clockit-feature-card featured">

            <div className="feature-top">

              <div className="feature-icon">
                <Users size={25} strokeWidth={1.6} />
              </div>

              <span>02</span>

            </div>

            <div className="feature-content">

              <h3>Find a Roommate</h3>

              <p>
                Connect with people whose lifestyle and
                preferences match yours.
              </p>

            </div>

            <div className="feature-arrow">
              <MoveUpRight size={18} />
            </div>

          </div>


          {/* MARKETPLACE */}

          <div className="clockit-feature-card">

            <div className="feature-top">

              <div className="feature-icon">
                <ShoppingBag size={25} strokeWidth={1.6} />
              </div>

              <span>03</span>

            </div>

            <div className="feature-content">

              <h3>Buy & Sell</h3>

              <p>
                Discover affordable pre-loved items or give
                your own things a second life.
              </p>

            </div>

            <div className="feature-arrow">
              <MoveUpRight size={18} />
            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          PHILOSOPHY
      ===================================================== */}

      <section className="philosophy-section">

        <div className="philosophy-number">
          03
        </div>

        <div className="philosophy-content">

          <div className="about-label">
            <span></span>
            OUR PHILOSOPHY
          </div>

          <h2>
            A home is not just
            <br />
            <em>a place.</em>
          </h2>

          <p>
            It's the people you meet, the memories you create,
            and the little things that make an unfamiliar place
            start feeling like yours.
          </p>

        </div>

        <div className="philosophy-circle">
          <Heart size={35} strokeWidth={1.3} />
        </div>

      </section>


      {/* =====================================================
          VALUES
      ===================================================== */}

      <section className="values-section">

        <div className="values-header">

          <div className="section-top-line">
            <span>04</span>
            <p>WHY ClockIt?</p>
          </div>

          <h2>
            Built with
            <br />
            <em>you</em> in mind.
          </h2>

        </div>


        <div className="values-grid">

          {/* VALUE 1 */}

          <div className="value-card">

            <div className="value-number">
              01
            </div>

            <div className="value-icon">
              <Users size={23} strokeWidth={1.5} />
            </div>

            <h3>Community First</h3>

            <p>
              We believe that finding a home is also about finding
              people you feel comfortable sharing it with.
            </p>

          </div>


          {/* VALUE 2 */}

          <div className="value-card">

            <div className="value-number">
              02
            </div>

            <div className="value-icon">
              <ShieldCheck size={23} strokeWidth={1.5} />
            </div>

            <h3>Simple & Reliable</h3>

            <p>
              We keep the experience clear and straightforward,
              so finding what you need doesn't become another task.
            </p>

          </div>


          {/* VALUE 3 */}

          <div className="value-card">

            <div className="value-number">
              03
            </div>

            <div className="value-icon">
              <Sparkles size={23} strokeWidth={1.5} />
            </div>

            <h3>Made for Students</h3>

            <p>
              From budgets to lifestyles, ClockIt is designed
              around the realities of student living.
            </p>

          </div>

        </div>

      </section>


      {/* =====================================================
          BIG QUOTE
      ===================================================== */}

      <section className="quote-section">

        <div className="quote-symbol">
          “
        </div>

        <h2>
          Find a place.
          <br />
          Find your people.
          <br />
          <em>Make it yours.</em>
        </h2>

        <p>
          That's what ClockIt is all about.
        </p>

      </section>


      {/* =====================================================
          CTA
      ===================================================== */}

      <section className="about-cta">

        <div className="cta-circle cta-circle-one"></div>
        <div className="cta-circle cta-circle-two"></div>

        <div className="cta-content">

          <div className="about-label">
            <span></span>
            YOUR NEXT CHAPTER
          </div>

          <h2>
            Ready to find
            <br />
            <em>your place?</em>
          </h2>

          <p>
            Explore flats, meet potential roommates, and discover
            everything you need to make your new place feel like home.
          </p>

          <a href="/" className="cta-button">
            Explore ClockIt
            <ArrowRight size={18} />
          </a>

        </div>

      </section>


      {/* =====================================================
          FOOTER
      ===================================================== */}

      <Footer />

    </div>
  );
}

export default About;