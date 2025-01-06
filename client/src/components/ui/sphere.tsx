import { useEffect, useRef } from "react";
import { Logo } from "./logo";

export function AnimatedSphere() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let frame = 0;

    const drawHexagon = (x: number, y: number, size: number, fillStyle: string) => {
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI) / 3;
        const nextX = x + size * Math.cos(angle);
        const nextY = y + size * Math.sin(angle);
        if (i === 0) {
          ctx.moveTo(nextX, nextY);
        } else {
          ctx.lineTo(nextX, nextY);
        }
      }
      ctx.closePath();
      ctx.fillStyle = fillStyle;
      ctx.fill();
    };

    const animate = () => {
      frame += 0.02;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = 100;

      // Get the computed primary color from CSS
      const primaryColor = getComputedStyle(document.documentElement)
        .getPropertyValue('--primary')
        .trim();

      // Create gradient using the primary color
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, `hsl(${primaryColor})`);
      gradient.addColorStop(0.5, `hsl(${primaryColor})`);
      gradient.addColorStop(1, `hsl(${primaryColor})`);

      // Draw rotating hexagons
      for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2 + frame;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;

        // Make hexagons slightly smaller than the original circles
        drawHexagon(x, y, 8, gradient);
      }

      requestAnimationFrame(animate);
    };

    const observer = new MutationObserver(() => {
      // Re-render when theme changes
      animate();
    });

    // Watch for theme changes
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class', 'style']
    });

    animate();

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className="relative w-full max-w-[300px] mx-auto">
      <canvas
        ref={canvasRef}
        width={300}
        height={300}
        className="w-full h-auto"
      />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <Logo className="w-16 h-16" />
      </div>
    </div>
  );
}