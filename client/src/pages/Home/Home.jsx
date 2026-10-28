import NavBar from "../../components/common/NavBar"
import HeroSection from "../../components/home/HeroSection";
import QuickActions from "../../components/home/QuickActions";
import ClockItMenu from "../../components/home/ClockItMenu";
import CommunitySection from "../../components/home/CommunitySection";
import HomeCTA from "../../components/home/HomeCTA";
import Footer from "../../components/common/Footer"

function Home() {
  return (
    <main>
      <NavBar/>
      {/* Hero Section */}
      <HeroSection />

      {/* Quick Actions */}
      <QuickActions />

      {/* ClockIt Features */}
      <ClockItMenu />

      {/* Community Section */}
      <CommunitySection />

      {/* Final Call To Action */}
      <HomeCTA />

      <Footer/>
    </main>
  );
}

export default Home;
