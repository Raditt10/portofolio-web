import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CertificateModal = ({ isOpen, onClose, gambar, judul, isLight = false }) => {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [initialPinchDistance, setInitialPinchDistance] = useState(null);
  const [initialScale, setInitialScale] = useState(1);
  const containerRef = useRef(null);
  const imageRef = useRef(null);

  const MIN_SCALE = 1;
  const MAX_SCALE = 5;

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setScale(1);
      setPosition({ x: 0, y: 0 });
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Mouse wheel zoom — must use non-passive listener so preventDefault works
  useEffect(() => {
    const el = containerRef.current;
    if (!el || !isOpen) return;

    const onWheel = (e) => {
      e.preventDefault();
      e.stopPropagation();
      const delta = e.deltaY > 0 ? -0.2 : 0.2;
      setScale(prev => {
        const newScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, prev + delta));
        if (newScale <= 1) setPosition({ x: 0, y: 0 });
        return newScale;
      });
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [isOpen]);

  // Mouse drag for panning
  const handleMouseDown = (e) => {
    if (scale <= 1) return;
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = useCallback((e) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  }, [isDragging, dragStart]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Touch events for mobile pinch-to-zoom and pan
  const getTouchDistance = (touches) => {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const handleTouchStart = (e) => {
    if (e.touches.length === 2) {
      e.preventDefault();
      setInitialPinchDistance(getTouchDistance(e.touches));
      setInitialScale(scale);
    } else if (e.touches.length === 1 && scale > 1) {
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - position.x,
        y: e.touches[0].clientY - position.y,
      });
    }
  };

  const handleTouchMove = useCallback((e) => {
    if (e.touches.length === 2 && initialPinchDistance !== null) {
      e.preventDefault();
      const currentDistance = getTouchDistance(e.touches);
      const ratio = currentDistance / initialPinchDistance;
      const newScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, initialScale * ratio));
      setScale(newScale);
      if (newScale <= 1) setPosition({ x: 0, y: 0 });
    } else if (e.touches.length === 1 && isDragging && scale > 1) {
      setPosition({
        x: e.touches[0].clientX - dragStart.x,
        y: e.touches[0].clientY - dragStart.y,
      });
    }
  }, [initialPinchDistance, initialScale, isDragging, dragStart, scale]);

  const handleTouchEnd = useCallback(() => {
    setInitialPinchDistance(null);
    setIsDragging(false);
  }, []);

  // Double-click/tap to toggle zoom
  const handleDoubleClick = (e) => {
    e.preventDefault();
    if (scale > 1) {
      setScale(1);
      setPosition({ x: 0, y: 0 });
    } else {
      setScale(2.5);
    }
  };

  // Keyboard: Escape to close, +/- to zoom
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === '+' || e.key === '=') {
        setScale(prev => Math.min(MAX_SCALE, prev + 0.3));
      }
      if (e.key === '-') {
        setScale(prev => {
          const newS = Math.max(MIN_SCALE, prev - 0.3);
          if (newS <= 1) setPosition({ x: 0, y: 0 });
          return newS;
        });
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Zoom button handlers
  const zoomIn = () => setScale(prev => Math.min(MAX_SCALE, prev + 0.5));
  const zoomOut = () => {
    setScale(prev => {
      const newS = Math.max(MIN_SCALE, prev - 0.5);
      if (newS <= 1) setPosition({ x: 0, y: 0 });
      return newS;
    });
  };
  const resetZoom = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  const zoomPercent = Math.round(scale * 100);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[9999] flex flex-col"
          style={{ touchAction: 'none' }}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/90 backdrop-blur-xl"
            onClick={onClose}
          />

          {/* Top Bar */}
          <motion.div
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -30, opacity: 0 }}
            transition={{ delay: 0.1, duration: 0.3 }}
            className="relative z-10 flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4"
            style={{
              background: 'linear-gradient(to bottom, rgba(0,0,0,0.8), transparent)',
            }}
          >
            {/* Title */}
            <div className="flex-1 min-w-0 mr-4">
              <h3 className="text-white text-sm sm:text-base font-semibold truncate">
                {judul}
              </h3>
              <p className="text-white/40 text-[10px] sm:text-xs mt-0.5">Certificate Preview</p>
            </div>

            {/* Close */}
            <button
              onClick={onClose}
              className="flex-shrink-0 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/10 hover:bg-white/20 active:bg-white/30 border border-white/10 flex items-center justify-center transition-all duration-200 group"
              aria-label="Close"
            >
              <svg className="w-5 h-5 text-white/70 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </motion.div>

          {/* Image Container */}
          <div
            ref={containerRef}
            className="relative flex-1 flex items-center justify-center"

            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onDoubleClick={handleDoubleClick}
            style={{ 
              cursor: scale > 1 ? (isDragging ? 'grabbing' : 'grab') : 'zoom-in',
              overflow: 'hidden',
              padding: '8px 16px',
            }}
          >
            {/* Entrance animation wrapper */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              {/* Zoom & Pan wrapper */}
              <div
                style={{
                  transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                  transition: isDragging ? 'none' : 'transform 0.2s ease-out',
                  willChange: 'transform',
                  transformOrigin: 'center center',
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <img
                  ref={imageRef}
                  src={`/img/${gambar}`}
                  alt={judul || 'Certificate'}
                  draggable={false}
                  className="rounded-lg select-none"
                  style={{
                    maxWidth: '100%',
                    maxHeight: '100%',
                    width: 'auto',
                    height: 'auto',
                    objectFit: 'contain',
                    boxShadow: '0 25px 80px rgba(0,0,0,0.5), 0 0 1px rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.08)',
                  }}
                />
              </div>
            </motion.div>
          </div>

          {/* Bottom Controls */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 30, opacity: 0 }}
            transition={{ delay: 0.15, duration: 0.3 }}
            className="relative z-10 flex items-center justify-center px-4 py-3 sm:py-4 gap-2 sm:gap-3"
            style={{
              background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
            }}
          >
            {/* Zoom Out */}
            <button
              onClick={zoomOut}
              disabled={scale <= MIN_SCALE}
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed border border-white/10 flex items-center justify-center transition-all duration-200"
              aria-label="Zoom out"
            >
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
              </svg>
            </button>

            {/* Zoom Percentage */}
            <button
              onClick={resetZoom}
              className="h-10 sm:h-11 px-4 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center transition-all duration-200 min-w-[80px]"
              title="Reset zoom"
            >
              <span className="text-white text-xs sm:text-sm font-mono font-medium">{zoomPercent}%</span>
            </button>

            {/* Zoom In */}
            <button
              onClick={zoomIn}
              disabled={scale >= MAX_SCALE}
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed border border-white/10 flex items-center justify-center transition-all duration-200"
              aria-label="Zoom in"
            >
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            </button>

            {/* Divider */}
            <div className="w-px h-6 bg-white/10 mx-1 hidden sm:block" />

            {/* Fit to screen */}
            <button
              onClick={resetZoom}
              className="hidden sm:flex w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 items-center justify-center transition-all duration-200"
              title="Fit to screen"
            >
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
            </button>
          </motion.div>

          {/* Hint text */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="absolute bottom-16 sm:bottom-20 left-1/2 -translate-x-1/2 text-white/25 text-[10px] sm:text-xs text-center pointer-events-none select-none"
          >
            <span className="hidden sm:inline">Scroll to zoom • Double-click to toggle zoom • Drag to pan</span>
            <span className="sm:hidden">Pinch to zoom • Double-tap to toggle • Drag to pan</span>
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CertificateModal;
