import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { navlinks } from '../../constant'

const Navbar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [themeMode, setThemeMode] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") || document.documentElement.getAttribute("data-theme") || "dark";
    }
    return "dark";
  });
  
  const isLight = themeMode === 'light';

  useEffect(() => {
    const updateTheme = () => {
        const current = document.documentElement.getAttribute("data-theme") || "dark";
        setThemeMode(current);
    };
    updateTheme();
    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => observer.disconnect();
  }, []);

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Scroll handler
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Lock body scroll when menu is open
  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isSidebarOpen]);

  const toggleSidebar = useCallback(() => setIsSidebarOpen(prev => !prev), [])
  const closeSidebar = useCallback(() => setIsSidebarOpen(false), [])

  const toggleThemeMode = useCallback(() => {
    const newTheme = themeMode === 'dark' ? 'light' : 'dark'
    setThemeMode(newTheme)
    document.documentElement.dataset.theme = newTheme
    localStorage.setItem('theme', newTheme)
  }, [themeMode])

  // --- DESKTOP NAVBAR ---
  const DesktopNavbar = () => (
    <nav className="hidden md:flex fixed top-6 left-0 right-0 z-50 justify-center px-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={`relative flex items-center px-2 py-2 rounded-full border backdrop-blur-xl transition-all duration-300 ${
            isLight 
                ? 'bg-white/80 border-gray-200 shadow-lg shadow-gray-200/50' 
                : 'bg-black/80 border-white/10 shadow-xl shadow-black/50'
        }`}
      >
        <a href="#home" className="pl-4 pr-6 flex items-center">
            <img 
                src="/img/logo2.png" 
                alt="Logo" 
                className={`h-10 w-auto object-contain transition-all duration-300 hover:scale-110 ${isLight ? 'invert' : ''}`} 
            />
        </a>
        <div className={`w-px h-6 mr-2 ${isLight ? 'bg-gray-200' : 'bg-white/10'}`} />
        <ul className="flex items-center gap-1">
            {navlinks.map((link) => (
                <li key={link.id}>
                    <a 
                        href={link.link}
                        className={`relative px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                            isLight
                                ? 'text-gray-600 hover:text-black hover:bg-gray-200'
                                : 'text-gray-400 hover:text-white hover:bg-gray-700'
                        }`}
                    >
                        {link.text}
                    </a>
                </li>
            ))}
        </ul>
        <button 
            onClick={toggleThemeMode}
            className={`ml-4 p-2 rounded-full transition-all duration-300 ${
                isLight 
                    ? 'bg-gray-100 text-black hover:bg-gray-200' 
                    : 'bg-white/10 text-white hover:bg-white/20'
            }`}
        >
            {isLight ? (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
            ) : (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            )}
        </button>
      </motion.div>
    </nav>
  )

  // --- MOBILE HEADER (Floating Minimalist) ---
  const MobileHeader = () => (
    <header 
        className={`md:hidden fixed top-0 left-0 right-0 z-[60] px-6 py-4 flex items-center justify-between transition-all duration-300 ${
            scrolled
                ? (isLight ? 'bg-white/80 backdrop-blur-lg border-b border-gray-200' : 'bg-black/80 backdrop-blur-lg border-b border-white/10')
                : 'bg-transparent'
        }`}
    >
        {/* Logo */}
        <a href="#home" className="relative z-[70]">
            <img 
                src="/img/logo2.png" 
                alt="Logo" 
                className={`h-8 w-auto object-contain transition-all duration-300 ${
                    // Jika menu terbuka, logo menyesuaikan warna background menu (biasanya gelap/terang penuh)
                    // Jika tidak, ikuti tema
                    isSidebarOpen 
                        ? (isLight ? 'invert' : '') // Di menu fullscreen, sesuaikan juga
                        : (isLight ? 'invert' : '') 
                }`} 
            />
        </a>

        {/* Controls */}
        <div className="flex items-center gap-4 relative z-[70]">
            {/* Theme Toggle */}
            <button 
                onClick={toggleThemeMode}
                className={`p-2 rounded-full transition-all active:scale-90 ${
                    isLight ? 'text-black bg-gray-100' : 'text-white bg-white/10'
                }`}
            >
                {isLight ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
                ) : (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                )}
            </button>

            {/* Hamburger Button (Modern) */}
            <button 
                onClick={toggleSidebar}
                className={`p-2 rounded-full transition-all active:scale-90 ${
                    isLight ? 'bg-black text-white' : 'bg-white text-black'
                }`}
                aria-label="Menu"
            >
                <div className="w-6 h-6 flex flex-col justify-center items-center gap-[5px]">
                    <span className={`block w-5 h-[2px] bg-current rounded-full transition-all duration-300 ${isSidebarOpen ? 'rotate-45 translate-y-[3.5px]' : ''}`} />
                    <span className={`block w-5 h-[2px] bg-current rounded-full transition-all duration-300 ${isSidebarOpen ? '-rotate-45 -translate-y-[3.5px]' : ''}`} />
                </div>
            </button>
        </div>
    </header>
  )

  // --- MOBILE FULLSCREEN MENU ---
  const MobileMenu = () => (
    <AnimatePresence>
        {isSidebarOpen && (
            <motion.div
                initial={{ opacity: 0, y: "-100%" }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: "-100%" }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className={`fixed inset-0 z-[55] flex flex-col justify-center items-center px-6 ${
                    isLight 
                        ? 'bg-white/95 backdrop-blur-xl' 
                        : 'bg-black/95 backdrop-blur-xl'
                }`}
            >
                {/* Decorative Background */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className={`absolute -top-[20%] -left-[20%] w-[70%] h-[70%] rounded-full blur-[100px] opacity-10 ${isLight ? 'bg-black' : 'bg-white'}`} />
                    <div className={`absolute top-[40%] -right-[20%] w-[60%] h-[60%] rounded-full blur-[100px] opacity-10 ${isLight ? 'bg-black' : 'bg-white'}`} />
                </div>

                <nav className="relative z-10 w-full max-w-sm">
                    <ul className="flex flex-col gap-4 text-center">
                        {navlinks.map((link, i) => (
                            <motion.li 
                                key={link.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 + (i * 0.05), duration: 0.4 }}
                            >
                                <a 
                                    href={link.link} 
                                    onClick={closeSidebar}
                                    className={`block text-3xl font-bold tracking-tight transition-all duration-300 hover:scale-105 ${
                                        isLight 
                                            ? 'text-black hover:text-gray-600' 
                                            : 'text-white hover:text-gray-300'
                                    }`}
                                >
                                    {link.text}
                                </a>
                            </motion.li>
                        ))}
                    </ul>
                </nav>

                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="absolute bottom-10 left-0 right-0 text-center"
                >
                </motion.div>
            </motion.div>
        )}
    </AnimatePresence>
  )

  return (
    <>
      <DesktopNavbar />
      <MobileHeader />
      <MobileMenu />
    </>
  )
}

export default Navbar