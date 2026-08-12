"use client";

import { useEffect, useRef, useState } from "react";

export default function SpaceAntiGravityChatLoader({
  activeChatId,
  activeChat,
  viewMode,
  onComplete,
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const canvasRef = useRef(null);
  const prevKeyRef = useRef(null);

  // Key uniquely identifies when a chat session is opened or switched into
  const currentKey = viewMode === "chat" && activeChatId ? `${activeChatId}` : null;

  useEffect(() => {
    if (currentKey) {
      // Trigger quick transition pulse on key change or initial open
      if (currentKey !== prevKeyRef.current) {
        prevKeyRef.current = currentKey;
        setIsVisible(true);
        setIsFadingOut(false);

        const fadeTimer = setTimeout(() => {
          setIsFadingOut(true);
        }, 1500);

        const hideTimer = setTimeout(() => {
          setIsVisible(false);
          setIsFadingOut(false);
          if (onComplete) onComplete();
        }, 2000);

        return () => {
          clearTimeout(fadeTimer);
          clearTimeout(hideTimer);
        };
      }
    } else {
      prevKeyRef.current = null;
      setIsVisible(false);
    }
  }, [currentKey, onComplete]);

  // Anti-gravity Canvas Particle System (Upward Zero-G Float)
  useEffect(() => {
    if (!isVisible) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let animationFrameId;

    const setCanvasSize = () => {
      canvas.width = canvas.offsetWidth || window.innerWidth;
      canvas.height = canvas.offsetHeight || window.innerHeight;
    };
    setCanvasSize();

    // Create zero-gravity floating particles moving upwards against gravity
    const particleCount = 35;
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 2.2 + 0.6,
      speedY: -(Math.random() * 1.8 + 0.6), // Anti-gravity float direction
      speedX: (Math.random() - 0.5) * 0.7,
      alpha: Math.random() * 0.85 + 0.15,
      pulseSpeed: Math.random() * 0.03 + 0.01,
      pulseDir: Math.random() > 0.5 ? 1 : -1,
      color:
        Math.random() > 0.5
          ? "#06b6d4" // Cyan
          : Math.random() > 0.5
            ? "#a855f7" // Purple
            : "#10b981", // Emerald neon
    }));

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.y += p.speedY; // Floating upwards against gravity
        p.x += Math.sin(p.y * 0.02) * p.speedX; // Soft zero-g wave drift

        // Respawn particle at bottom when reaching top
        if (p.y < -10) {
          p.y = canvas.height + 10;
          p.x = Math.random() * canvas.width;
        }

        // Alpha pulsing star effect
        p.alpha += p.pulseSpeed * p.pulseDir;
        if (p.alpha > 0.95) p.pulseDir = -1;
        if (p.alpha < 0.15) p.pulseDir = 1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, Math.min(1, p.alpha));
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    const handleResize = () => setCanvasSize();
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  const chatTitle =
    activeChat?.title ||
    activeChat?.character?.name ||
    activeChat?.name ||
    "Cosmic Neural Session";

  return (
    <div
      onClick={() => setIsVisible(false)}
      className={`fixed inset-0 z-[9999] pointer-events-auto cursor-pointer flex flex-col items-center justify-center overflow-hidden select-none transition-all duration-500 ease-out ${isFadingOut ? "opacity-0 scale-105 pointer-events-none" : "opacity-100 scale-100"
        }`}
      style={{
        background:
          "radial-gradient(ellipse at center, rgba(15, 23, 42, 0.94) 0%, rgba(3, 7, 18, 0.97) 75%, #030712 100%)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
      }}
    >
      {/* Zero-G Floating Particle Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none w-full h-full" />

      {/* Ambient Cosmic Nebula Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] bg-gradient-to-tr from-cyan-500/20 via-purple-600/25 to-pink-500/15 rounded-full blur-[120px] pointer-events-none animate-pulse-glow" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] h-[320px] bg-cyan-400/20 rounded-full blur-[90px] pointer-events-none" />

      {/* Cyber Space HUD Corner Markers */}
      <div className="absolute top-6 left-6 text-[11px] font-mono tracking-widest text-cyan-400/70 uppercase flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
        <span>[ ZERO-G WARP DRIVE ]</span>
      </div>
      <div className="absolute top-6 right-6 text-[11px] font-mono tracking-widest text-purple-400/70 uppercase">
        <span>NEXTAICHAT • ONLINE</span>
      </div>
      <div className="absolute bottom-6 left-6 text-[10px] font-mono tracking-widest text-cyan-400/40 uppercase hidden sm:block">
        <span>GRAVITY: 0.00 G // ORBITAL SYNC OK</span>
      </div>
      <div className="absolute bottom-6 right-6 text-[10px] font-mono tracking-widest text-slate-400/60 uppercase hidden sm:block">
        <span>TAP ANYWHERE TO SKIP</span>
      </div>

      {/* Main Floating Anti-Gravity Container */}
      <div className="relative z-10 flex flex-col items-center justify-center p-6 text-center animate-float-slow">

        {/* Anti-Gravity Orbital Energy Rings */}
        <div className="relative flex items-center justify-center mb-6">
          {/* Conic Rotating Energy Aura */}
          <div className="absolute -inset-7 rounded-full bg-gradient-to-r from-cyan-500 via-purple-500 to-emerald-400 p-[2px] animate-orbit opacity-75 blur-[2px]" />
          <div className="absolute -inset-4 rounded-full border border-dashed border-cyan-400/40 animate-orbit-reverse" />

          {/* Inner Glow Container */}
          <div className="absolute -inset-2 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 blur-sm" />

          {/* Logo Card Frame */}
          <div className="relative px-8 py-5 rounded-2xl bg-slate-950/85 border border-cyan-500/40 backdrop-blur-md shadow-[0_0_45px_rgba(6,182,212,0.45)] flex items-center justify-center overflow-hidden">

            {/* Shimmer light sweep passing across logo */}
            <div
              className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-cyan-300/30 to-transparent pointer-events-none"
              style={{
                animation: "spaceShimmer 1.8s cubic-bezier(0.4, 0, 0.6, 1) infinite"
              }}
            />

            <img
              src="/logo-landspace.png"
              alt="NextAiChat Logo"
              className="h-20 sm:h-20 w-auto object-contain drop-shadow-[0_0_30px_rgba(6,182,212,0.85)] filter transition-all duration-300"
            />
          </div>
        </div>

        {/* Useful Info Capsule Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono tracking-wider uppercase mb-3 shadow-[0_0_20px_rgba(6,182,212,0.25)]">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          <span>
            ✦ {activeChat?.category || activeChat?.character?.category ? (activeChat?.category || activeChat?.character?.category).toUpperCase() : (activeChat?.userPersonaName ? `PLAYING AS: ${activeChat.userPersonaName.toUpperCase()}` : "NEXTAICHAT AI SESSION")} ✦
          </span>
        </div>

        {/* Chat / Character Title */}
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 via-white to-purple-200 mb-2 max-w-md truncate px-4 drop-shadow-[0_0_20px_rgba(255,255,255,0.35)]">
          {chatTitle}
        </h2>

        {/* Useful Status Subtitle / Character Tagline / Persona Info */}
        <p className="text-xs sm:text-sm text-cyan-200/80 font-mono tracking-wide mb-6 max-w-md truncate px-4">
          {activeChat?.character?.tagline
            ? `"${activeChat.character.tagline}"`
            : activeChat?.userPersonaName
              ? `Playing as ${activeChat.userPersonaName} • Ready to roleplay`
              : "💡 Tip: Customize your 'Me Persona' in Settings for tailored responses"}
        </p>

        {/* Neon Progress Bar */}
        <div className="w-52 sm:w-64 h-1.5 bg-slate-900/90 rounded-full overflow-hidden border border-cyan-500/40 p-[1px] shadow-[0_0_20px_rgba(6,182,212,0.3)]">
          <div
            className="h-full bg-gradient-to-r from-cyan-400 via-purple-400 to-emerald-400 rounded-full"
            style={{
              animation: "spaceBarFill 4.8s cubic-bezier(0.16, 1, 0.3, 1) forwards"
            }}
          />
        </div>

      </div>

      {/* Custom inline animation keyframes */}
      <style jsx>{`
        @keyframes spaceShimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        @keyframes spaceBarFill {
          0% { width: 0%; }
          100% { width: 100%; }
        }
      `}</style>
    </div>
  );
}
