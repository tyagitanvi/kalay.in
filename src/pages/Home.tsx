import { useEffect, useRef } from "react";
import "./home.css";

const Home = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;

    const mouse = {
      x: -1000,
      y: -1000,
      radius: 180,
    };

    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      baseSize: number;
      opacity: number;
    }

    let particles: Particle[] = [];

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;

      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      createParticles();
    };

    const createParticles = () => {
      const count = Math.min(
        130,
        Math.floor((window.innerWidth * window.innerHeight) / 11000)
      );

      particles = Array.from({ length: count }, () => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,

        vx: (Math.random() - 0.5) * 0.18,
        vy: (Math.random() - 0.5) * 0.18,

        size: Math.random() * 1.5 + 0.5,
        baseSize: Math.random() * 1.5 + 0.5,

        opacity: Math.random() * 0.55 + 0.15,
      }));
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    const draw = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      /*
       * Move particles
       */
      particles.forEach((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Wrap around screen
        if (particle.x < -10) particle.x = window.innerWidth + 10;
        if (particle.x > window.innerWidth + 10) particle.x = -10;

        if (particle.y < -10) particle.y = window.innerHeight + 10;
        if (particle.y > window.innerHeight + 10) particle.y = -10;

        /*
         * Mouse interaction
         */
        const dx = mouse.x - particle.x;
        const dy = mouse.y - particle.y;

        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < mouse.radius) {
          const force = (mouse.radius - distance) / mouse.radius;

          particle.x -= (dx / distance) * force * 0.7;
          particle.y -= (dy / distance) * force * 0.7;

          particle.size = particle.baseSize + force * 2.5;
        } else {
          particle.size +=
            (particle.baseSize - particle.size) * 0.05;
        }
      });

      /*
       * Draw connecting lines
       */
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];

          const dx = a.x - b.x;
          const dy = a.y - b.y;

          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 130) {
            const opacity = (1 - distance / 130) * 0.16;

            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);

            ctx.strokeStyle = `rgba(255,255,255,${opacity})`;
            ctx.lineWidth = 0.5;

            ctx.stroke();
          }
        }
      }

      /*
       * Draw particles
       */
      particles.forEach((particle) => {
        ctx.beginPath();

        ctx.arc(
          particle.x,
          particle.y,
          particle.size,
          0,
          Math.PI * 2
        );

        ctx.fillStyle = `rgba(255,255,255,${particle.opacity})`;

        ctx.fill();
      });

      /*
       * Mouse glow
       */
      if (mouse.x > 0 && mouse.y > 0) {
        const gradient = ctx.createRadialGradient(
          mouse.x,
          mouse.y,
          0,
          mouse.x,
          mouse.y,
          mouse.radius
        );

        gradient.addColorStop(
          0,
          "rgba(255,255,255,0.07)"
        );

        gradient.addColorStop(
          1,
          "rgba(255,255,255,0)"
        );

        ctx.beginPath();

        ctx.arc(
          mouse.x,
          mouse.y,
          mouse.radius,
          0,
          Math.PI * 2
        );

        ctx.fillStyle = gradient;
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    resize();
    draw();

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      cancelAnimationFrame(animationFrameId);

      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <main className="kalay-page">
      <canvas
        ref={canvasRef}
        className="constellation-canvas"
      />

      <div className="noise" />

      <nav className="kalay-nav">
        <div className="logo">
          TANVI<span>.</span>
        </div>

        <div className="nav-links">
          {/* <a href="#work">WORK</a>
          <a href="#lab">LAB</a> */}
          <a href="/ME">PROFILE</a>
        </div>
      </nav>

      <section className="hero">
        <div className="hero-symbol">
          ✦
        </div>

        <p className="eyebrow">
          A DIGITAL ATELIER
        </p>

        <h1>
          Ideas,
          <br />
          <span>made real.</span>
        </h1>

        <p className="hero-description">
          A little corner of the internet where
          curiosity becomes software.
        </p>

        <div className="hero-actions">
          {/* <a href="#work" className="primary-button">
            Explore Kalay
            <span>↗</span>
          </a> */}

          <a href="/ME" className="primary-button">
            Meet me
          </a>
        </div>
      </section>

      {/* <div className="scroll-indicator">
        <span />
        SCROLL TO EXPLORE
      </div> */}
    </main>
  );
};

export default Home;