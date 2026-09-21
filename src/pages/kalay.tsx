import { useState, useEffect } from 'react';
import {
  Heart, Users,
  Brain, Smile, Menu, X, Smartphone, Check, Star, Zap, LayoutGrid, Globe, Award, AlertCircle, Crown, ShieldCheck
} from 'lucide-react';

// Assets
import kidsArt from "../assets/kids_teacher.png";
import logo from "../assets/logo.png";

function KalayApp() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  const section_list = ['home', 'the-problem', 'our-solution', 'impact', 'how-it-works', 'membership', 'partners'];

  const problems = [
    {
      title: "Expensive Silos",
      description: "Most studios require monthly commitments for just one art form. If you want to learn Music and Art, you pay double."
    },
    {
      title: "Limited Sessions",
      description: "Fixed schedules mean if you miss a class, you lose it. You're locked into a rhythm that doesn't adapt to your life."
    },
    {
      title: "Geographical Barriers",
      description: "Creativity should be accessible everywhere, but rigid locations make learning inconvenient."
    }
  ];

  const steps = [
    { title: "Pick a Plan", desc: "Select a membership plan that fits your goals.", icon: <Award className="w-6 h-6 md:w-8 md:h-8" /> },
    { title: "Browse", desc: "Find sessions across multiple partner studios.", icon: <LayoutGrid className="w-6 h-6 md:w-8 md:h-8" /> },
    { title: "Book", desc: "Reserve your spot instantly via the app.", icon: <Smartphone className="w-6 h-6 md:w-8 md:h-8" /> },
    { title: "Create", desc: "Just show up! We provide all materials.", icon: <Smile className="w-6 h-6 md:w-8 md:h-8" /> },
  ];

  const artCategories = [
    { category: "Music", items: ["Guitar", "Keyboard", "Drums"] },
    { category: "Visual Arts", items: ["Painting", "Sketching"] },
    { category: "Crafts", items: ["Pottery"] },
    { category: "Performing", items: ["Dance", "Singing"] }
  ];

  const solution_options = [
    { icon: <Zap size={20} />, title: "Multi-Art Exposure", text: "Switch between 8+ art forms anytime. No hidden fees." },
    { icon: <Users size={20} />, title: "Trained Facilitators", text: "Learn from certified mentors who nurture your unique growth." },
    { icon: <Award size={20} />, title: "High-End Infra", text: "Professional instruments and premium materials provided." },
    { icon: <ShieldCheck size={20} />, title: "Safety First", text: "Sessions held in secure, vetted, and supervised environments." }
  ]
  const impact_section = [
    { icon: <Brain size={32} />, title: "Sharper Minds", text: "Improves focus and problem-solving skills for academic and professional success." },
    { icon: <Heart size={32} />, title: "Happier Hearts", text: "A healthy way to de-stress and build lasting emotional intelligence." },
    { icon: <Users size={32} />, title: "Social Connections", text: "Solo hobbies become shared connections within a vibrant community." }
  ]
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;
      for (const section of section_list) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: any) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      setIsMenuOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-white font-['Nunito_Sans'] text-[#1E2D4F] overflow-x-hidden">

      {/* --- NAVIGATION --- */}
      <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md shadow-sm z-[100]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-20">
            <div className="flex items-center space-x-2 cursor-pointer" onClick={() => scrollToSection('home')}>
              <img src={logo} alt="logo" className="h-8 md:h-10 w-auto" />
              <span className="text-xl md:text-2xl font-['Nunito_Sans'] tracking-tighter text-[#1E2D4F]">KALAY</span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex space-x-6 lg:space-x-8 items-center">
              {section_list.map((section) => (
                <button
                  key={section}
                  onClick={() => scrollToSection(section)}
                  className={`capitalize text-xs lg:text-sm font-bold transition-colors ${activeSection === section ? 'text-[#FF8A00]' : 'text-gray-500 hover:text-[#FF8A00]'}`}
                >
                  {section.replace(/-/g, ' ')}
                </button>
              ))}
            </div>

            <button className="md:hidden p-2 text-[#1E2D4F]" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 py-4 px-4 space-y-2 shadow-xl animate-in slide-in-from-top">
            {section_list.map((section) => (
              <button
                key={section}
                onClick={() => scrollToSection(section)}
                className="block w-full text-left p-3 capitalize font-bold text-gray-600 hover:bg-orange-50 hover:text-[#FF8A00] rounded-xl transition-all"
              >
                {section.replace(/-/g, ' ')}
              </button>
            ))}
          </div>
        )}
      </nav>

      {/* --- 1. HERO --- */}
      <section id="home" className="pt-28 md:pt-44 pb-12 md:pb-24 px-4 bg-gradient-to-br from-orange-50 to-white overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col md:grid md:grid-cols-2 gap-10 md:gap-12 items-center">
          <div className="space-y-6 text-center md:text-left order-2 md:order-1">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-['Nunito_Sans'] text-[#1E2D4F] leading-[1.1]">
              Art isn't extracurricular. <br /><span className="text-[#FF8A00]">Art is Essential.</span>
            </h1>
            <p className="text-base md:text-xl text-gray-600 max-w-lg mx-auto md:mx-0 leading-relaxed">
              The first multi-art membership that lets you explore Drums today, Pottery tomorrow, and Dance over the weekend.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <button onClick={() => scrollToSection('membership')} className="bg-[#FF8A00] text-white px-8 py-4 rounded-2xl font-['Nunito_Sans'] shadow-lg shadow-orange-500/30 hover:scale-105 transition-transform">
                Get Started
              </button>
              <button onClick={() => scrollToSection('our-solution')} className="bg-white border-2 border-[#FF8A00] text-[#FF8A00] px-8 py-4 rounded-2xl font-['Nunito_Sans'] hover:bg-gray-50 transition-colors">
                How it Works
              </button>
            </div>
          </div>
          <div className="relative order-1 md:order-2 group">
            {/* 1. The Gradient Shadow: Blue to Orange */}
            <div className="absolute -inset-1 md:-inset-2 bg-gradient-to-tr from-[#1E2D4F] via-[#FF8A00] to-[#FF8A00] rounded-[32px] md:rounded-[24px] blur-2xl opacity-40 z-0 transition-opacity duration-500 group-hover:opacity-60"></div>

            {/* 2. The Zoom Container: Prevents the image from spilling out while scaling */}
            <div className="relative z-10 overflow-hidden rounded-3xl md:rounded-[20px] shadow-lg">
              <img
                src={kidsArt}
                alt="Arts Education"
                className="w-full object-cover max-h-[600px] md:max-h-full"
              />
            </div>

            {/* 3. Optional: Subtle overlay to make the image "pop" */}
            <div className="absolute inset-0 rounded-3xl md:rounded-[20px] ring-1 ring-inset ring-white/10 z-20 pointer-events-none"></div>
          </div>
        </div>
      </section>

      {/* --- 2. THE PROBLEM --- */}
      <section id="the-problem" className="py-16 md:py-24 px-4 bg-[#fff6ed]">
        <div className="max-w-6xl mx-auto text-center space-y-8 md:space-y-12">
          <div className="inline-flex items-center space-x-2 text-red-500 font-bold uppercase tracking-widest text-xs md:text-lg">
            <AlertCircle size={14} /> <span>The Current Reality</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-['Nunito_Sans'] px-2 leading-tight text-[#1E2D4F]">
            Why is exploring creativity so hard?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 text-left pt-6">
            {problems.map(({ title, description }, index) => (
              <div key={index} className="p-6 md:p-8 bg-gray-50 rounded-3xl space-y-3 border-l-4 border-red-400">
                <h3 className="font-['Nunito_Sans'] text-lg md:text-xl">{title}</h3>
                <p className="text-gray-600 text-s leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- 3. THE SOLUTION --- */}
      <section id="our-solution" className="py-16 md:py-24 px-4 bg-[#1E2D4F] text-white overflow-hidden">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 md:gap-16 items-center">
          <div className="space-y-8">
            <div className="space-y-4 text-center lg:text-left">
              <div className="inline-flex items-center space-x-2 text-white bg-[#FF8A00] font-bold uppercase tracking-widest text-[16px] md:text-[16px] px-3 py-1 rounded-full">
                <Star size={12} fill="white" /> <span>Our Solution | KALAY</span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-6xl font-['Nunito_Sans'] leading-tight">
                One Roof. <br />
                <span className="text-[#FF8A00]">Unlimited Possibilities.</span>
              </h2>
            </div>

            <div className="grid sm:grid-cols-2 gap-x-6 md:gap-x-8 gap-y-8 md:gap-y-10">
              {solution_options.map((item, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="bg-[#FF8A00] p-3 rounded-xl h-fit shadow-lg shadow-orange-500/20 flex-shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="text-base md:text-lg">{item.title}</h4>
                    <p className="text-blue-100/70 text-sm md:text-sm leading-relaxed mt-1">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white/5 p-6 md:p-12 rounded-[32px] md:rounded-[48px] backdrop-blur-lg border border-white/10 relative mt-8 lg:mt-0">
            <div className="absolute -top-4 left-6 bg-[#FF8A00] text-white px-4 py-2 rounded-xl font-['Nunito_Sans'] text-[10px] md:text-xs shadow-xl uppercase tracking-wider font-bold">
              Available Art Forms
            </div>
            <div className="grid grid-cols-2 gap-x-6 gap-y-8 md:gap-x-12 md:gap-y-12">
              {artCategories.map(({ category, items }) => (
                <div key={category} className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <div className="h-1 w-4 bg-[#FF8A00] rounded-full" />
                    <p className="text-[#FF8A00] text-[12px] md:text-sm font-['Nunito_Sans'] uppercase tracking-widest">{category}</p>
                  </div>
                  <ul className="space-y-2">
                    {items.map((item) => (
                      <li key={item} className="text-white/90 text-sm md:text-sm font-bold flex items-center gap-2">
                        <div className="w-1 h-1 rounded-full bg-white/30" /> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* --- 4. IMPACT --- */}
      <section id="impact" className="py-16 md:py-24 px-4 bg-orange-50">
        <div className="max-w-7xl mx-auto text-center space-y-12 md:space-y-16">
          <div className="space-y-2">
            <h2 className="text-3xl md:text-5xl font-['Nunito_Sans'] tracking-tighter">Beyond the Canvas</h2>
            <p className="text-[#FF8A00] font-bold uppercase tracking-widest text-xs md:text-sm">Growth that lasts a lifetime</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {impact_section.map((benefit, i) => (
              <div key={i} className="space-y-4 md:space-y-6 group p-6 bg-white/50 rounded-3xl hover:bg-white transition-all shadow-sm hover:shadow-xl">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-2xl md:rounded-[32px] shadow-sm flex items-center justify-center mx-auto text-[#FF8A00] group-hover:bg-[#FF8A00] group-hover:text-white transition-all">
                  {benefit.icon}
                </div>
                <h3 className="font-['Nunito_Sans'] text-xl md:text-2xl">{benefit.title}</h3>
                <p className="text-gray-600 text-s leading-relaxed">{benefit.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- 5. HOW IT WORKS --- */}
      <section id="how-it-works" className="py-16 md:py-24 px-4 bg-[#1E2D4F] text-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-['Nunito_Sans'] mb-4">How it Works</h2>
            <p className="text-blue-200 text-sm md:text-base">Go from "Interested" to "Inspired" in 60 seconds.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {steps.map((step, i) => (
              <div key={i} className="text-center space-y-3 md:space-y-4">
                <div className="w-12 h-12 md:w-20 md:h-20 bg-[#FF8A00] rounded-2xl md:rounded-full flex items-center justify-center mx-auto shadow-lg shadow-orange-500/20">
                  {step.icon}
                </div>
                <h3 className="font-['Nunito_Sans'] text-sm md:text-xl">{step.title}</h3>
                <p className="text-s md:text-s text-blue-100/70">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- 6. MEMBERSHIP --- */}
      <section id="membership" className="py-16 md:py-24 px-4 bg-[#fff7ed]">
        <div className="max-w-7xl mx-auto text-center space-y-12 md:space-y-16">
          <h2 className="text-3xl md:text-5xl font-['Nunito_Sans'] tracking-tighter">Membership Plans</h2>

          {/* grid-cols-2 for mobile (2x2) and lg:grid-cols-4 for web (4x1) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
            {[
              { time: "1 Month", price: "4,499", tag: "Explorer" },
              { time: "3 Month", price: "12,499", tag: "Creator" },
              { time: "6 Month", price: "23,999", tag: "Most Loved", best: true },
              { time: "12 Month", price: "44,999", tag: "Elite" },
            ].map((plan, i) => (
              <div
                key={i}
                className={`relative p-4 md:p-8 rounded-[24px] md:rounded-[32px] border-2 text-left transition-all
            ${plan.best
                    ? "bg-[#FF8A00] border-transparent text-white shadow-xl lg:scale-105 z-10"
                    : "bg-gray-50 border-gray-100 text-[#1E2D4F]"
                  }`}
              >
                {plan.best && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#1E2D4F] text-[#FF8A00] px-3 py-1 rounded-full text-[8px] md:text-[10px] font-['Nunito_Sans'] uppercase tracking-widest flex items-center gap-1 whitespace-nowrap">
                    <Crown size={10} fill="#FF8A00" /> Best Value
                  </div>
                )}

                <p className="text-[12px] md:text-[12px] font-['Nunito_Sans'] uppercase tracking-widest mb-2 md:mb-4 opacity-70">
                  {plan.tag}
                </p>

                <h3 className="text-lg md:text-2xl font-['Nunito_Sans'] mb-1">{plan.time}</h3>

                <p className="text-xl md:text-3xl font-['Nunito_Sans'] mb-4 md:mb-6">₹{plan.price}</p>

                <ul className="space-y-2 md:space-y-3 text-[12px] md:text-[12px] font-bold mb-2">
                  <li className="flex items-start gap-2">
                    <Check size={12} className={`flex-shrink-0 mt-0.5 ${plan.best ? "text-white" : "text-[#FF8A00]"}`} />
                    <span>Unlimited Sessions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check size={12} className={`flex-shrink-0 mt-0.5 ${plan.best ? "text-white" : "text-[#FF8A00]"}`} />
                    <span>Multi-Art Access</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check size={12} className={`flex-shrink-0 mt-0.5 ${plan.best ? "text-white" : "text-[#FF8A00]"}`} />
                    <span>Facilitator Guidance</span>
                  </li>
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- 7. PARTNERS --- */}
      <section id="partners" className="py-16 md:py-24 px-4 bg-[#1E2D4F]">
        <div className="max-w-5xl mx-auto bg-[#fff6ed] rounded-[32px] md:rounded-[48px] p-8 md:p-16 relative overflow-hidden">
          <div className="md:w-3/5 space-y-8 relative z-10 text-center md:text-left">
            <h2 className="text-3xl md:text-4xl text-[#FF8A00] ">Are you interested in making a positive impact? <br />
              {/* <span className="text-[#FF8A00]">Grow with Us.</span> */}
            </h2>
            <p className="text-[#1E2D4F] text-sm md:text-base leading-relaxed">Let's build India's largest creative footprint together.</p>
            <span className="text-[#1E2D4F] text-s">Contact for Partnerships.</span>

            {/* <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-[#1E2D4F] p-4 rounded-2xl border border-white/5">
                <p className="text-[#FF8A00] font-[#fff7ed] text-sm uppercase">Guaranteed</p>
                <p className=" text-[#fff6ed] text-xs font-bold">Monthly Revenue</p>
              </div>
              <div className="bg-[#1E2D4F] p-4 rounded-2xl border border-white/5">
                <p className="text-[#FF8A00] font-[#fff7ed] text-sm uppercase">Support</p>
                <p className=" text-[#fff6ed] text-xs font-bold">Logistics & Marketing</p>
              </div>
            </div> */}
            <div className="bg-[#1E2D4F] p-4 rounded-2xl border border-white/5">

              <p className="text-[#fff6ed] text-sm font-bold">Rishabh Sharma | rishabh@kalay.in</p>
              <p className="text-[#fff6ed] text-sm font-bold">+91-8084790131</p>
              <p className="text-[#fff6ed] text-sm font-bold">Co-founder | KALAY </p>
            </div>
          </div>
          <div className="hidden lg:block opacity-[0.2] absolute right-[-10%] top-0 text-[#1E2D4F]">
            <Globe size={500} />
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-[#1E2D4F] text-white py-12 md:py-20 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start border-b border-white/10 pb-12 mb-8">
          <div className="space-y-4 mb-10 md:mb-0 text-center md:text-left w-full md:w-auto">
            <div className="flex items-center justify-center md:justify-start space-x-2">
              <img src={logo} alt="logo" className="h-8" />
              <span className="text-2xl font-['Nunito_Sans'] tracking-tighter uppercase">KALAY</span>
            </div>
            <p className="text-blue-200 max-w-s text-s mx-auto md:mx-0 font-medium">One pass, endless possibilities.<br /> Transformation through art.</p>
          </div>
          {/* <div className="grid grid-cols-2 gap-12 sm:gap-16 font-bold text-[11px] uppercase tracking-widest w-full md:w-auto">
            <div className="space-y-3">
              <p className="text-[#FF8A00]">Company</p>
              {['About', 'Partners', 'Contact'].map(item => <p key={item} className="cursor-pointer text-blue-100/60 hover:text-white transition-colors">{item}</p>)}
            </div>
            <div className="space-y-3">
              <p className="text-[#FF8A00]">Legal</p>
              {['Privacy', 'Terms', 'Safety'].map(item => <p key={item} className="cursor-pointer text-blue-100/60 hover:text-white transition-colors">{item}</p>)}
            </div>
          </div> */}
        </div>
        <div className="text-center text-[14px] text-blue-300/40 font-['Nunito_Sans'] uppercase tracking-widest">
          © 2026 KALAY. A Social Impact Arts Initiative.
        </div>
      </footer>
    </div>
  );
}

export default KalayApp;
