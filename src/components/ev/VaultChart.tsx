"use client";
import dynamic from "next/dynamic";
const ResponsiveContainer = dynamic(() => import("recharts").then(m => m.ResponsiveContainer), { ssr: false });
const AreaChart = dynamic(() => import("recharts").then(m => m.AreaChart), { ssr: false });
const XAxis = dynamic(() => import("recharts").then(m => m.XAxis), { ssr: false });
const YAxis = dynamic(() => import("recharts").then(m => m.YAxis), { ssr: false });
const Tooltip = dynamic(() => import("recharts").then(m => m.Tooltip), { ssr: false });
const Area = dynamic(() => import("recharts").then(m => m.Area), { ssr: false });


const gen = () => Array.from({ length: 32 }, (_, i) => ({ d: i + 1, v: 1000 + Math.round(Math.sin(i / 3) * 70 + i * 6 + Math.random() * 30) }));
export const demoData = gen();


export function VaultChart({ data = demoData }: { data?: { d: number; v: number }[] }) {
return (
<div className="h-[180px] md:h-[220px]">
<ResponsiveContainer width="100%" height="100%">
<AreaChart data={data} margin={{ top: 6, right: 6, left: 0, bottom: 0 }}>
<defs>
<linearGradient id="goldGrad" x1="0" x2="0" y1="0" y2="1">
<stop offset="0%" stopColor="#d8ba74" stopOpacity={0.55} />
<stop offset="100%" stopColor="#d8ba74" stopOpacity={0.0} />
</linearGradient>
</defs>
<XAxis dataKey="d" tickLine={false} axisLine={false} tick={{ fill: "#8b857a", fontSize: 10 }} />
<YAxis hide domain={["dataMin - 50", "dataMax + 50"]} />
<Tooltip contentStyle={{ background: "#151515", border: "1px solid rgba(216,186,116,0.38)", borderRadius: 12, color: "#f3efe9" }} labelStyle={{ color: "#bdb6ac" }} />
<Area type="monotone" dataKey="v" stroke="#d8ba74" strokeWidth={1.6} fill="url(#goldGrad)" />
</AreaChart>
</ResponsiveContainer>
</div>
);
}