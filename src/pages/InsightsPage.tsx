import { useState, useEffect, useMemo } from "react";
import { Card } from "@/src/components/ui/card";
import { AlertTriangle, Zap, CheckCircle2 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { motion } from "motion/react";
import insightsData from "@/src/data/insights.json";
import { ThemeToggle } from "@/src/components/ThemeToggle";

export default function InsightsPage() {
  const [data, setData] = useState<any>(null);
  const [activeTimeframe, setActiveTimeframe] = useState("This Month");

  useEffect(() => {
    setTimeout(() => {
      setData(insightsData);
    }, 500);
  }, []);

  const filteredData = useMemo(() => {
    if (!data) return null;
    const multiplier = activeTimeframe === "This Month" ? 1 : activeTimeframe === "Last Month" ? 0.8 : 1.2;

    const newScrapWipTrends = data.scrapWipTrends.map((item: any) => {
      if (item.metric === "Scrap (Lacs)") {
        const bu1Val = Math.round(parseInt(item.bu1.value) * multiplier);
        const bu2Val = Math.round(parseInt(item.bu2.value) * multiplier);
        const bu3Val = Math.round(parseInt(item.bu3.value) * multiplier);
        return {
          ...item,
          bu1: { value: bu1Val.toString(), status: bu1Val > 28 ? 'critical' : bu1Val > 18 ? 'warning' : 'good' },
          bu2: { value: bu2Val.toString(), status: bu2Val > 28 ? 'critical' : bu2Val > 18 ? 'warning' : 'good' },
          bu3: { value: bu3Val.toString(), status: bu3Val > 28 ? 'critical' : bu3Val > 18 ? 'warning' : 'good' }
        };
      }
      return item;
    });

    const dynamicInsights: any[] = [];
    const scrapData = newScrapWipTrends.find((t: any) => t.metric === "Scrap (Lacs)");
    if (scrapData) {
      ['bu1', 'bu2', 'bu3'].forEach(bu => {
        const val = parseInt(scrapData[bu].value);
        const status = scrapData[bu].status;
        const buName = bu.toUpperCase();
        if (status === 'critical') {
          dynamicInsights.push({ type: 'critical', title: `Critical Scrap Level (${buName})`, message: `Scrap value has spiked to ${val} Lacs, requiring immediate attention and root cause analysis.` });
        } else if (status === 'warning') {
          dynamicInsights.push({ type: 'warning', title: `Elevated Scrap (${buName})`, message: `Scrap value is at ${val} Lacs. Monitor closely to prevent further increase.` });
        } else if (status === 'good' && val <= 15) {
          dynamicInsights.push({ type: 'good', title: `Excellent Scrap Control (${buName})`, message: `Scrap value is exceptionally low at ${val} Lacs. Great job maintaining quality standards!` });
        }
      });
    }
    if (dynamicInsights.length < 3) {
      dynamicInsights.push({ type: 'good', title: 'Overall Performance', message: 'Most metrics are tracking well within expected parameters for this timeframe.' });
    }
    const sortedInsights = dynamicInsights.sort((a, b) => {
      const score = { critical: 3, warning: 2, good: 1 };
      return score[b.type as keyof typeof score] - score[a.type as keyof typeof score];
    }).slice(0, 3);

    return { ...data, scrapWipTrends: newScrapWipTrends, keyInsights: sortedInsights };
  }, [data, activeTimeframe]);

  if (!data) return (
    <div className="min-h-full p-4 pb-20 animate-pulse">
      <div className="h-8 w-32 bg-slate-100 rounded-xl mb-6 mt-2"></div>
      <div className="h-64 bg-slate-100 rounded-2xl mb-6"></div>
      <div className="h-48 bg-slate-100 rounded-2xl mb-6"></div>
      <div className="h-48 bg-slate-100 rounded-2xl"></div>
    </div>
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'warning': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'critical': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-slate-50 text-slate-500 border-slate-200';
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'critical': return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'warning': return <Zap className="w-5 h-5 text-amber-500" />;
      case 'good': return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
      default: return null;
    }
  };

  const getAlertBg = (type: string) => {
    switch (type) {
      case 'critical': return 'bg-red-50 border-red-200';
      case 'warning': return 'bg-amber-50 border-amber-200';
      case 'good': return 'bg-emerald-50 border-emerald-200';
      default: return 'bg-white border-[var(--color-border-subtle)]';
    }
  };

  const chartData = [
    { name: 'BU1', scrap: parseInt(filteredData?.scrapWipTrends[0].bu1.value) || 0, status: filteredData?.scrapWipTrends[0].bu1.status },
    { name: 'BU2', scrap: parseInt(filteredData?.scrapWipTrends[0].bu2.value) || 0, status: filteredData?.scrapWipTrends[0].bu2.status },
    { name: 'BU3', scrap: parseInt(filteredData?.scrapWipTrends[0].bu3.value) || 0, status: filteredData?.scrapWipTrends[0].bu3.status },
  ];

  const getBarColor = (status: string) => {
    if (status === 'good') return '#10b981';
    if (status === 'warning') return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div className="min-h-full p-4 pb-20">
      <div className="flex justify-between items-start mb-5 pt-2">
        <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Insights</h1>
        <ThemeToggle />
      </div>

      {/* Filters */}
      <div className="mb-5">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {['This Month', 'Last Month', 'This Quarter'].map(timeframe => (
            <button
              key={timeframe}
              onClick={() => setActiveTimeframe(timeframe)}
              className={`px-4 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all duration-200 active:scale-95 border ${
                activeTimeframe === timeframe
                  ? 'bg-brand-50 border-brand-200 text-brand-700 shadow-sm'
                  : 'bg-white text-slate-500 border-[var(--color-border-subtle)] hover:text-slate-700 hover:border-[var(--color-border-emphasis)]'
              }`}
            >
              {timeframe}
            </button>
          ))}
        </div>
      </div>

      {/* Scrap Chart */}
      <Card className="mb-5 overflow-hidden">
        <div className="px-4 py-3 border-b border-[var(--color-border-subtle)] bg-slate-50/50">
          <h2 className="text-sm font-semibold text-slate-700">Scrap by BU (Lacs)</h2>
        </div>
        <div className="p-4 h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }} />
              <Tooltip
                cursor={{ fill: 'rgba(15,23,42,0.03)' }}
                contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', color: '#0f172a', boxShadow: '0 10px 30px rgba(0,0,0,0.08)' }}
              />
              <Bar dataKey="scrap" radius={[6, 6, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getBarColor(entry.status)} fillOpacity={0.85} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Scrap & WIP Trends Table */}
      <Card className="mb-5 overflow-hidden">
        <div className="px-4 py-3 border-b border-[var(--color-border-subtle)] bg-slate-50/50">
          <h2 className="text-sm font-semibold text-slate-700">Scrap & WIP Trends</h2>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-4 gap-2 mb-4 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            <div>Metric</div>
            <div className="text-center">BU1</div>
            <div className="text-center">BU2</div>
            <div className="text-center">BU3</div>
          </div>
          {filteredData?.scrapWipTrends.map((row: any, i: number) => (
            <div key={i} className="grid grid-cols-4 gap-2 items-center py-2.5 border-b border-[var(--color-border-subtle)] last:border-0">
              <div className="text-xs font-medium text-slate-700">{row.metric}</div>
              {['bu1', 'bu2', 'bu3'].map(bu => (
                <div key={bu} className="flex justify-center">
                  <div className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${getStatusColor(row[bu].status)}`}>
                    {row[bu].value}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </Card>

      {/* Plant Performance */}
      <Card className="mb-5 overflow-hidden">
        <div className="px-4 py-3 border-b border-[var(--color-border-subtle)] bg-slate-50/50">
          <h2 className="text-sm font-semibold text-slate-700">Plant Performance</h2>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-4 gap-2 mb-4 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            <div></div>
            <div className="text-center">BU1</div>
            <div className="text-center">BU2</div>
            <div className="text-center">BU3</div>
          </div>
          {filteredData?.plantPerformance.map((row: any, i: number) => (
            <div key={i} className="grid grid-cols-4 gap-2 items-center py-2.5">
              <div className="text-xs font-medium text-slate-700">{row.plant}</div>
              {['bu1', 'bu2', 'bu3'].map(bu => (
                <div key={bu} className="flex justify-center w-full">
                  <div className={`w-full py-2 rounded-lg text-center text-xs font-bold border ${getStatusColor(row[bu].status)}`}>
                    {row[bu].value}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </Card>

      {/* Key Insights */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-slate-700 mb-3">Key Insights</h2>
        {filteredData?.keyInsights.map((insight: any, i: number) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className={`p-4 rounded-xl border flex items-start gap-3 ${getAlertBg(insight.type)}`}
          >
            <div className="shrink-0 mt-0.5">{getAlertIcon(insight.type)}</div>
            <div>
              <h3 className={`text-sm font-bold mb-1 ${
                insight.type === 'critical' ? 'text-red-700' :
                insight.type === 'warning' ? 'text-amber-700' : 'text-emerald-700'
              }`}>{insight.title}</h3>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">{insight.message}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
