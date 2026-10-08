import { useEffect, useRef } from "react";

// Adapted from the wave canvas in the original Vouch ScoreDisplay.
export default function RecordWave() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!context) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame;
    let time = 0;
    let visible = true;

    const resize = () => {
      const { width, height } = canvas.getBoundingClientRect();
      const scale = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * scale);
      canvas.height = Math.round(height * scale);
      context.setTransform(scale, 0, 0, scale, 0, 0);
      draw();
    };

    const draw = () => {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      context.clearRect(0, 0, width, height);
      if (!width || !height) return;

      for (let i = 0; i < 72; i += 1) {
        const depth = i / 72;
        context.beginPath();
        context.strokeStyle = `rgba(${Math.round(168 + depth * 64)},${Math.round(69 + depth * 111)},${Math.round(81 + depth * 105)},${0.12 + depth * 0.38})`;
        context.lineWidth = 0.8;
        for (let x = 0; x <= width + 3; x += 3) {
          const position = x / width;
          const y = height * 0.35
            + Math.sin(position * Math.PI * 3 + time + depth * 4) * (34 + depth * 64)
            + Math.sin(position * Math.PI * 6 + time * 1.5 + depth * 2) * (12 + depth * 22)
            + depth * height * 0.38;
          if (x === 0) context.moveTo(x, y);
          else context.lineTo(x, y);
        }
        context.stroke();
      }
    };

    const animate = () => {
      if (!visible || reducedMotion.matches) return;
      time += 0.008;
      draw();
      frame = window.requestAnimationFrame(animate);
    };
    const update = () => {
      window.cancelAnimationFrame(frame);
      if (visible && !reducedMotion.matches) animate();
      else draw();
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      update();
    });
    observer.observe(canvas);
    window.addEventListener("resize", resize);
    reducedMotion.addEventListener("change", update);
    resize();
    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      reducedMotion.removeEventListener("change", update);
    };
  }, []);

  return <canvas ref={canvasRef} className="record-wave" aria-hidden="true" />;
}
