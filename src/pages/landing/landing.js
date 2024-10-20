import { LogoFull } from "./assets/icons/generated";
import { Footer } from "./components/footer";
import { NavBar } from "./components/navBar";
import { Experience } from "./pages/experience/experience";
import { Features } from "./pages/features/features";
import { Hero } from "./pages/hero";
import { Why } from "./pages/why/why";

export function Landing() {
  return (
    <div className="">
      <NavBar />
      <Hero />
      <Features />
      <Why />
      <Experience />
      <Footer />
    </div>
  );
}
