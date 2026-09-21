import { useEffect, useRef } from "react";
export const ConstellationBackground = () => {
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

    const createParticles = () => {
      const count = Math.min(
        130,
        Math.floor(
          (window.innerWidth * window.innerHeight) / 11000
        )
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

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;

      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      createParticles();
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
      ctx.clearRect(
        0,
        0,
        window.innerWidth,
        window.innerHeight
      );

      /*
       * Move particles
       */
      particles.forEach((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Wrap around screen
        if (particle.x < -10) {
          particle.x = window.innerWidth + 10;
        }

        if (particle.x > window.innerWidth + 10) {
          particle.x = -10;
        }

        if (particle.y < -10) {
          particle.y = window.innerHeight + 10;
        }

        if (particle.y > window.innerHeight + 10) {
          particle.y = -10;
        }

        /*
         * Mouse interaction
         */
        const dx = mouse.x - particle.x;
        const dy = mouse.y - particle.y;

        const distance = Math.sqrt(dx * dx + dy * dy);

        if (
          distance < mouse.radius &&
          distance > 0
        ) {
          const force =
            (mouse.radius - distance) /
            mouse.radius;

          particle.x -=
            (dx / distance) * force * 0.7;

          particle.y -=
            (dy / distance) * force * 0.7;

          particle.size =
            particle.baseSize + force * 2.5;
        } else {
          particle.size +=
            (particle.baseSize - particle.size) *
            0.05;
        }
      });

      /*
       * Connecting lines
       */
      for (let i = 0; i < particles.length; i++) {
        for (
          let j = i + 1;
          j < particles.length;
          j++
        ) {
          const a = particles[i];
          const b = particles[j];

          const dx = a.x - b.x;
          const dy = a.y - b.y;

          const distance = Math.sqrt(
            dx * dx + dy * dy
          );

          if (distance < 130) {
            const opacity =
              (1 - distance / 130) * 0.16;

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
       * Particles
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

        ctx.fillStyle = `rgba(
          255,
          255,
          255,
          ${particle.opacity}
        )`;

        ctx.fill();
      });

      /*
       * Cursor glow
       */
      if (mouse.x > 0 && mouse.y > 0) {
        const gradient =
          ctx.createRadialGradient(
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

      animationFrameId =
        requestAnimationFrame(draw);
    };

    resize();
    draw();

    window.addEventListener("resize", resize);
    window.addEventListener(
      "mousemove",
      handleMouseMove
    );
    window.addEventListener(
      "mouseleave",
      handleMouseLeave
    );

    return () => {
      cancelAnimationFrame(
        animationFrameId
      );

      window.removeEventListener(
        "resize",
        resize
      );

      window.removeEventListener(
        "mousemove",
        handleMouseMove
      );

      window.removeEventListener(
        "mouseleave",
        handleMouseLeave
      );
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Base */}
      <div className="absolute inset-0 bg-[#050811]" />

      {/* Very subtle grid */}
      <div
        className="
          absolute inset-0
          opacity-30
          bg-[linear-gradient(to_right,#1e293b12_1px,transparent_1px),linear-gradient(to_bottom,#1e293b12_1px,transparent_1px)]
          bg-[size:4rem_4rem]
        "
      />

      {/* Orange atmospheric glow */}
      <div
        className="
          absolute
          -top-40
          left-1/4
          w-[500px]
          h-[500px]
          bg-[#FF8A00]/8
          rounded-full
          blur-[140px]
        "
      />

      {/* Cyan atmospheric glow */}
      <div
        className="
          absolute
          top-1/3
          -right-40
          w-[600px]
          h-[600px]
          bg-cyan-600/8
          rounded-full
          blur-[160px]
        "
      />

      {/* Constellation */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      />

      {/* Soft vignette */}
      <div
        className="
          absolute
          inset-0
          bg-[radial-gradient(ellipse_at_center,transparent_35%,#050811_100%)]
        "
      />
    </div>
  );
};