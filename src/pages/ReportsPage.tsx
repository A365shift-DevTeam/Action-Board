import { useState, useMemo } from "react";
import { Card } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Checkbox } from "@/src/components/ui/checkbox";
import { FileText, FileSpreadsheet, FileIcon, Download, CheckCircle2, MessageCircle } from "lucide-react";
import { motion } from "motion/react";
import { ThemeToggle } from "@/src/components/ThemeToggle";

const MOCK_REPORTS = [
  { id: 1, title: "Q3 Quality Assessment", plant: "Irungattukottai", bu: "BU2", market: "Export", metric: "Quality", date: "2026-03-17", value: "98.5%", status: "good", shift: "Shift 1", productLine: "Model A" },
  { id: 2, title: "Domestic Delivery Delays", plant: "Padi", bu: "BU1", market: "Domestic", metric: "Delivery", date: "2026-03-16", value: "85.2%", status: "warning", shift: "Shift 2", productLine: "Model B" },
  { id: 3, title: "Export Quality Audit", plant: "Hosur", bu: "BU3", market: "Export", metric: "Quality", date: "2026-03-15", value: "99.1%", status: "good", shift: "Shift 3", productLine: "Model C" },
  { id: 4, title: "BU4 Delivery Performance", plant: "Pune", bu: "BU4", market: "Domestic", metric: "Delivery", date: "2026-03-10", value: "92.0%", status: "good", shift: "Shift 1", productLine: "Model A" },
  { id: 5, title: "Sanand Plant Scrap Report", plant: "Sanand", bu: "BU2", market: "Domestic", metric: "Quality", date: "2026-03-05", value: "78.4%", status: "critical", shift: "Shift 2", productLine: "Model B" },
  { id: 6, title: "Gurgaon Export Metrics", plant: "Gurgaon", bu: "BU1", market: "Export", metric: "Delivery", date: "2026-02-28", value: "95.5%", status: "good", shift: "Shift 3", productLine: "Model C" },
  { id: 7, title: "Irungattukottai BU2 Quality", plant: "Irungattukottai", bu: "BU2", market: "Domestic", metric: "Quality", date: "2026-02-20", value: "94.2%", status: "warning", shift: "Shift 1", productLine: "Model A" },
  { id: 8, title: "Padi BU1 Quality Report", plant: "Padi", bu: "BU1", market: "Domestic", metric: "Quality", date: "2026-02-15", value: "96.5%", status: "good", shift: "Shift 2", productLine: "Model B" },
  { id: 9, title: "Hosur BU3 Delivery", plant: "Hosur", bu: "BU3", market: "Domestic", metric: "Delivery", date: "2026-01-25", value: "88.0%", status: "warning", shift: "Shift 3", productLine: "Model C" },
];

export default function ReportsPage() {
  const [activePlant, setActivePlant] = useState("All");
  const [activeBU, setActiveBU] = useState("All BU");
  const [activeMarket, setActiveMarket] = useState("All");
  const [activeMetric, setActiveMetric] = useState("All");
  const [activeShift, setActiveShift] = useState("All");
  const [activeProductLine, setActiveProductLine] = useState("All");
  const [activeDateRange, setActiveDateRange] = useState("Last 30 Days");
  const [activeFilterCategory, setActiveFilterCategory] = useState("Date Range");
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");
  const [sections, setSections] = useState({
    executiveSummary: true, qualityMetrics: true, deliveryMetrics: true, chartsVisuals: false, actionItems: false,
  });
  const [exportFormat, setExportFormat] = useState<'ppt' | 'excel' | 'pdf'>('pdf');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDone, setIsDone] = useState(false);

  const filteredReports = useMemo(() => {
    return MOCK_REPORTS.filter(r => {
      const matchPlant = activePlant === "All" || r.plant === activePlant;
      const matchBU = activeBU === "All BU" || r.bu === activeBU;
      const matchMarket = activeMarket === "All" || r.market === activeMarket;
      const matchMetric = activeMetric === "All" || r.metric === activeMetric;
      const matchShift = activeShift === "All" || r.shift === activeShift;
      const matchProductLine = activeProductLine === "All" || r.productLine === activeProductLine;
      let matchDate = true;
      const reportDate = new Date(r.date);
      const today = new Date("2026-03-17T22:48:27-07:00");
      if (activeDateRange === "Today") { matchDate = reportDate.toDateString() === today.toDateString(); }
      else if (activeDateRange === "Last 7 Days") { const d = new Date(today); d.setDate(today.getDate() - 7); matchDate = reportDate >= d && reportDate <= today; }
      else if (activeDateRange === "Last 30 Days") { const d = new Date(today); d.setDate(today.getDate() - 30); matchDate = reportDate >= d && reportDate <= today; }
      else if (activeDateRange === "Custom") { if (customStartDate && customEndDate) { matchDate = reportDate >= new Date(customStartDate) && reportDate <= new Date(customEndDate); } }
      return matchPlant && matchBU && matchMarket && matchMetric && matchShift && matchProductLine && matchDate;
    });
  }, [activePlant, activeBU, activeMarket, activeMetric, activeShift, activeProductLine, activeDateRange, customStartDate, customEndDate]);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      let content = "", filename = "", mimeType = "";
      if (exportFormat === 'excel') {
        const headers = ["ID","Title","Plant","BU","Market","Metric","Date","Value","Status","Shift","Product Line"];
        const rows = filteredReports.map(r => [r.id,`"${r.title}"`,r.plant,r.bu,r.market,r.metric,r.date,r.value,r.status,r.shift,r.productLine].join(","));
        content = [headers.join(","), ...rows].join("\n"); filename = `reports_export_${new Date().toISOString().split('T')[0]}.csv`; mimeType = "text/csv;charset=utf-8;";
      } else if (exportFormat === 'pdf') {
        content = "REPORTS SUMMARY (PDF Export)\n============================\n\n";
        filteredReports.forEach(r => { content += `Title: ${r.title}\nDetails: ${r.plant} | ${r.bu} | ${r.market} | ${r.shift} | ${r.productLine}\nMetric: ${r.metric} | Value: ${r.value} | Status: ${r.status}\nDate: ${r.date}\n----------------------------\n`; });
        filename = `reports_export_${new Date().toISOString().split('T')[0]}.txt`; mimeType = "text/plain;charset=utf-8;";
      } else if (exportFormat === 'ppt') {
        content = "SLIDE DECK OUTLINE (PPT Export)\n===============================\n\n";
        filteredReports.forEach((r, i) => { content += `Slide ${i+1}: ${r.title}\n- Plant: ${r.plant}\n- BU: ${r.bu}\n- Value: ${r.value} (${r.status})\n\n`; });
        filename = `reports_presentation_${new Date().toISOString().split('T')[0]}.txt`; mimeType = "text/plain;charset=utf-8;";
      }
      const blob = new Blob([content], { type: mimeType }); const url = URL.createObjectURL(blob);
      const link = document.createElement("a"); link.setAttribute("href", url); link.setAttribute("download", filename);
      document.body.appendChild(link); link.click(); document.body.removeChild(link);
      setIsGenerating(false); setIsDone(true); setTimeout(() => setIsDone(false), 3000);
    }, 1500);
  };

  const handleWhatsAppShare = () => {
    if (!filteredReports || filteredReports.length === 0) { alert("No reports to share."); return; }
    let message = `📊 *Reports Summary*\nDate: ${new Date().toLocaleDateString()}\n\n`;
    filteredReports.forEach((r) => {
      const statusEmoji = r.status === 'good' ? '🟢' : r.status === 'warning' ? '🟠' : '🔴';
      message += `${statusEmoji} *${r.title}*\n   └ ${r.plant} • ${r.bu} • ${r.market} • ${r.shift} • ${r.productLine}\n   └ Metric: ${r.metric} | Value: ${r.value}\n\n`;
    });
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`, '_blank');
  };

  const filterBtnClass = (isActive: boolean) =>
    `px-4 py-2 text-xs font-medium rounded-lg transition-all duration-200 border ${
      isActive
        ? 'bg-brand-50 border-brand-200 text-brand-700'
        : 'bg-white border-[var(--color-border-subtle)] text-slate-500 hover:text-slate-700 hover:border-[var(--color-border-emphasis)]'
    }`;

  return (
    <div className="min-h-full p-4 pb-20">
      <div className="flex justify-between items-start mb-5 pt-2">
        <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Reports</h1>
        <ThemeToggle />
      </div>

      {/* Filters */}
      <div className="space-y-3 mb-6">
        <div className="flex gap-5 border-b border-[var(--color-border-subtle)] overflow-x-auto scrollbar-hide">
          {['Date Range', 'Plant', 'BU', 'Market', 'Metrics', 'Shift', 'Product Line'].map(category => (
            <button
              key={category}
              onClick={() => setActiveFilterCategory(category)}
              className={`pb-3 text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition-all duration-200 relative ${
                activeFilterCategory === category ? 'text-brand-600' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {category}
              {activeFilterCategory === category && (
                <motion.div layoutId="activeFilterCategoryTab" className="absolute bottom-0 left-0 w-full h-0.5 bg-brand-600 rounded-t-full" />
              )}
            </button>
          ))}
        </div>

        <div className="min-h-[50px] pt-1">
          {activeFilterCategory === 'Date Range' && (
            <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
              <div className="flex gap-2 flex-wrap">
                {['Today', 'Last 7 Days', 'Last 30 Days', 'Custom'].map(range => (
                  <button key={range} onClick={() => setActiveDateRange(range)} className={filterBtnClass(activeDateRange === range)}>{range}</button>
                ))}
              </div>
              {activeDateRange === 'Custom' && (
                <div className="flex gap-4 mt-2">
                  <div className="flex flex-col">
                    <label className="text-[10px] text-slate-400 mb-1 font-medium">Start Date</label>
                    <input type="date" value={customStartDate} onChange={(e) => setCustomStartDate(e.target.value)}
                      className="text-xs border border-[var(--color-border-default)] bg-white text-slate-700 rounded-lg px-2.5 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500/25" />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-[10px] text-slate-400 mb-1 font-medium">End Date</label>
                    <input type="date" value={customEndDate} onChange={(e) => setCustomEndDate(e.target.value)}
                      className="text-xs border border-[var(--color-border-default)] bg-white text-slate-700 rounded-lg px-2.5 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500/25" />
                  </div>
                </div>
              )}
            </motion.div>
          )}
          {activeFilterCategory === 'Plant' && (
            <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="flex gap-2 flex-wrap">
              {['All', 'Padi', 'Irungattukottai', 'Hosur', 'Pune', 'Gurgaon', 'Sanand'].map(p => (
                <button key={p} onClick={() => setActivePlant(p)} className={filterBtnClass(activePlant === p)}>{p}</button>
              ))}
            </motion.div>
          )}
          {activeFilterCategory === 'BU' && (
            <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="flex gap-2 flex-wrap">
              {['All BU', 'BU1', 'BU2', 'BU3', 'BU4'].map(b => (
                <button key={b} onClick={() => setActiveBU(b)} className={filterBtnClass(activeBU === b)}>{b}</button>
              ))}
            </motion.div>
          )}
          {activeFilterCategory === 'Market' && (
            <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="flex gap-2 flex-wrap">
              {['All', 'Domestic', 'Export'].map(m => (
                <button key={m} onClick={() => setActiveMarket(m)} className={filterBtnClass(activeMarket === m)}>{m}</button>
              ))}
            </motion.div>
          )}
          {activeFilterCategory === 'Metrics' && (
            <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="flex gap-2 flex-wrap">
              {['All', 'Quality', 'Delivery'].map(m => (
                <button key={m} onClick={() => setActiveMetric(m)} className={filterBtnClass(activeMetric === m)}>{m}</button>
              ))}
            </motion.div>
          )}
          {activeFilterCategory === 'Shift' && (
            <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="flex gap-2 flex-wrap">
              {['All', 'Shift 1', 'Shift 2', 'Shift 3'].map(s => (
                <button key={s} onClick={() => setActiveShift(s)} className={filterBtnClass(activeShift === s)}>{s}</button>
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

      {/* Data Preview */}
      <div className="mb-6">
        <h2 className="text-xs font-semibold text-brand-600 mb-3 uppercase tracking-wider">Available Data ({filteredReports.length})</h2>
        <div className="space-y-2.5">
          {filteredReports.length === 0 ? (
            <p className="text-xs text-slate-400 italic py-4 text-center">No data matches the selected filters.</p>
          ) : (
            filteredReports.map((report, i) => (
              <motion.div key={report.id} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
                <Card className="p-3.5 flex justify-between items-center">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-800">{report.title}</h3>
                    <p className="text-[10px] text-slate-400 font-medium mt-1">{report.plant} · {report.bu} · {report.market} · {report.shift} · {report.productLine}</p>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm font-bold ${report.status === 'good' ? 'text-emerald-600' : report.status === 'warning' ? 'text-amber-600' : 'text-red-600'}`}>{report.value}</div>
                    <div className="text-[10px] text-slate-400 font-medium">{report.date}</div>
                  </div>
                </Card>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Build Report */}
      <div className="mb-5">
        <h2 className="text-xs font-semibold text-brand-600 mb-3 uppercase tracking-wider">Build a Report</h2>
        <Card className="p-4">
          <p className="text-xs text-slate-400 font-medium mb-4">Select sections to include</p>
          <div className="space-y-3.5">
            {[
              { id: 'executiveSummary', label: 'Executive summary' },
              { id: 'qualityMetrics', label: 'Quality metrics' },
              { id: 'deliveryMetrics', label: 'Delivery metrics' },
              { id: 'chartsVisuals', label: 'Charts & visuals' },
              { id: 'actionItems', label: 'Action items' },
            ].map((item) => (
              <div key={item.id} className="flex items-center gap-3">
                <Checkbox id={item.id} checked={sections[item.id as keyof typeof sections]} onCheckedChange={(checked) => setSections(prev => ({ ...prev, [item.id]: checked }))} />
                <label htmlFor={item.id} className="text-sm text-slate-700 font-medium cursor-pointer select-none">{item.label}</label>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Export Format */}
      <div className="mb-6">
        <h2 className="text-xs font-semibold text-brand-600 mb-3 uppercase tracking-wider">Export Format</h2>
        <div className="space-y-2.5">
          {[
            { id: 'ppt', title: 'PowerPoint (.pptx)', desc: 'Slide deck for meetings', icon: FileIcon, color: 'text-amber-600', bg: 'bg-amber-50' },
            { id: 'excel', title: 'Excel (.xlsx)', desc: 'Data analysis ready', icon: FileSpreadsheet, color: 'text-emerald-600', bg: 'bg-emerald-50' },
            { id: 'pdf', title: 'PDF Report', desc: 'Print-ready format', icon: FileText, color: 'text-red-500', bg: 'bg-red-50' },
          ].map((format) => {
            const isSelected = exportFormat === format.id;
            const Icon = format.icon;
            return (
              <Card key={format.id} className={`p-3.5 cursor-pointer transition-all duration-200 ${isSelected ? 'border-brand-300 bg-brand-50/50 ring-1 ring-brand-200' : 'hover:border-[var(--color-border-emphasis)]'}`} onClick={() => setExportFormat(format.id as any)}>
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${format.bg}`}>
                    <Icon className={`w-5 h-5 ${format.color}`} />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-800">{format.title}</h3>
                    <p className="text-[10px] text-slate-400 font-medium">{format.desc}</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button onClick={handleWhatsAppShare} variant="outline" className="h-12 px-4 rounded-xl border-emerald-200 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700">
          <MessageCircle className="w-5 h-5" />
        </Button>
        <Button onClick={handleGenerate} disabled={isGenerating || isDone}
          className={`flex-1 h-12 rounded-xl text-sm font-semibold transition-all duration-200 ${
            isDone ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-md shadow-emerald-500/15' : 'bg-brand-600 hover:bg-brand-700 text-white shadow-md shadow-brand-600/15'
          }`}>
          {isGenerating ? (
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full" />
          ) : isDone ? (
            <span className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5" /> Generated</span>
          ) : (
            <span className="flex items-center gap-2">Generate Report <Download className="w-4 h-4" /></span>
          )}
        </Button>
      </div>
    </div>
  );
}
