import Hero from '@/components/sections/Hero';
import About from '@/components/sections/About';
import SkillsEnhanced from '@/components/sections/SkillsEnhanced';
import Projects from '@/components/sections/Projects';
import CaseStudies from '@/components/sections/CaseStudies';
import Certifications from '@/components/sections/Certifications';
import Experience from '@/components/sections/Experience';
import Education from '@/components/sections/Education';
import Achievements from '@/components/sections/Achievements';
import Testimonials from '@/components/sections/Testimonials';
import GitHubActivity from '@/components/sections/GitHubActivity';
import Blog from '@/components/sections/Blog';
import Timeline from '@/components/sections/Timeline';
import Stats from '@/components/sections/Stats';
import Dashboards from '@/components/sections/Dashboards';
import Newsletter from '@/components/sections/Newsletter';
import Contact from '@/components/sections/Contact';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ThemeToggle from '@/components/ui/ThemeToggle';
import ScrollProgress from '@/components/ui/ScrollProgress';
import ScrollToTop from '@/components/ui/ScrollToTop';
import { DataProvider } from './data-provider';
import { getPersonalData, getGitHubData, getCertifications } from '@/lib/data';

export default function Home() {
  // Read data server-side
  const personal = getPersonalData();
  const github = getGitHubData();
  const certifications = getCertifications();

  return (
    <DataProvider data={{ personal, github, certifications }}>
      <main className="relative">
        <ScrollProgress />
        <ThemeToggle />
        <ScrollToTop />
        <Navbar />

      <Hero />
      <About />
      <SkillsEnhanced />
      <Projects />
      <CaseStudies />
      <Certifications />
      <Experience />
      <Education />
      <Achievements />
      <Testimonials />
      <GitHubActivity />
      <Stats />
      <Dashboards />
      <Timeline />
      <Blog />
      <Newsletter />
      <Contact />

        <Footer />
      </main>
    </DataProvider>
  );
}
