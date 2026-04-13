import React, { useState, useRef } from 'react'
import CertificateModal from './CertificateModal'

const CertificationCard = ({ gambar, judul, link, isLight = false }) => {
  const [flipped, setFlipped] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const wrapRef = useRef(null);

  const handleOpenCertificate = (e) => {
    e.stopPropagation();
    setShowModal(true);
  };

  return (
    <>
      <article
        ref={wrapRef}
        onClick={() => setFlipped((v) => !v)}
        className="relative group cursor-pointer w-full"
        style={{ perspective: 1500 }}
      >
        <div
          className="relative w-full transition-all duration-700"
          style={{
            transformStyle: 'preserve-3d',
            transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
          }}
        >
          {/* Front Face — this one is in normal flow so it sets the height */}
          <div
            className={`relative flex flex-col rounded-2xl p-5 border transition-all duration-500 overflow-hidden ${
                isLight 
                    ? 'bg-white/80 border-gray-100 hover:border-gray-300 hover:shadow-lg backdrop-blur-sm' 
                    : 'bg-neutral-900/60 border-white/5 hover:border-white/20 hover:shadow-2xl hover:shadow-white/5 backdrop-blur-md'
            }`}
            style={{ backfaceVisibility: 'hidden' }}
          >
            {/* Image */}
            <div className={`relative w-full aspect-[4/3] rounded-xl overflow-hidden mb-5 flex items-center justify-center ${
                isLight ? 'bg-gray-50' : 'bg-white/5'
            }`}>
              <img 
                src={`/img/${gambar}`} 
                className="w-full h-full object-contain p-3" 
                alt={judul || "Sertifikat"} 
                loading="lazy" 
              />
            </div>

            {/* Title */}
            <h3 className={`text-sm font-semibold tracking-tight leading-snug text-center mb-5 ${
                isLight ? 'text-gray-900' : 'text-white'
            }`}>
              {judul}
            </h3>

            {/* Action */}
            <div className="mt-auto flex flex-col items-center gap-2">
              <div className={`px-4 py-2 rounded-lg text-[10px] font-semibold uppercase tracking-widest transition-all duration-300 ${
                  isLight 
                      ? 'bg-black text-white hover:bg-gray-800' 
                      : 'bg-white/10 text-white border border-white/10 hover:bg-white/20'
              }`}>
                View Details
              </div>
              <span className={`text-[9px] uppercase tracking-[0.2em] opacity-30 ${isLight ? 'text-black' : 'text-white'}`}>
                Tap to flip
              </span>
            </div>
          </div>

          {/* Back Face — absolutely positioned, overlays the front */}
          <div
            className={`absolute inset-0 flex flex-col items-center justify-center rounded-2xl p-6 text-center border transition-all duration-500 ${
                isLight 
                    ? 'bg-white border-gray-100 shadow-xl' 
                    : 'bg-neutral-900 border-white/10 shadow-2xl backdrop-blur-xl'
            }`}
            style={{ transform: 'rotateY(180deg)', backfaceVisibility: 'hidden' }}
          >
            <div className="flex flex-col items-center w-full">
              <div className={`h-1 w-16 rounded-full mb-6 ${isLight ? 'bg-black/10' : 'bg-white/10'}`} />
              
              <h2 className={`text-base font-bold mb-3 tracking-tight ${isLight ? 'text-gray-900' : 'text-white'}`}>
                Certificate Info
              </h2>
              
              <p className={`text-xs mb-8 leading-relaxed ${isLight ? 'text-gray-500' : 'text-gray-400'}`}>
                {judul}
              </p>
              
              {/* Open Certificate — now opens modal */}
              <button 
                onClick={handleOpenCertificate}
                className={`w-full py-2.5 rounded-xl font-bold text-xs text-center transition-all duration-300 flex items-center justify-center gap-2 ${
                    isLight 
                        ? 'bg-black text-white hover:bg-gray-800 active:scale-95' 
                        : 'bg-white text-black hover:bg-gray-200 active:scale-95'
                }`}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                View Certificate
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setFlipped(false);
                }}
                className={`mt-4 text-[10px] font-medium uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity ${
                    isLight ? 'text-black' : 'text-white'
                }`}
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      </article>

      {/* Certificate Modal */}
      <CertificateModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        gambar={gambar}
        judul={judul}
        isLight={isLight}
      />
    </>
  )
}

export default CertificationCard