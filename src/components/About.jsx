import React, { useEffect, useState, useMemo, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Marquee from "react-fast-marquee";

const About = () => {
  const containerRef = useRef(null);
  const [themeMode, setThemeMode] = useState("dark");
  const isLight = themeMode === "light";
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Theme Sync
  useEffect(() => {
    const updateTheme = () => {
      setThemeMode(document.documentElement.getAttribute("data-theme") || "dark");
    };
    updateTheme();
    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => observer.disconnect();
  }, []);

  // Parallax Effect
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const yBg = useTransform(scrollYProgress, [0, 1], [0, -100]);

  // Tech stack data for marquee (Grayscale default)
  const techStack = useMemo(() => [
    { name: "React", logo: "https://cdn.simpleicons.org/react/000000" }, // Black logos for monochrome vibe
    { name: "JavaScript", logo: "https://cdn.simpleicons.org/javascript/000000" },
    { name: "TypeScript", logo: "https://cdn.simpleicons.org/typescript/000000" },
    { name: "Next.js", logo: "https://cdn.simpleicons.org/nextdotjs/000000" },
    { name: "Tailwind", logo: "https://cdn.simpleicons.org/tailwindcss/000000" },
    { name: "Python", logo: "https://cdn.simpleicons.org/python/000000" },
    { name: "Node.js", logo: "https://cdn.simpleicons.org/nodedotjs/000000" },
    { name: "Git", logo: "https://cdn.simpleicons.org/git/000000" },
  ], []);

  // Use distinct marquee rows
  const marqueeRows = useMemo(() => [
    { speed: 20, direction: "left", rotate: 2 },
    { speed: 25, direction: "right", rotate: -1 },
    { speed: 15, direction: "left", rotate: 1 },
  ], []);

  return (
    <section 
      ref={containerRef}
      id="about" 
      className="relative min-h-screen py-24 sm:py-32 px-4 md:px-8 overflow-hidden font-sans"
    >
      {/* --- BACKGROUND (Clean Monochrome) --- */}
      <div className="absolute inset-0 -z-20 overflow-hidden pointer-events-none">
        <div className={`absolute inset-0 transition-colors duration-700 ${isLight ? 'bg-white' : 'bg-black'}`} />
        <div 
            className="absolute inset-0 opacity-[0.03]" 
            style={{ 
                backgroundImage: `linear-gradient(${isLight ? '#000' : '#fff'} 1px, transparent 1px), linear-gradient(90deg, ${isLight ? '#000' : '#fff'} 1px, transparent 1px)`, 
                backgroundSize: '40px 40px' 
            }} 
        />
      </div>

      {/* --- MARQUEE BACKGROUND (Parallax) --- */}
      <motion.div 
        style={{ y: yBg }}
        className="absolute inset-0 -z-10 flex flex-col justify-center gap-20 opacity-[0.03] pointer-events-none select-none overflow-hidden"
      >
        {marqueeRows.map((row, idx) => (
          <div 
            key={idx}
            style={{ transform: `rotate(${row.rotate}deg)` }}
            className="w-[120vw] -ml-[10vw]"
          >
             <Marquee speed={row.speed} direction={row.direction} gradient={false}>
                {techStack.map((tech, i) => (
                   <div key={i} className="mx-12">
                      <img 
                        src={tech.logo} 
                        alt={tech.name} 
                        className={`w-16 h-16 object-contain ${!isLight && 'invert'}`} // Invert for dark mode
                      />
                   </div>
                ))}
             </Marquee>
          </div>
        ))}
      </motion.div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* --- HEADER --- */}
        <div className="text-center mb-16 md:mb-24">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-7xl font-extrabold tracking-tighter mb-6 font-heading"
          >
             <span className={`bg-clip-text text-transparent ${
                isLight 
                    ? 'bg-gradient-to-b from-black to-gray-600' 
                    : 'bg-gradient-to-b from-white to-gray-500'
            }`}>
                About Me
            </span>
          </motion.h1>
          <motion.div 
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2 }}
            className={`h-px w-32 mx-auto ${isLight ? 'bg-black' : 'bg-white'}`} 
          />
        </div>

        {/* --- CONTENT GRID --- */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            
            {/* PHOTO COLUMN */}
            <motion.div 
                initial={{ opacity: 0, x: isMobile ? 0 : -50, y: isMobile ? 50 : 0 }}
                whileInView={{ opacity: 1, x: 0, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className={`order-1 ${isMobile ? 'order-1' : 'lg:order-2'} flex justify-center lg:justify-end`}
            >
                <div className="relative group">
                    {/* Frame Border Effect */}
                    <div className={`absolute -inset-4 border transition-all duration-500 rounded-2xl ${
                        isLight ? 'border-black/5 group-hover:border-black/20' : 'border-white/5 group-hover:border-white/20'
                    }`} />
                    
                    {/* Photo Container */}
                    <div className={`relative w-72 h-72 sm:w-80 sm:h-80 md:w-96 md:h-96 rounded-xl overflow-hidden shadow-2xl transition-all duration-500 transform group-hover:scale-[1.02] ${
                        isLight ? 'shadow-black/10' : 'shadow-white/5'
                    }`}>
                        {/* Overlay Gradient */}
                        <div className={`absolute inset-0 z-10 opacity-20 group-hover:opacity-0 transition-opacity duration-500 ${
                            isLight ? 'bg-black' : 'bg-black' // Subtle dimming
                        }`} />

                        <img 
                            src="/img/avatar2.png" 
                            alt="Rafaditya Syahputra" 
                            className="w-full h-full object-cover md:grayscale group-hover:grayscale-0 transition-all duration-700"
                        />
                    </div>

                    {/* Decorative Geometric Shapes (Monochrome) */}
                    <div className={`absolute -bottom-6 -left-6 w-24 h-24 border-b-2 border-l-2 rounded-bl-3xl transition-all duration-500 ${
                        isLight ? 'border-black group-hover:translate-x-2 group-hover:-translate-y-2' : 'border-white group-hover:translate-x-2 group-hover:-translate-y-2'
                    }`} />
                    <div className={`absolute -top-6 -right-6 w-24 h-24 border-t-2 border-r-2 rounded-tr-3xl transition-all duration-500 ${
                        isLight ? 'border-black group-hover:-translate-x-2 group-hover:translate-y-2' : 'border-white group-hover:-translate-x-2 group-hover:translate-y-2'
                    }`} />
                </div>
            </motion.div>

            {/* TEXT COLUMN */}
            <motion.div 
                initial={{ opacity: 0, x: isMobile ? 0 : 50, y: isMobile ? 50 : 0 }}
                whileInView={{ opacity: 1, x: 0, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                className={`order-2 ${isMobile ? 'order-2' : 'lg:order-1'} space-y-8 text-center lg:text-left`}
            >
                <div>
                    <h2 className={`text-3xl md:text-4xl font-bold mb-2 ${isLight ? 'text-black' : 'text-white'}`}>
                        Rafaditya Syahputra
                    </h2>
                    <p className={`text-lg md:text-xl font-medium tracking-wide ${isLight ? 'text-gray-500' : 'text-gray-400'}`}>
                        Front End Developer
                    </p>
                </div>

                <div className={`space-y-6 text-base md:text-lg leading-relaxed ${isLight ? 'text-gray-700' : 'text-gray-300'}`}>
                    <p>
                        Hao! Saya Rafaditya Syahputra, seorang Front End Developer dengan passion dalam menciptakan solusi digital yang inovatif dan efisien. 
                        Dengan pengalaman lebih dari 2 tahun, saya fokus membangun aplikasi web yang fungsional dengan antarmuka yang bersih.
                    </p>
                    <p>
                        Saat ini saya berusia 17 tahun dan sedang menempuh pendidikan di <span className={`font-semibold ${isLight ? 'text-black' : 'text-white'}`}>SMKN 13 Bandung</span>, 
                        jurusan Rekayasa Perangkat Lunak. Saya juga aktif berkontribusi pada proyek open-source untuk terus mengasah skill.
                    </p>
                </div>

                {/* Info Cards (Grid) */}
                <div className="grid grid-cols-2 gap-4 pt-4">
                    {[
                        { label: "Experience", value: "2+ Years" },
                        { label: "Location", value: "Bandung, ID" },
                        { label: "Age", value: "17 Years" },
                        { label: "Status", value: "Student" }
                    ].map((item, idx) => (
                        <div key={idx} className={`p-4 rounded-lg border text-center transition-colors hover:border-current ${
                            isLight 
                                ? 'bg-gray-50 border-gray-200 hover:text-black hover:bg-white' 
                                : 'bg-white/5 border-white/10 hover:text-white hover:bg-white/10'
                        }`}>
                            <div className={`text-xs uppercase tracking-wider mb-1 ${isLight ? 'text-gray-500' : 'text-gray-400'}`}>{item.label}</div>
                            <div className={`text-lg font-bold ${isLight ? 'text-black' : 'text-white'}`}>{item.value}</div>
                        </div>
                    ))}
                </div>

                {/* CTA Button */}
                <div className="pt-6 flex justify-center lg:justify-start">
                    <a
                        href="/file/CV_Rafaditya_Syahputra2026.pdf"
                        download
                        className={`group relative inline-flex items-center justify-center px-8 py-3.5 text-base font-bold tracking-wide transition-all duration-300 rounded-full overflow-hidden ${
                            isLight 
                                ? 'bg-black text-white hover:bg-gray-800' 
                                : 'bg-white text-black hover:bg-gray-200'
                        }`}
                    >
                        <span className="relative z-10 flex items-center gap-2">
                            Download CV
                            <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-y-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                        </span>
                    </a>
                </div>
            </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;