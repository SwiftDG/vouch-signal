import { useEffect, useRef } from "react";

export default function ParticleBurst() {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const particlesRef = useRef([]);
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animId;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      init();
    };

    const init = () => {
      particlesRef.current = [];
      const cx = canvas.width / 2;
      const cy = canvas.height;
      const count = 200;

      for (let i = 0; i < count; i++) {
        const angle = (Math.PI / (count - 1)) * i;
        const length = 200 + Math.random() * 400;
        const colorChoice = Math.random();
        const color =
          colorChoice < 0.5
            ? `rgba(168, 69, 81, ${0.4 + Math.random() * 0.5})`
            : colorChoice < 0.8
              ? `rgba(196, 96, 110, ${0.3 + Math.random() * 0.4})`
              : `rgba(232, 180, 186, ${0.3 + Math.random() * 0.4})`;

        particlesRef.current.push({
          cx,
          cy,
          angle,
          baseLength: length,
          currentLength: length,
          offset: Math.random() * Math.PI * 2,
          speed: 0.4 + Math.random() * 0.8,
          color,
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      timeRef.current += 0.008;
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      particlesRef.current.forEach((p) => {
        // Self-movement
        const sway = Math.sin(timeRef.current * p.speed + p.offset) * 25;
        const targetLength = p.baseLength + sway;

        const ex = p.cx + Math.cos(p.angle) * p.currentLength;
        const ey = p.cy - Math.sin(p.angle) * p.currentLength;
        const dx = ex - mx;
        const dy = ey - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const repelRadius = 150;

        if (dist < repelRadius) {
          const force = (repelRadius - dist) / repelRadius;
          p.currentLength +=
            (targetLength + force * 100 - p.currentLength) * 0.08;
        } else {
          p.currentLength += (targetLength - p.currentLength) * 0.04;
        }

        const ex2 = p.cx + Math.cos(p.angle) * p.currentLength;
        const ey2 = p.cy - Math.sin(p.angle) * p.currentLength;

        ctx.beginPath();
        ctx.moveTo(p.cx, p.cy);
        ctx.lineTo(ex2, ey2);
        ctx.strokeStyle = p.color;
        ctx.lineWidth = 0.8;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(ex2, ey2, 2, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      });

      animId = requestAnimationFrame(draw);
    };

    const handleMouse = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };

    const handleLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 };
    };

    resize();
    draw();
    window.addEventListener("resize", resize);
    canvas.addEventListener("mousemove", handleMouse);
    canvas.addEventListener("mouseleave", handleLeave);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", handleMouse);
      canvas.removeEventListener("mouseleave", handleLeave);
    };
  }, []);

  return (
    <div
      className="mt-20 w-full"
      style={{
        height: "520px",

        marginLeft: "calc(-50vw + 50%)",
        marginRight: "calc(-50vw + 50%)",
        width: "100vw",
      }}
    >
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
}
