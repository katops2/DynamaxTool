import React, { useMemo, useState } from "react";

const LOGO_PATH = "/wave-logo.png";
const BASE_RUN_HOURS_PER_DAY = 10.75;
const BASE_SCHEDULE_HOURS_PER_DAY = 16;
const ACTUAL_YTD_LF = 302720;
const ACTUAL_YTD_WORKING_DAYS = 71;
const ACTUAL_DOWNTIME_PCT = 45;

const presets = {
  Lite: {
    current: { lfPerPiece: 4, piecesPerFixture: 4, fixturesPerCycle: 10, lfPerCycle: 160, cycleMinutes: 9 + 4 / 60, cyclesPerHour: 6, lfPerHour: 960, lfPerDay: 10320 },
    nested: { lfPerPiece: 4, piecesPerFixture: 8, fixturesPerCycle: 10, lfPerCycle: 320, cycleMinutes: 11 + 42 / 60, cyclesPerHour: 4, lfPerHour: 1280, lfPerDay: 13760 },
    doubleBlade: { lfPerPiece: 4, piecesPerFixture: 8, fixturesPerCycle: 10, lfPerCycle: 320, cycleMinutes: 8 + 23 / 60, cyclesPerHour: 7, lfPerHour: 2240, lfPerDay: 24080 },
    nestedNoEndCut: { lfPerPiece: 4, piecesPerFixture: 8, fixturesPerCycle: 10, lfPerCycle: 320, cycleMinutes: 4 + 9 / 60, cyclesPerHour: 12, lfPerHour: 3840, lfPerDay: 41280 },
  },
  Regular: {
    current: { lfPerPiece: 4, piecesPerFixture: 4, fixturesPerCycle: 10, lfPerCycle: 160, cycleMinutes: 11 + 5 / 60, cyclesPerHour: 5, lfPerHour: 800, lfPerDay: 8600 },
    nested: { lfPerPiece: 4, piecesPerFixture: 8, fixturesPerCycle: 10, lfPerCycle: 320, cycleMinutes: 14 + 19 / 60, cyclesPerHour: 4, lfPerHour: 1280, lfPerDay: 13760 },
    doubleBlade: { lfPerPiece: 4, piecesPerFixture: 8, fixturesPerCycle: 10, lfPerCycle: 320, cycleMinutes: 10 + 30 / 60, cyclesPerHour: 5, lfPerHour: 1600, lfPerDay: 17200 },
    nestedNoEndCut: { lfPerPiece: 4, piecesPerFixture: 8, fixturesPerCycle: 10, lfPerCycle: 320, cycleMinutes: 5 + 21 / 60, cyclesPerHour: 10, lfPerHour: 3200, lfPerDay: 34400 },
  },
  Plus: {
    current: { lfPerPiece: 4, piecesPerFixture: 4, fixturesPerCycle: 10, lfPerCycle: 160, cycleMinutes: 11 + 5 / 60, cyclesPerHour: 5, lfPerHour: 800, lfPerDay: 8600 },
    nested: { lfPerPiece: 4, piecesPerFixture: 8, fixturesPerCycle: 10, lfPerCycle: 320, cycleMinutes: 14 + 19 / 60, cyclesPerHour: 4, lfPerHour: 1280, lfPerDay: 13760 },
    doubleBlade: { lfPerPiece: 4, piecesPerFixture: 8, fixturesPerCycle: 10, lfPerCycle: 320, cycleMinutes: 10 + 30 / 60, cyclesPerHour: 5, lfPerHour: 1600, lfPerDay: 17200 },
    nestedNoEndCut: { lfPerPiece: 4, piecesPerFixture: 8, fixturesPerCycle: 10, lfPerCycle: 320, cycleMinutes: 5 + 21 / 60, cyclesPerHour: 10, lfPerHour: 3200, lfPerDay: 34400 },
  },
};

const fmt0 = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });
const fmt1 = new Intl.NumberFormat("en-US", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const fmt2 = new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

function formatClock(minutesDecimal) {
  const totalSeconds = Math.max(0, Math.round(minutesDecimal * 60));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function formatInput(value, decimals = 0) {
  if (!Number.isFinite(value)) return "";
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

function parseInputValue(raw) {
  const cleaned = String(raw).replace(/,/g, "").trim();
  if (cleaned === "") return 0;
  const parsed = Number(cleaned);
  return Number.isFinite(parsed) ? parsed : 0;
}

function Card({ title, children, blue = false }) {
  return (
    <div className={`rounded-2xl border p-5 shadow-sm ${blue ? "border-sky-200 bg-sky-50" : "border-slate-200 bg-white"}`}>
      {title ? <h3 className={`mb-4 text-lg font-semibold ${blue ? "text-sky-950" : "text-slate-900"}`}>{title}</h3> : null}
      {children}
    </div>
  );
}

function MetricCard({ title, value, subtitle }) {
  return (
    <div className="rounded-2xl border border-sky-200 bg-white p-5 shadow-sm">
      <div className="text-sm text-sky-700">{title}</div>
      <div className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">{value}</div>
      {subtitle ? <div className="mt-1 text-sm text-slate-500">{subtitle}</div> : null}
    </div>
  );
}

function DetailBox({ label, value, helper }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="text-sm text-slate-500">{label}</div>
      <div className="mt-1 text-xl font-semibold text-slate-900">{value}</div>
      {helper ? <div className="mt-1 text-xs text-slate-500">{helper}</div> : null}
    </div>
  );
}

function FormattedNumberInput({ label, value, onChange, decimals = 0 }) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <input
        type="text"
        value={formatInput(value, decimals)}
        onChange={(e) => onChange(parseInputValue(e.target.value))}
        className="w-full rounded-xl border border-slate-300 px-3 py-2 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
      />
    </label>
  );
}

function SelectInput({ label, value, onChange, options }) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function RangeInput({ label, value, onChange, min, max, step = 1, helper, suffix = "" }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-medium text-slate-700">{label}</span>
        <span className="text-sm font-semibold text-sky-900">{fmt0.format(value)}{suffix}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-sky-600"
      />
      {helper ? <div className="text-xs text-slate-500">{helper}</div> : null}
    </div>
  );
}

function LogoFallback() {
  return (
    <div className="flex h-16 items-center rounded-xl border border-sky-200 bg-sky-50 px-4 text-sky-900">
      <div>
        <div className="text-2xl font-bold tracking-tight">WAVE</div>
        <div className="text-[10px] font-medium uppercase tracking-[0.15em]">Worthington Armstrong Venture</div>
      </div>
    </div>
  );
}

export default function DynamaxProductionScenarioTool() {
  const [logoBroken, setLogoBroken] = useState(false);
  const [product, setProduct] = useState("Lite");
  const [processMode, setProcessMode] = useState("current");
  const [tableUtilizationPct, setTableUtilizationPct] = useState(50);
  const [projectedDowntimePct, setProjectedDowntimePct] = useState(10);
  const [headcount, setHeadcount] = useState(2);
  const [shiftsPerDay, setShiftsPerDay] = useState(2);
  const [hoursPerShift, setHoursPerShift] = useState(8);
  const [overtimeHoursPerWeek, setOvertimeHoursPerWeek] = useState("0");
  const [operatingDaysPerYear, setOperatingDaysPerYear] = useState(211);
  const [dailyGoalLF, setDailyGoalLF] = useState(10792);
  const [annualGoalLF, setAnnualGoalLF] = useState(2500000);
  const [lastYearLF, setLastYearLF] = useState(1594213);

    const selectedPreset = presets[product][processMode];

  const results = useMemo(() => {
    const actualCurrentDailyLF = ACTUAL_YTD_WORKING_DAYS > 0 ? ACTUAL_YTD_LF / ACTUAL_YTD_WORKING_DAYS : 0;
    const actualCurrentAnnualLF = actualCurrentDailyLF * operatingDaysPerYear;
    const actualCurrentLfPerHour = BASE_RUN_HOURS_PER_DAY > 0 ? actualCurrentDailyLF / BASE_RUN_HOURS_PER_DAY : 0;

    const overtimePerDay = Number(overtimeHoursPerWeek) / 5;
    const scheduledHoursPerDay = shiftsPerDay * hoursPerShift + overtimePerDay;
    const projectedRunHoursPerDay = scheduledHoursPerDay * (BASE_RUN_HOURS_PER_DAY / BASE_SCHEDULE_HOURS_PER_DAY);

    const requiredHeadcount = 2 + Math.max(0, (tableUtilizationPct - 50) / 50);
    const staffingFactor = clamp(headcount / requiredHeadcount, 0, 1);
    const utilizationFactor = tableUtilizationPct / 100;
    const downtimeFactor = clamp((110 - projectedDowntimePct) / 100, 0, 2);

    const projectedLfPerHour = selectedPreset.lfPerHour * utilizationFactor * downtimeFactor * staffingFactor;
    const projectedLfPerDay = projectedLfPerHour * projectedRunHoursPerDay;
    const projectedAnnualLF = projectedLfPerDay * operatingDaysPerYear;

    return {
      actualCurrentDailyLF,
      actualCurrentAnnualLF,
      actualCurrentLfPerHour,
      overtimePerDay,
      scheduledHoursPerDay,
      projectedRunHoursPerDay,
      requiredHeadcount,
      projectedLfPerHour,
      projectedLfPerDay,
      projectedAnnualLF,
      improvementVsActualPerDay: projectedLfPerDay - actualCurrentDailyLF,
      improvementVsActualPerYear: projectedAnnualLF - actualCurrentAnnualLF,
      gapToDailyGoal: projectedLfPerDay - dailyGoalLF,
      gapToAnnualGoal: projectedAnnualLF - annualGoalLF,
      gapToLastYear: projectedAnnualLF - lastYearLF,
      annualVsLastYearPct: lastYearLF > 0 ? (projectedAnnualLF / lastYearLF) * 100 : 0,
    };
  }, [
    selectedPreset,
    tableUtilizationPct,
    projectedDowntimePct,
    headcount,
    shiftsPerDay,
    hoursPerShift,
    overtimeHoursPerWeek,
    operatingDaysPerYear,
    dailyGoalLF,
    annualGoalLF,
    lastYearLF,
  ]);

  const processModeLabel = {
    current: "Current",
    nested: "Nested",
    doubleBlade: "Double Blade",
    nestedNoEndCut: "Nested / No End Cut",
  }[processMode];

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 via-slate-50 to-white p-6 text-slate-900">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="rounded-3xl border border-sky-200 bg-white/95 p-6 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              {logoBroken ? (
                <LogoFallback />
              ) : (
                <img
                  src={LOGO_PATH}
                  alt="WAVE logo"
                  className="h-16 w-auto object-contain"
                  onError={() => setLogoBroken(true)}
                />
              )}
              <div>
                <div className="text-sm font-medium uppercase tracking-[0.2em] text-sky-700">Executive Scenario Planner</div>
                <h1 className="text-3xl font-semibold tracking-tight text-slate-900">WAVE ALP Dynamax CNC Production Projection Tool</h1>
                <p className="mt-2 max-w-4xl text-sm text-slate-600">
                  Instructions: choose the product family and process mode, then adjust table utilization, projected downtime, shifts, hours, and overtime. The tool will update required headcount automatically from table utilization and show projected LF/day, projected year-end production, and gap to target. The 2026 YTD box at the bottom is reference only.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 text-sm">
              <span className="rounded-full bg-sky-700 px-3 py-1 text-white">{product}</span>
              <span className="rounded-full bg-sky-100 px-3 py-1 text-sky-900">{processModeLabel}</span>
              <span className="rounded-full border border-sky-200 bg-white px-3 py-1 text-slate-700">Headcount: {fmt0.format(headcount)}</span>
            </div>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[390px,1fr]">
          <div className="space-y-6">
            <Card title="Process Inputs" blue={true}>
              <div className="space-y-4">
                <SelectInput
                  label="Product Family"
                  value={product}
                  onChange={setProduct}
                  options={[
                    { value: "Lite", label: "Lite" },
                    { value: "Regular", label: "Regular" },
                    { value: "Plus", label: "Plus" },
                  ]}
                />
                <SelectInput
                  label="Process Mode"
                  value={processMode}
                  onChange={setProcessMode}
                  options={[
                    { value: "current", label: "Current" },
                    { value: "nested", label: "Nested" },
                    { value: "doubleBlade", label: "Double Blade" },
                    { value: "nestedNoEndCut", label: "Nested / No End Cut" },
                  ]}
                />
                <div className="grid grid-cols-2 gap-4">
                  <DetailBox label="LF / Cycle" value={fmt0.format(selectedPreset.lfPerCycle)} helper="From production sheet" />
                  <DetailBox label="Cycle Time" value={formatClock(selectedPreset.cycleMinutes)} helper="From production sheet" />
                  <DetailBox label="Cycles / Hour" value={fmt0.format(selectedPreset.cyclesPerHour)} helper="From production sheet" />
                  <DetailBox label="LF / Hour" value={fmt0.format(selectedPreset.lfPerHour)} helper="Baseline process rate" />
                </div>
              </div>
            </Card>

            <Card title="Scenario Planning Inputs">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormattedNumberInput label="Operating Days / Year" value={operatingDaysPerYear} onChange={setOperatingDaysPerYear} />
                <FormattedNumberInput label="Headcount" value={headcount} onChange={setHeadcount} />
                <SelectInput
                  label="Shifts / Day"
                  value={String(shiftsPerDay)}
                  onChange={(value) => setShiftsPerDay(Number(value))}
                  options={[
                    { value: "1", label: "1" },
                    { value: "2", label: "2" },
                    { value: "3", label: "3" },
                  ]}
                />
                <FormattedNumberInput label="Hours / Shift" value={hoursPerShift} onChange={setHoursPerShift} decimals={2} />
                <SelectInput
                  label="Overtime / Week"
                  value={overtimeHoursPerWeek}
                  onChange={setOvertimeHoursPerWeek}
                  options={[
                    { value: "0", label: "0 hrs" },
                    { value: "2", label: "2 hrs" },
                    { value: "8", label: "8 hrs" },
                    { value: "10", label: "10 hrs" },
                    { value: "16", label: "16 hrs" },
                  ]}
                />
                <FormattedNumberInput label="Daily Goal LF" value={dailyGoalLF} onChange={setDailyGoalLF} />
                <FormattedNumberInput label="Annual Goal LF" value={annualGoalLF} onChange={setAnnualGoalLF} />
                <div className="md:col-span-2">
                  <FormattedNumberInput label="Last Year Actual LF" value={lastYearLF} onChange={setLastYearLF} />
                </div>
              </div>
            </Card>

            <Card title="Scenario Multipliers" blue={true}>
              <div className="space-y-6">
                <RangeInput
                  label="Table Utilization"
                  value={tableUtilizationPct}
                  onChange={setTableUtilizationPct}
                  min={50}
                  max={100}
                  step={5}
                  suffix="%"
                  helper="50% is the standard starting point. Anything above 50% requires additional headcount, scaling from 2 at 50% to 3 at 100%."
                />
                <RangeInput
                  label="Projected Downtime"
                  value={projectedDowntimePct}
                  onChange={setProjectedDowntimePct}
                  min={0}
                  max={30}
                  step={1}
                  suffix="%"
                  helper="10% is neutral because the production sheet rates already reflect about that level."
                />
                <div className="rounded-2xl border border-sky-200 bg-white p-4 text-sm text-slate-600">
                  Required headcount at the selected utilization is <span className="font-semibold text-slate-900">{fmt1.format(results.requiredHeadcount)}</span>. Selected headcount is <span className="font-semibold text-slate-900">{fmt0.format(headcount)}</span>. Projected runtime is <span className="font-semibold text-slate-900">{fmt2.format(results.projectedRunHoursPerDay)}</span> hours/day from <span className="font-semibold text-slate-900">{fmt2.format(results.scheduledHoursPerDay)}</span> scheduled hours/day.
                </div>
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <div className={`rounded-3xl border p-6 shadow-sm ${results.gapToAnnualGoal >= 0 ? "border-emerald-200 bg-emerald-50" : "border-rose-200 bg-rose-50"}`}>
              <div className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">Projected Year-End Production</div>
              <div className="mt-2 text-5xl font-semibold tracking-tight text-slate-900">{fmt0.format(results.projectedAnnualLF)} LF</div>
              <div className={`mt-3 text-lg font-medium ${results.gapToAnnualGoal >= 0 ? "text-emerald-700" : "text-rose-700"}`}>
                {results.gapToAnnualGoal >= 0
                  ? `Projected to exceed target by ${fmt0.format(results.gapToAnnualGoal)} LF`
                  : `Projected short of target by ${fmt0.format(Math.abs(results.gapToAnnualGoal))} LF`}
              </div>
              <div className="mt-2 text-sm text-slate-600">Target: {fmt0.format(annualGoalLF)} LF</div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <MetricCard title="Actual LF / Day" value={fmt0.format(results.actualCurrentDailyLF)} subtitle="Real 2026 YTD average" />
              <MetricCard title="Projected LF / Day" value={fmt0.format(results.projectedLfPerDay)} subtitle={`${fmt2.format(results.projectedRunHoursPerDay)} runtime hrs/day`} />
              <MetricCard title="Projected LF / Hour" value={fmt0.format(results.projectedLfPerHour)} subtitle="After utilization and downtime adjustments" />
              <MetricCard title="Last Year Actual LF" value={fmt0.format(lastYearLF)} subtitle={`${fmt1.format(results.annualVsLastYearPct)}% of last year actual`} />
            </div>

            <Card title="Executive Summary" blue={true}>
              <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-6">
                <DetailBox label="Actual LF / Day" value={fmt0.format(results.actualCurrentDailyLF)} helper="Current 2026 average" />
                <DetailBox label="Projected LF / Day" value={fmt0.format(results.projectedLfPerDay)} helper="Selected scenario output" />
                <DetailBox label="Improvement / Day" value={fmt0.format(results.improvementVsActualPerDay)} helper="Projected vs actual current pace" />
                <DetailBox label="Gap to Daily Goal" value={fmt0.format(results.gapToDailyGoal)} helper={`${results.gapToDailyGoal >= 0 ? "Ahead of" : "Short of"} ${fmt0.format(dailyGoalLF)}`} />
                <DetailBox label="Last Year Actual" value={fmt0.format(lastYearLF)} helper="2025 actual output" />
                <DetailBox label="Projection vs Last Year" value={fmt0.format(results.gapToLastYear)} helper={`${results.gapToLastYear >= 0 ? "Above" : "Below"} last year`} />
              </div>
            </Card>

            <Card title="Actual vs Projected Scenario">
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500">
                      <th className="pb-3 pr-4 font-medium">Metric</th>
                      <th className="pb-3 pr-4 font-medium">Actual Today</th>
                      <th className="pb-3 pr-4 font-medium">Projected Scenario</th>
                    </tr>
                  </thead>
                  <tbody className="text-slate-800">
                    <tr className="border-b border-slate-100">
                      <td className="py-3 pr-4">LF / Hour</td>
                      <td className="py-3 pr-4">{fmt1.format(results.actualCurrentLfPerHour)}</td>
                      <td className="py-3 pr-4">{fmt0.format(results.projectedLfPerHour)}</td>
                    </tr>
                    <tr className="border-b border-slate-100">
                      <td className="py-3 pr-4">LF / Day</td>
                      <td className="py-3 pr-4">{fmt0.format(results.actualCurrentDailyLF)}</td>
                      <td className="py-3 pr-4">{fmt0.format(results.projectedLfPerDay)}</td>
                    </tr>
                    <tr>
                      <td className="py-3 pr-4">Annual LF</td>
                      <td className="py-3 pr-4">{fmt0.format(results.actualCurrentAnnualLF)}</td>
                      <td className="py-3 pr-4">{fmt0.format(results.projectedAnnualLF)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Card>

            <Card title="2026 YTD Reference">
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <DetailBox label="YTD Actual LF" value={fmt0.format(ACTUAL_YTD_LF)} helper="Reference only" />
                <DetailBox label="Working Days" value={fmt0.format(ACTUAL_YTD_WORKING_DAYS)} helper="Reference only" />
                <DetailBox label="Actual Daily Average" value={fmt0.format(results.actualCurrentDailyLF)} helper="302,720 LF ÷ 71 days" />
                <DetailBox label="Actual Downtime" value={`${fmt0.format(ACTUAL_DOWNTIME_PCT)}%`} helper="Reference only" />
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
