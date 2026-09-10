import Nav from './components/Nav';
import Hero from './components/Hero';
import ContentBackdrop from './components/ContentBackdrop';
import Profile from './components/Profile';
import Stats from './components/Stats';
import Experience from './components/Experience';
import Projects from './components/Projects';
import Capabilities from './components/Capabilities';
import Education from './components/Education';
import Testimonials from './components/Testimonials';
import Contact from './components/Contact';

export default function App() {
  return (
    <>
      <a className="skip" href="#profile">
        跳到主要内容
      </a>

      <Nav />

      <main>
        <Hero />

        <div className="content">
          <ContentBackdrop />

          <div className="content__body">
            <Profile />
            <Stats />
            <Experience />
            <Projects />
            <Capabilities />
            <Education />
            <Testimonials />
            <Contact />
          </div>
        </div>
      </main>
    </>
  );
}
