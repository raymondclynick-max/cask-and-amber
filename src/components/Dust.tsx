"use client";
import { useEffect, useRef } from "react";

export default function Dust(){
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current!;
    const count = 64;
    for(let i=0;i<count;i++){
      const s = document.createElement("span");
      const size = Math.random()*2 + 1;       // 1–3px
      const dur  = Math.random()*10 + 12;     // 12–22s
      const left = Math.random()*100;
      const start= Math.random()*100;
      const delay= Math.random()*-dur;
      Object.assign(s.style, {
        position:"absolute",
        left: left+"%",
        top: start+"%",
        width: size+"px",
        height: size+"px",
        borderRadius:"9999px",
        background:"rgba(233,196,143,.55)",
        filter:"blur(.3px)",
        animation: `dustFloat ${dur}s linear ${delay}s infinite`,
      } as CSSStyleDeclaration);
      root.appendChild(s);
    }
    return () => { root.innerHTML = ""; };
  }, []);

  return <div ref={ref} className="pointer-events-none absolute inset-0 overflow-hidden z-0" />;
}
