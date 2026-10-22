"use client";
// RESPONSIBILITY: Renders the SuperadminDateRangePicker component.
import { useState } from "react";
import { Calendar } from "lucide-react";

interface SuperadminDateRangePickerProps {
  onRangeChange: (start: string, end: string) => void;
}

export default function SuperadminDateRangePicker({ onRangeChange }: SuperadminDateRangePickerProps) {
  const [range, setRange] = useState("this_month");
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");

  const handleChange = (val: string) => {
    setRange(val);
    if (val !== "custom") onRangeChange(val, val); // Mock behavior for now
  };

  return (
    <div className="flex items-center gap-3 bg-background border border-border rounded-lg p-1.5 shadow-sm">
      <div className="pl-2"><Calendar className="w-4 h-4 text-secondary" /></div>
      <select value={range} onChange={(e) => handleChange(e.target.value)} className="bg-transparent text-sm text-foreground focus:outline-none cursor-pointer">
        <option value="today">Today</option>
        <option value="this_week">This Week</option>
        <option value="this_month">This Month</option>
        <option value="this_year">This Year</option>
        <option value="custom">Custom</option>
      </select>
      {range === "custom" && (
        <div className="flex items-center gap-2 pl-2 border-l border-border">
          <input type="date" value={customStart} onChange={e => { setCustomStart(e.target.value); onRangeChange(e.target.value, customEnd); }} className="bg-transparent text-sm text-foreground focus:outline-none" />
          <span className="text-secondary">-</span>
          <input type="date" value={customEnd} onChange={e => { setCustomEnd(e.target.value); onRangeChange(customStart, e.target.value); }} className="bg-transparent text-sm text-foreground focus:outline-none" />
        </div>
      )}
    </div>
  );
}
