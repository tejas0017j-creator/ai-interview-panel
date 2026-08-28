import React, { useEffect, useRef } from 'react';

export const CustomCursor: React.FC = () => {
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const cursorRingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let mx = -100;
    let my = -100;
    let rx = -100;
    let ry = -100;
    let animationFrameId: number;

    const handleMouseMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      if (cursorDotRef.current) {
        cursorDotRef.current.style.transform = `translate(${mx - 5}px, ${my - 5}px)`;
      }
    };

    const animateRing = () => {
      rx += (mx - rx - 18) * 0.18;
      ry += (my - ry - 18) * 0.18;
      if (cursorRingRef.current) {
        cursorRingRef.current.style.transform = `translate(${rx}px, ${ry}px)`;
      }
      animationFrameId = requestAnimationFrame(animateRing);
    };

    window.addEventListener('mousemove', handleMouseMove);
    animationFrameId = requestAnimationFrame(animateRing);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <>
      <div id="cursor" ref={cursorDotRef} />
      <div id="cursor-ring" ref={cursorRingRef} />
    </>
  );
};
