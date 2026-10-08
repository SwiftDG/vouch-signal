import { useEffect, useRef } from 'react';

export default function MovingWave() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let frame;
    let t = 0;
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const w = canvas.width, h = canvas.height;
      for (let i = 0; i < 80; i++) {
        const p = i / 80;
        ctx.beginPath();
        ctx.strokeStyle = `rgba(${Math.round(168 + 64*p)},${Math.round(69 + 111*p)},${Math.round(81 + 105*p)},${.15 + p*.5})`;
        ctx.lineWidth = .8;
        for (let x = 0; x <= w; x += 2) {
          const q = x / w;
          const y = h*.4 + Math.sin(q*Math.PI*3+t+p*4)*(60+p*80) + Math.sin(q*Math.PI*6+t*1.5+p*2)*(20+p*30) + p*h*.35;
          if (x === 0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
        }
        ctx.stroke();
      }
      t += .008;
      frame = requestAnimationFrame(draw);
    };
    resize(); draw(); window.addEventListener('resize', resize);
    return () => { cancelAnimationFrame(frame); window.removeEventListener('resize', resize); };
  }, []);
  return <canvas ref={canvasRef} className="moving-wave" aria-hidden="true" />;
}
