import { useState, useEffect, useMemo } from "react";
import { Card } from "@/src/components/ui/card";
import { Progress } from "@/src/components/ui/progress";
import { MessageCircle, AlertTriangle, ArrowDown, Bell, ChevronRight } from "lucide-react";
import { motion } from "motion/react";
import dashboardData from "@/src/data/dashboard.json";
import { ThemeToggle } from "@/src/components/ThemeToggle";

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);
  const [activePlant, setActivePlant] = useState("All");
  const [activeBU, setActiveBU] = useState("All BU");
  const [activeMetric, setActiveMetric] = useState("All");
  const [activeShift, setActiveShift] = useState("All");
  const [activeProductLine, setActiveProductLine] = useState("All");
  const [activeFilterCategory, setActiveFilterCategory] = useState("Plant");

  useEffect(() => {
    setTimeout(() => {
      setData(dashboardData);
    }, 500);
  }, []);

  const filteredMetrics = useMemo(() => {
    if (!data) return [];
    return data.metrics.filter((m: any) => {
      const matchPlant = activePlant === "All" || m.plant === activePlant;
      const matchBU = activeBU === "All BU" || m.bu === activeBU;
      const matchMetric = activeMetric === "All" || m.type === activeMetric;
      const matchShift = activeShift === "All" || m.shift === activeShift;
      const matchProductLine = activeProductLine === "All" || m.productLine === activeProductLine;
      return matchPlant && matchBU && matchMetric && matchShift && matchProductLine;
    });
  }, [data, activePlant, activeBU, activeMetric, activeShift, activeProductLine]);

  const handleWhatsAppShare = () => {
    if (!filteredMetrics || filteredMetrics.length === 0) {
      alert("No metrics to share.");
      return;
    }
    let message = `📊 *Dashboard Metrics Summary*\n`;
    message += `Date: ${data.header.date}\n`;
    message += `Plants: ${data.header.plants}\n\n`;
    filteredMetrics.forEach((m: any) => {
      const statusEmoji = m.status === 'exceeded' ? '🟢' : m.status === 'achieved' ? '🔵' : '🟠';
      message += `${statusEmoji} *${m.title}*: ${m.value}%\n`;
      message += `   └ ${m.subtext} • ${m.shift} • ${m.productLine}\n\n`;
    });
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://api.whatsapp.com/send?text=${encodedMessage}`, '_blank');
  };

  if (!data) return (
    <div className="min-h-full p-4 pb-20 animate-pulse">
      <div className="h-12 w-48 bg-slate-100 rounded-xl mb-6 mt-2"></div>
      <div className="grid grid-cols-2 gap-3 mb-4">
        {[1,2,3,4].map(i => <div key={i} className="h-24 bg-slate-100 rounded-2xl"></div>)}
      </div>
      <div className="h-16 bg-slate-100 rounded-xl mb-6"></div>
      <div className="h-10 bg-slate-100 rounded-xl mb-6"></div>
      <div className="h-64 bg-slate-100 rounded-2xl"></div>
    </div>
  );

  const kpiConfig = [
    { bg: "bg-emerald-50", border: "border-emerald-100", text: "text-emerald-600" },
    { bg: "bg-blue-50", border: "border-blue-100", text: "text-blue-600" },
    { bg: "bg-amber-50", border: "border-amber-100", text: "text-amber-600" },
    { bg: "bg-slate-50", border: "border-slate-100", text: "text-slate-600" },
  ];

  const filterBtnClass = (isActive: boolean) =>
    `px-4 py-2 text-xs font-medium rounded-lg transition-all duration-200 border ${
      isActive
        ? 'bg-brand-50 border-brand-200 text-brand-700'
        : 'bg-white border-[var(--color-border-subtle)] text-slate-500 hover:text-slate-700 hover:border-[var(--color-border-emphasis)]'
    }`;

  return (
    <div className="min-h-full p-4 pb-20">
      {/* Header */}
      <header className="flex justify-between items-start mb-6 pt-2">
        <div>
          <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">{data.header.greeting}</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">{data.header.date} · {data.header.plants}</p>
        </div>
        <div className="flex items-center gap-2.5">
          <ThemeToggle />
          <button
            onClick={handleWhatsAppShare}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 text-xs font-medium hover:bg-emerald-100 transition-all duration-200"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>Share</span>
          </button>
          <button className="relative p-2.5 rounded-xl bg-white border border-[var(--color-border-subtle)] text-slate-400 hover:text-slate-600 transition-all duration-200 shadow-sm">
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center text-xs font-bold text-white shadow-md shadow-brand-500/15">
            MD
          </div>
        </div>
      </header>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        {data.kpis.map((kpi: any, i: number) => {
          const config = kpiConfig[i] || kpiConfig[3];
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className={`p-4 flex flex-col items-center justify-center ${config.bg} ${config.border}`}>
                <span className={`text-3xl font-bold ${config.text}`}>{kpi.value}</span>
                <span className="text-[11px] text-slate-500 mt-1 font-medium">{kpi.title}</span>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Alert Banner */}
      {data.alerts.map((alert: any, i: number) => (
        <div key={i} className="mb-5 p-3.5 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-amber-800 leading-relaxed font-medium">
              {alert.message}
            </p>
          </div>
          <ChevronRight className="w-4 h-4 text-amber-400 shrink-0 mt-1" />
        </div>
      ))}

      {/* Filters */}
      <div className="mb-5 space-y-3">
        <div className="flex gap-5 border-b border-[var(--color-border-subtle)] overflow-x-auto scrollbar-hide">
          {['Plant', 'BU', 'Metrics', 'Shift', 'Product Line'].map(category => (
            <button
              key={category}
              onClick={() => setActiveFilterCategory(category)}
              className={`pb-3 text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition-all duration-200 relative ${
                activeFilterCategory === category
                  ? 'text-brand-600'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {category}
              {activeFilterCategory === category && (
                <motion.div
                  layoutId="activeDashboardFilterCategoryTab"
                  className="absolute bottom-0 left-0 w-full h-0.5 bg-brand-600 rounded-t-full"
                />
              )}
            </button>
          ))}
        </div>

        <div className="min-h-[40px] pt-1">
          {activeFilterCategory === 'Plant' && (
            <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="flex gap-2 flex-wrap">
              {['All', 'Plant 1', 'Plant 2'].map(plant => (
                <button key={plant} onClick={() => setActivePlant(plant)} className={filterBtnClass(activePlant === plant)}>{plant}</button>
              ))}
            </motion.div>
          )}
          {activeFilterCategory === 'BU' && (
            <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="flex gap-2 flex-wrap">
              {['All BU', 'BU1', 'BU2', 'BU3', 'BU4'].map(bu => (
                <button key={bu} onClick={() => setActiveBU(bu)} className={filterBtnClass(activeBU === bu)}>{bu}</button>
              ))}
            </motion.div>
          )}
          {activeFilterCategory === 'Metrics' && (
            <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="flex gap-2 flex-wrap">
              {['All', 'Quality', 'Delivery'].map(metric => (
                <button key={metric} onClick={() => setActiveMetric(metric)} className={filterBtnClass(activeMetric === metric)}>{metric}</button>
              ))}
            </motion.div>
          )}
          {activeFilterCategory === 'Shift' && (
            <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="flex gap-2 flex-wrap">
              {['All', 'Shift 1', 'Shift 2', 'Shift 3'].map(shift => (
                <button key={shift} onClick={() => setActiveShift(shift)} className={filterBtnClass(activeShift === shift)}>{shift}</button>
              ))}
            </motion.div>
          )}
          {activeFilterCategory === 'Product Line' && (
            <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="flex gap-2 flex-wrap">
              {['All', 'Model A', 'Model B', 'Model C'].map(pl => (
                <button key={pl} onClick={() => setActiveProductLine(pl)} className={filterBtnClass(activeProductLine === pl)}>{pl}</button>
              ))}
            </motion.div>
          )}
        </div>
      </div>

      {/* Metrics List */}
      <Card className="p-4">
        <div className="flex items-center gap-5 mb-5 text-[11px] text-slate-500 font-medium">
          <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-500"/> Exceeded</div>
          <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-brand-500"/> Achieved</div>
          <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-amber-500"/> Need focus</div>
        </div>

        <div className="space-y-5">
          {filteredMetrics.length === 0 ? (
            <p className="text-center text-slate-400 py-6 text-sm">No metrics found for the selected filters.</p>
          ) : (
            filteredMetrics.map((metric: any, i: number) => {
              const isExceeded = metric.status === 'exceeded';
              const isAchieved = metric.status === 'achieved';
              const colorClass = isExceeded ? 'bg-emerald-500' : isAchieved ? 'bg-brand-500' : 'bg-amber-500';
              const textColorClass = isExceeded ? 'text-emerald-600' : isAchieved ? 'text-brand-600' : 'text-amber-600';

              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="flex items-center justify-between gap-4"
                >
                  <div className="w-1/3">
                    <p className="text-sm font-semibold text-slate-800">{metric.title}</p>
                    <p className="text-[10px] text-slate-400 font-medium mt-0.5">{metric.subtext} · {metric.shift} · {metric.productLine}</p>
                  </div>
                  <div className="flex-1 max-w-[120px]">
                    <Progress value={Math.min(metric.value, 100)} indicatorColor={colorClass} />
                  </div>
                  <div className="w-12 text-right">
                    <span className={`text-sm font-bold ${textColorClass}`}>{metric.value}%</span>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>

        {filteredMetrics.length > 0 && (
          <div className="mt-5 flex justify-center">
            <button className="w-8 h-8 rounded-full bg-slate-50 border border-[var(--color-border-subtle)] flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all duration-200">
              <ArrowDown className="w-4 h-4" />
            </button>
          </div>
        )}
      </Card>
    </div>
  );
}
