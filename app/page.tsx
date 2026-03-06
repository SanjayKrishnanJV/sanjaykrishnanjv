import Hero from '@/components/sections/Hero';
import About from '@/components/sections/About';
import Skills from '@/components/sections/Skills';
import Projects from '@/components/sections/Projects';
import Certifications from '@/components/sections/Certifications';
import Experience from '@/components/sections/Experience';
import Education from '@/components/sections/Education';
import Achievements from '@/components/sections/Achievements';
import GitHubActivity from '@/components/sections/GitHubActivity';
import Blog from '@/components/sections/Blog';
import Timeline from '@/components/sections/Timeline';
import Stats from '@/components/sections/Stats';
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
      <Skills />
      <Projects />
      <Certifications />
      <Experience />
      <Education />
      <Achievements />
      <GitHubActivity />
      <Stats />
      <Timeline />
      <Blog />
      <Contact />

        <Footer />
      </main>
    </DataProvider>
  );
}
