import Navbar from "../../components/common/NavBar";
import HeroSection  from "../../components/home/HeroSection";
import Footer from "../../components/common/Footer";
import QuickActions from "../../components/home/QuickActions";
import { Component as ClockItMenu } from "../../components/home/ClockItMenu";
import CommunitySection from "../../components/home/CommunitySection";
import HomeCTA from "../../components/home/HomeCTA";

const clockItItems = [
 
  { num: "01", name: "Book Stays", clipId: "clip-hexagons", image: "fb2.jpg" },
  { num: "02", name: "Find Roomies", clipId: "clip-original", image: "fb1.jpg" },
  { num: "03", name: "Browse Deals", clipId: "clip-pixels", image: "/fb3.jpg" },
];

function Home() {
  return (
    <div>
      <Navbar />
      <HeroSection />
      <QuickActions />
       <ClockItMenu items={clockItItems} />
        <CommunitySection />

      <HomeCTA />
      <Footer />
    </div>
  );
}

export default Home;