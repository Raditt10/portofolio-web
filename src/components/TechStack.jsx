import React, { useEffect, useState, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Tech stack data
const techstack = [
  { id: 1, name: "React", category: "Frontend", level: "Intermediate", src: "https://cdn.simpleicons.org/react/61DAFB", color: "#61DAFB" },
  { id: 2, name: "Next.js", category: "Fullstack", level: "Intermediate", src: "https://cdn.simpleicons.org/nextdotjs/000000", color: "#000000" },
  { id: 3, name: "TypeScript", category: "Language", level: "Advanced", src: "https://cdn.simpleicons.org/typescript/3178C6", color: "#3178C6" },
  { id: 4, name: "Tailwind CSS", category: "Frontend", level: "Advanced", src: "https://cdn.simpleicons.org/tailwindcss/06B6D4", color: "#06B6D4" },
  { id: 5, name: "Node.js", category: "Backend", level: "Intermediate", src: "https://cdn.simpleicons.org/nodedotjs/339933", color: "#339933" },
  { id: 6, name: "MongoDB", category: "Database", level: "Intermediate", src: "https://cdn.simpleicons.org/mongodb/47A248", color: "#47A248" },
  { id: 7, name: "Git", category: "Tools", level: "Intermediate", src: "https://cdn.simpleicons.org/git/F05032", color: "#F05032" },
  { id: 8, name: "Docker", category: "DevOps", level: "Intermediate", src: "https://cdn.simpleicons.org/docker/2496ED", color: "#2496ED" },
  { id: 9, name: "AWS", category: "Cloud", level: "Advanced", src: "https://logo.svgcdn.com/logos/aws.svg", color: "#FF9900" },
  { id: 10, name: "GraphQL", category: "Backend", level: "Intermediate", src: "https://cdn.simpleicons.org/graphql/E10098", color: "#E10098" },
  { id: 11, name: "Redux", category: "Frontend", level: "Inteermediate", src: "https://cdn.simpleicons.org/redux/764ABC", color: "#764ABC" },
  { id: 12, name: "Figma", category: "Design", level: "Intermediate", src: "https://cdn.simpleicons.org/figma/F24E1E", color: "#F24E1E" },
  { id: 13, name: "PostgreSQL", category: "Database", level: "Intermediate", src: "https://cdn.simpleicons.org/postgresql/4169E1", color: "#4169E1" },
  { id: 14, name: "Python", category: "Language", level: "Intermediate", src: "https://cdn.simpleicons.org/python/3776AB", color: "#3776AB" },
  { id: 15, name: "Vue.js", category: "Frontend", level: "Intermediate", src: "https://cdn.simpleicons.org/vuedotjs/4FC08D", color: "#4FC08D" },
  { id: 16, name: "PHP", category: "Language", level: "Intermediate", src: "https://cdn.simpleicons.org/php/777BB4", color: "#777BB4" },
  { id: 17, name: "Laravel", category: "Backend", level: "Intermediate", src: "https://cdn.simpleicons.org/laravel/FF2D20", color: "#FF2D20" },
];

const FALLBACK_PLACEHOLDER =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 64 64'><rect width='64' height='64' rx='12' fill='%23222'/><path d='M20 36h24v4H20zm0-8h24v4H20z' fill='%23fff' opacity='0.85'/></svg>";

const TechStack = () => {
  const [theme, setTheme] = useState("dark");
  const [selectedCategory, setSelectedCategory] = useState("All");
  
  // State untuk pencarian & animasi loading
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState(""); 
  const [isSearching, setIsSearching] = useState(false); 
  
  const containerRef = useRef(null);
  const isLight = theme === "light";

  // --- LOGIC DEBOUNCE & LOADING ---
  useEffect(() => {
    setIsSearching(true);
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
      setIsSearching(false);
    }, 500); 

    return () => clearTimeout(handler);
  }, [searchQuery]);

  const categories = useMemo(() => {
    const cats = Array.from(new Set(techstack.map(t => t.category)));
    return ["All", ...cats];
  }, []);

  const filteredTech = useMemo(() => {
    return techstack.filter((tech) => {
      const matchesCategory = selectedCategory === "All" || tech.category === selectedCategory;
      const matchesSearch = tech.name.toLowerCase().includes(debouncedQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, debouncedQuery]);

  useEffect(() => {
    const updateTheme = () => {
      const current = document.documentElement.getAttribute("data-theme") || "dark";
      setTheme(current);
    };
    updateTheme();
    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => observer.disconnect();
  }, []);

  return (
    <section
      className="relative min-h-screen px-4 sm:px-6 py-24 sm:py-32 overflow-hidden font-sans"
      ref={containerRef}
    >
      {/* --- BACKGROUND (Clean Monochrome) --- */}
      <div className="absolute inset-0 -z-20 overflow-hidden pointer-events-none">
        <div className={`absolute inset-0 transition-colors duration-700 ${isLight ? 'bg-white' : 'bg-black'}`} />
        <div 
            className="absolute inset-0 opacity-[0.05]" 
            style={{ 
                backgroundImage: `linear-gradient(${isLight ? '#000' : '#fff'} 1px, transparent 1px), linear-gradient(90deg, ${isLight ? '#000' : '#fff'} 1px, transparent 1px)`, 
                backgroundSize: '40px 40px' 
            }} 
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h1 
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-4 font-heading"
          >
             <span className={`bg-clip-text text-transparent ${
                isLight 
                    ? 'bg-gradient-to-r from-gray-900 via-gray-700 to-gray-500' 
                    : 'bg-gradient-to-r from-white via-gray-200 to-gray-500'
            }`}>
                Tech Stack
            </span>
          </h1>
          <p className={`text-sm font-medium tracking-widest uppercase ${isLight ? 'text-gray-500' : 'text-gray-400'}`}>
            My Weapons of Choice
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-md mx-auto mb-10 z-20">
          <div className="relative group">
             <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${
                isLight ? 'text-gray-400 group-focus-within:text-black' : 'text-gray-500 group-focus-within:text-white'
             }`}>
                {isSearching ? (
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                )}
             </div>
             
             <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search technology..."
                className={`w-full py-4 pl-12 pr-12 rounded-full border outline-none backdrop-blur-md transition-all duration-300 shadow-sm ${
                   isLight 
                    ? 'bg-gray-50 border-gray-200 text-black placeholder-gray-400 focus:border-black focus:ring-1 focus:ring-black'
                    : 'bg-white/5 border-white/10 text-white placeholder-gray-500 focus:border-white/50 focus:ring-1 focus:ring-white/20'
                }`}
             />

             {searchQuery && (
               <button 
                  onClick={() => setSearchQuery('')}
                  className={`absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full transition-all duration-200 ${
                    isLight 
                      ? 'text-gray-400 hover:text-black hover:bg-gray-200'
                      : 'text-gray-500 hover:text-white hover:bg-white/20'
                  }`}
               >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
               </button>
             )}
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-5 py-2 rounded-full text-xs font-bold tracking-wide transition-all duration-300 border ${
                selectedCategory === category
                  ? isLight
                    ? "bg-black text-white border-black"
                    : "bg-white text-black border-white"
                  : isLight
                    ? "bg-transparent text-gray-600 border-gray-200 hover:border-gray-400 hover:text-black"
                    : "bg-transparent text-gray-400 border-white/10 hover:border-white/30 hover:text-white"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* "Mungkin ini yang Anda maksud" Text */}
        {!isSearching && debouncedQuery && filteredTech.length > 0 && (
          <div className="max-w-6xl mx-auto mb-8 px-2 animate-fade-in-up">
             <div className="flex items-center gap-2">
                <span className={`text-sm ${isLight ? 'text-gray-500' : 'text-gray-400'}`}>
                   Found result for:
                </span>
                <span className={`text-sm font-bold px-2 py-0.5 rounded-md ${
                   isLight ? 'bg-gray-100 text-black border border-gray-200' : 'bg-white/10 text-white border border-white/10'
                }`}>
                   "{debouncedQuery}"
                </span>
                <span className={`text-xs ml-auto ${isLight ? 'text-gray-400' : 'text-gray-500'}`}>
                   {filteredTech.length} results
                </span>
             </div>
             <div className={`h-px w-full mt-3 ${isLight ? 'bg-gray-200' : 'bg-white/10'}`} />
          </div>
        )}

        {/* CONTENT AREA */}
        {isSearching ? (
          // SKELETON LOADING
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5 max-w-6xl mx-auto">
            {[...Array(10)].map((_, index) => (
              <div
                key={index}
                className={`flex flex-col items-center p-6 rounded-2xl border animate-pulse ${
                   isLight ? "bg-gray-50 border-gray-200" : "bg-white/5 border-white/5"
                }`}
              >
                <div className={`w-16 h-16 rounded-full mb-4 ${
                   isLight ? "bg-gray-200" : "bg-white/10"
                }`}></div>
                <div className={`h-4 w-20 rounded mb-2 ${
                   isLight ? "bg-gray-200" : "bg-white/10"
                }`}></div>
                <div className={`h-3 w-12 rounded-full ${
                   isLight ? "bg-gray-200" : "bg-white/10"
                }`}></div>
              </div>
            ))}
          </div>
        ) : filteredTech.length > 0 ? (
          // REAL DATA
          <motion.div 
            layout
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5 max-w-6xl mx-auto"
          >
            <AnimatePresence>
                {filteredTech.map((tech) => (
                    <TechCard key={tech.id} tech={tech} isLight={isLight} />
                ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          // EMPTY STATE
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className={`p-4 rounded-full mb-4 ${isLight ? 'bg-gray-100' : 'bg-white/5'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={isLight ? 'text-gray-400' : 'text-gray-500'}>
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </div>
            <h3 className={`text-lg font-bold mb-1 ${isLight ? 'text-black' : 'text-white'}`}>No result found</h3>
            <p className={`text-sm ${isLight ? 'text-gray-500' : 'text-gray-400'}`}>
              Try searching for something else.
            </p>
          </div>
        )}

        {/* Stats Section */}
        <div className="mt-24 pt-8 border-t border-dashed border-gray-200 dark:border-white/10">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {[
              { label: "Technologies", value: techstack.length },
              { label: "Categories", value: categories.length - 1 },
              { label: "Years Exp.", value: "2+" },
              { label: "Projects", value: "7+" },
            ].map((stat, index) => (
              <div
                key={index}
                className="text-center"
              >
                <div className={`text-3xl font-black mb-1 ${isLight ? "text-black" : "text-white"}`}>
                  {stat.value}
                </div>
                <div className={`text-xs font-bold uppercase tracking-wider ${isLight ? "text-gray-500" : "text-gray-500"}`}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// --- SUB-COMPONENT: TECH CARD (With Spotlight & Monochrome Logic) ---
const TechCard = ({ tech, isLight }) => {
    const cardRef = useRef(null);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e) => {
        const rect = cardRef.current.getBoundingClientRect();
        setMousePosition({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        });
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            ref={cardRef}
            onMouseMove={handleMouseMove}
            className={`group relative flex flex-col items-center p-6 rounded-2xl border transition-all duration-300 cursor-pointer overflow-hidden ${
                isLight
                  ? "bg-white border-gray-200 hover:border-black/30 hover:shadow-xl"
                  : "bg-neutral-900 border-neutral-800 hover:border-white/20 hover:shadow-2xl hover:shadow-white/5"
            }`}
        >
            {/* Spotlight Effect */}
            <div 
                className={`absolute inset-0 z-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                style={{
                    background: `radial-gradient(300px circle at ${mousePosition.x}px ${mousePosition.y}px, ${
                        isLight ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.08)'
                    }, transparent 40%)`
                }}
            />

            {/* Icon Container */}
            <div className="relative w-16 h-16 mb-4 z-10 transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-1">
                <img
                    src={tech.src}
                    alt={tech.name}
                    className="w-full h-full object-contain transition-all duration-500 md:grayscale group-hover:grayscale-0"
                    loading="lazy"
                    onError={(e) => {
                        const img = e.currentTarget;
                        if (img.dataset.fallbackApplied) return;
                        img.dataset.fallbackApplied = 'true';
                        img.src = FALLBACK_PLACEHOLDER;
                    }}
                />
            </div>

            {/* Tech Name */}
            <h3 className={`text-base font-bold text-center mb-2 z-10 transition-colors duration-300 ${
                isLight ? 'text-black' : 'text-white'
            }`}>
                {tech.name}
            </h3>

            {/* Level Badge (Monochrome) */}
            <div className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-1 z-10 border ${
                isLight 
                    ? 'bg-gray-100 text-gray-600 border-gray-200' 
                    : 'bg-white/10 text-gray-300 border-white/5'
            }`}>
                {tech.level}
            </div>

            {/* Category */}
            <p className={`text-xs font-medium z-10 ${isLight ? 'text-gray-400' : 'text-gray-600'}`}>
                {tech.category}
            </p>
        </motion.div>
    );
};

export default TechStack;