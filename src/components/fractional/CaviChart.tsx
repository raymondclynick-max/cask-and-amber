// CaviChart.tsx
"use client";
import dynamic from "next/dynamic";
const ResponsiveContainer = dynamic(()=>import("recharts").then(m=>m.ResponsiveContainer),{ssr:false});
const AreaChart = dynamic(()=>import("recharts").then(m=>m.AreaChart),{ssr:false});
const Area = dynamic(()=>import("recharts").then(m=>m.Area),{ssr:false});
const XAxis = dynamic(()=>import("recharts").then(m=>m.XAxis),{ssr:false});
const YAxis = dynamic(()=>import("recharts").then(m=>m.YAxis),{ssr:false});
const Tooltip = dynamic(()=>import("recharts").then(m=>m.Tooltip),{ssr:false});
const data = Array.from({length: 180}, (_,i)=>({t:i, v: 100 + 12*Math.sin(i/8) + i*0.2}));
export default function CaviChart(){
  return (
    <div className="h-64">
      <ResponsiveContainer>
        <AreaChart data={data}>
          <XAxis dataKey="t" hide /><YAxis width={60} /><Tooltip />
          <Area dataKey="v" type="monotone" fillOpacity={0.25} strokeWidth={2}/>
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
