import React, { useMemo, useState } from "react";

const basePresets = {
  Lite: {
    current: { lfPerPiece: 4, piecesPerFixture: 4, fixturesPerCycle: 10, cycleMinutes: 9 + 4 / 60 },
    nested: { lfPerPiece: 4, piecesPerFixture: 8, fixturesPerCycle: 10, cycleMinutes: 11 + 42 / 60 },
  },
  Regular: {
    current: { lfPerPiece: 4, piecesPerFixture: 4, fixturesPerCycle: 10, cycleMinutes: 11 + 5 / 60 },
    nested: { lfPerPiece: 4, piecesPerFixture: 8, fixturesPerCycle: 10, cycleMinutes: 14 + 19 / 60 },
  },
  Plus: {
    current: { lfPerPiece: 4, piecesPerFixture: 4, fixturesPerCycle: 10, cycleMinutes: 11 + 5 / 60 },
    nested: { lfPerPiece: 4, piecesPerFixture: 8, fixturesPerCycle: 10, cycleMinutes: 14 + 19 / 60 },
  },
};

const fmt0 = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });
const fmt1 = new Intl.NumberFormat("en-US", { minimumFractionDigits: 1, maximumFractionDigits: 1 });

function round(value, decimals = 2) {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}

function formatClock(minutesDecimal) {
  const totalSeconds = Math.max(0, Math.round(minutesDecimal * 60));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

function Card({ title, children }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      {title ? <h3 className="mb-4 text-lg font-semibold text-slate-900">{title}</h3> : null}
      {children}
    </div>
  );
}

function MetricCard({ title, value, subtitle }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="text-sm text-slate-500">{title}</div>
      <div className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">{value}</div>
      {subtitle ? <div className="mt-1 text-sm text-slate-500">{subtitle}</div> : null}
    </div>
  );
}

function DetailBox({ label, value, helper }) {
  return (
    <div className="rounded-2xl border border-slate-200 p-4">
      <div className="text-sm text-slate-500">{label}</div>
      <div className="mt-1 text-xl font-semibold text-slate-900">{value}</div>
      {helper ? <div className="mt-1 text-xs text-slate-500">{helper}</div> : null}
    </div>
  );
}

function NumberInput({ label, value, onChange, step = 1, disabled = false }) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <input
        type="number"
        value={value}
        step={step}
        disabled={disabled}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full rounded-xl border border-slate-300 px-3 py-2 outline-none focus:border-slate-500 disabled:bg-slate-100"
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
        className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 outline-none focus:border-slate-500"
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

function RangeInput({ label, value, onChange, min, max, step = 1, helper }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-medium text-slate-700">{label}</span>
        <span className="text-sm font-semibold text-slate-900">{value}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full"
      />
      {helper ? <div className="text-xs text-slate-500">{helper}</div> : null}
    </div>
  );
}

function CheckboxInput({ label, checked, onChange, helper }) {
  return (
    <label className="block rounded-2xl border border-slate-200 p-4">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-medium text-slate-800">{label}</span>
        <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="h-4 w-4" />
      </div>
      {helper ? <div className="mt-2 text-xs text-slate-500">{helper}</div> : null}
    </label>
  );
}

export default function DynamaxProductionScenarioTool() {
  const [product, setProduct] = useState("Lite");
  const [layout, setLayout] = useState("current");
  const [manualOverride, setManualOverride] = useState(false);

  const [lfPerPiece, setLfPerPiece] = useState(4);
  const [piecesPerFixture, setPiecesPerFixture] = useState(4);
  const [fixturesPerCycle, setFixturesPerCycle] = useState(10);
  const [cycleMinutes, setCycleMinutes] = useState(9 + 4 / 60);

  const [removeCrossCut, setRemoveCrossCut] = useState(false);
  const [doubleBlade, setDoubleBlade] = useState(false);

  const [tableUtilizationPct, setTableUtilizationPct] = useState(50);
  const [downtimePct, setDowntimePct] = useState(10);
  const [headcount, setHeadcount] = useState(2);

  const [workingWeeks, setWorkingWeeks] = useState(52);
  const [daysPerWeek, setDaysPerWeek] = useState(5);
  const [holidays, setHolidays] = useState(9);
  const [shiftsPerDay, setShiftsPerDay] = useState(2);
  const [hoursPerShift, setHoursPerShift] = useState(8);
  const [lunchMinutesPerShift, setLunchMinutesPerShift] = useState(30);
  const [breakMinutesPerShift, setBreakMinutesPerShift] = useState(30);
  const [overtimeHoursPerWeek, setOvertimeHoursPerWeek] = useState("0");

  const [targetAnnualLF, setTargetAnnualLF] = useState(2500000);
  const [bestYoYLF, setBestYoYLF] = useState(1600000);
  const [dailyGoalLF, setDailyGoalLF] = useState(10792);
  const [practicalAvailableHoursTarget, setPracticalAvailableHoursTarget] = useState(14);

  const preset = basePresets[product][layout];

  const baseValues = useMemo(() => {
    if (manualOverride) {
      return {
        lfPerPiece,
        piecesPerFixture,
        fixturesPerCycle,
        cycleMinutes,
      };
    }
    return preset;
  }, [manualOverride, lfPerPiece, piecesPerFixture, fixturesPerCycle, cycleMinutes, preset]);

  const scenarioValues = useMemo(() => {
    let nextPiecesPerFixture = baseValues.piecesPerFixture;
    let nextCycleMinutes = baseValues.cycleMinutes;

    if (removeCrossCut) {
      if (nextPiecesPerFixture < 8) {
        nextPiecesPerFixture = nextPiecesPerFixture * 2;
      }
      nextCycleMinutes = Math.max(0.5, nextCycleMinutes - 1);
    }

    if (doubleBlade) {
      nextCycleMinutes = Math.max(0.5, nextCycleMinutes - 3);
    }

    return {
      lfPerPiece: baseValues.lfPerPiece,
      piecesPerFixture: nextPiecesPerFixture,
      fixturesPerCycle: baseValues.fixturesPerCycle,
      cycleMinutes: nextCycleMinutes,
    };
  }, [baseValues, removeCrossCut, doubleBlade]);

  const calculations = useMemo(() => {
    const workingDaysPerYear = Math.max(1, workingWeeks * daysPerWeek - holidays);
    const overtimePerDay = Number(overtimeHoursPerWeek) / Math.max(daysPerWeek, 1);
    const grossHoursPerDay = shiftsPerDay * hoursPerShift + overtimePerDay;

    const lunchHoursPerDay = (lunchMinutesPerShift * shiftsPerDay) / 60;
    const breakHoursPerDay = (breakMinutesPerShift * shiftsPerDay) / 60;

    const minimumHeadcount = 2;
    const targetHeadcount = 3;
    const requiredHeadcountForUtil = 2 + Math.max(0, (tableUtilizationPct - 50) / 50);
    const staffingRatioForUtil = Math.min(1, headcount / requiredHeadcountForUtil);
    const attainableTableUtilizationPct = tableUtilizationPct * staffingRatioForUtil;

    let coverageHoursPerDay = grossHoursPerDay;
    let staffingStatus = "Target staffing";

    if (headcount < minimumHeadcount) {
      coverageHoursPerDay = grossHoursPerDay - lunchHoursPerDay - breakHoursPerDay;
      staffingStatus = "Below minimum staffing";
    } else if (headcount < targetHeadcount) {
      coverageHoursPerDay = grossHoursPerDay - lunchHoursPerDay - breakHoursPerDay;
      staffingStatus = "Minimum staffing";
    }

    const productiveHoursPerDay = Math.max(
      0,
      coverageHoursPerDay * (1 - downtimePct / 100) * (attainableTableUtilizationPct / 100)
    );
    const productiveHoursPerYear = productiveHoursPerDay * workingDaysPerYear;

    const lfPerCycle = scenarioValues.lfPerPiece * scenarioValues.piecesPerFixture * scenarioValues.fixturesPerCycle;
    const cyclesPerHour = scenarioValues.cycleMinutes > 0 ? 60 / scenarioValues.cycleMinutes : 0;
    const lfPerHour = lfPerCycle * cyclesPerHour;
    const lfPerShift = shiftsPerDay > 0 ? (lfPerHour * productiveHoursPerDay) / shiftsPerDay : 0;
    const lfPerDay = lfPerHour * productiveHoursPerDay;
    const annualLF = lfPerDay * workingDaysPerYear;

    const gapToAnnualTarget = annualLF - targetAnnualLF;
    const gapToBestYoY = annualLF - bestYoYLF;
    const gapToDailyGoal = lfPerDay - dailyGoalLF;

    const dailyDemandLF = targetAnnualLF / workingDaysPerYear;
    const requiredHoursPerDayToHitTarget = lfPerHour > 0 && attainableTableUtilizationPct > 0
      ? targetAnnualLF / (workingDaysPerYear * lfPerHour * (1 - downtimePct / 100) * (attainableTableUtilizationPct / 100))
      : 0;

    const practicalAvailableHoursPerDay = coverageHoursPerDay;
    const overtimeNeededPerWeek = Math.max(0, (requiredHoursPerDayToHitTarget - practicalAvailableHoursPerDay) * daysPerWeek);

    return {
      minimumHeadcount,
      targetHeadcount,
      requiredHeadcountForUtil,
      attainableTableUtilizationPct,
      staffingStatus,
      workingDaysPerYear,
      grossHoursPerDay,
      lunchHoursPerDay,
      breakHoursPerDay,
      coverageHoursPerDay,
      productiveHoursPerDay,
      productiveHoursPerYear,
      lfPerCycle,
      cyclesPerHour,
      lfPerHour,
      lfPerShift,
      lfPerDay,
      annualLF,
      gapToAnnualTarget,
      gapToBestYoY,
      gapToDailyGoal,
      dailyDemandLF,
      requiredHoursPerDayToHitTarget,
      practicalAvailableHoursPerDay,
      overtimeNeededPerWeek,
      annualAttainmentPct: targetAnnualLF > 0 ? (annualLF / targetAnnualLF) * 100 : 0,
      bestYoYAttainmentPct: bestYoYLF > 0 ? (annualLF / bestYoYLF) * 100 : 0,
    };
  }, [
    workingWeeks,
    daysPerWeek,
    holidays,
    shiftsPerDay,
    hoursPerShift,
    lunchMinutesPerShift,
    breakMinutesPerShift,
    overtimeHoursPerWeek,
    tableUtilizationPct,
    downtimePct,
    headcount,
    scenarioValues,
    targetAnnualLF,
    bestYoYLF,
    dailyGoalLF,
  ]);

  const annualTargetMet = calculations.annualLF >= targetAnnualLF;
  const dailyTargetMet = calculations.lfPerDay >= dailyGoalLF;
  const staffingWarning = headcount < calculations.requiredHeadcountForUtil;

  return (
    <div className="min-h-screen bg-slate-50 p-6 text-slate-900">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">Scenario Planner</div>
            <h1 className="text-3xl font-semibold tracking-tight">Dynamax CNC Production Projection Tool</h1>
            <p className="mt-2 max-w-4xl text-sm text-slate-600">
              This version avoids the preview bundling issue and uses only standard React and HTML inputs.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 text-sm">
            <span className="rounded-full bg-slate-900 px-3 py-1 text-white">{product}</span>
            <span className="rounded-full bg-slate-200 px-3 py-1 text-slate-800">{layout === "current" ? "Current Layout" : "Nested Layout"}</span>
            {removeCrossCut ? <span className="rounded-full border border-slate-300 px-3 py-1">No Cross Cut</span> : null}
            {doubleBlade ? <span className="rounded-full border border-slate-300 px-3 py-1">Double Blade</span> : null}
          </div>
        </div>

        <div className="rounded-2xl border border-sky-200 bg-sky-50 p-4 text-sm text-sky-900">
          <div className="font-semibold">Rules in this version</div>
          <div className="mt-1">
            Table utilization is treated as layout usage on the table. Going from 50% to 100% increases required headcount from 2 to 3. Downtime is applied as a single loss percentage.
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[390px,1fr]">
          <div className="space-y-6">
            <Card title="Process Inputs">
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
                  label="Base Layout"
                  value={layout}
                  onChange={setLayout}
                  options={[
                    { value: "current", label: "Current" },
                    { value: "nested", label: "Nested" },
                  ]}
                />

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <CheckboxInput
                    label="Remove Cross Cut"
                    checked={removeCrossCut}
                    onChange={setRemoveCrossCut}
                    helper="Doubles pieces per fixture when possible and removes about 1 minute of cycle time."
                  />
                  <CheckboxInput
                    label="Double Blade"
                    checked={doubleBlade}
                    onChange={setDoubleBlade}
                    helper="Combines 4 passes into 2 and removes about 3 minutes of cycle time."
                  />
                </div>

                <CheckboxInput
                  label="Manual Override"
                  checked={manualOverride}
                  onChange={setManualOverride}
                  helper="Turn this on to use your own LF per piece, fixtures, and cycle time."
                />

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <NumberInput label="LF per Piece" value={manualOverride ? lfPerPiece : baseValues.lfPerPiece} onChange={setLfPerPiece} disabled={!manualOverride} />
                  <NumberInput label="Pieces per Fixture" value={manualOverride ? piecesPerFixture : baseValues.piecesPerFixture} onChange={setPiecesPerFixture} disabled={!manualOverride} />
                  <NumberInput label="Fixtures per Cycle" value={manualOverride ? fixturesPerCycle : baseValues.fixturesPerCycle} onChange={setFixturesPerCycle} disabled={!manualOverride} />
                  <NumberInput label="Base Cycle Time (min)" value={manualOverride ? round(cycleMinutes, 2) : round(baseValues.cycleMinutes, 2)} onChange={setCycleMinutes} step={0.01} disabled={!manualOverride} />
                </div>
              </div>
            </Card>

            <Card title="Staffing, Time, and Demand">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <NumberInput label="Headcount" value={headcount} onChange={setHeadcount} />
                <NumberInput label="Shifts per Day" value={shiftsPerDay} onChange={setShiftsPerDay} />
                <NumberInput label="Hours per Shift" value={hoursPerShift} onChange={setHoursPerShift} step={0.25} />
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
                <NumberInput label="Lunch (min / shift)" value={lunchMinutesPerShift} onChange={setLunchMinutesPerShift} />
                <NumberInput label="Breaks (min / shift)" value={breakMinutesPerShift} onChange={setBreakMinutesPerShift} />
                <NumberInput label="Working Weeks" value={workingWeeks} onChange={setWorkingWeeks} />
                <NumberInput label="Days per Week" value={daysPerWeek} onChange={setDaysPerWeek} />
                <NumberInput label="Holidays" value={holidays} onChange={setHolidays} />
                <NumberInput label="Daily LF Goal" value={dailyGoalLF} onChange={setDailyGoalLF} />
                <NumberInput label="Annual LF Goal" value={targetAnnualLF} onChange={setTargetAnnualLF} />
                <NumberInput label="Best YoY LF" value={bestYoYLF} onChange={setBestYoYLF} />
                <div className="md:col-span-2">
                  <NumberInput label="Practical Available Hours / Day Benchmark" value={practicalAvailableHoursTarget} onChange={setPracticalAvailableHoursTarget} step={0.25} />
                </div>
              </div>
            </Card>

            <Card title="Utilization & Losses">
              <div className="space-y-6">
                <RangeInput
                  label="Requested Table Utilization %"
                  value={tableUtilizationPct}
                  onChange={setTableUtilizationPct}
                  min={50}
                  max={100}
                  step={5}
                  helper="50% needs 2 heads. 100% needs 3 heads."
                />
                <RangeInput
                  label="Downtime %"
                  value={downtimePct}
                  onChange={setDowntimePct}
                  min={0}
                  max={30}
                  step={1}
                  helper="Routine daily losses are treated as already baked in here."
                />
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <MetricCard title="LF per Cycle" value={fmt0.format(round(calculations.lfPerCycle, 0))} subtitle={`${formatClock(scenarioValues.cycleMinutes)} effective cycle`} />
              <MetricCard title="LF per Hour" value={fmt0.format(round(calculations.lfPerHour, 0))} subtitle={`${fmt1.format(calculations.cyclesPerHour)} cycles/hour`} />
              <MetricCard title="LF per Shift" value={fmt0.format(round(calculations.lfPerShift, 0))} subtitle={`${dailyTargetMet ? "On pace for" : "Below"} ${fmt0.format(dailyGoalLF)} daily goal`} />
              <MetricCard title="Annual LF" value={fmt0.format(round(calculations.annualLF, 0))} subtitle={`${fmt1.format(calculations.annualAttainmentPct)}% of annual goal`} />
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <div className="text-sm text-slate-500">LF per Day</div>
                <div className="mt-1 text-3xl font-semibold">{fmt0.format(round(calculations.lfPerDay, 0))}</div>
                <div className={`mt-2 text-sm font-medium ${dailyTargetMet ? "text-emerald-700" : "text-rose-700"}`}>
                  {dailyTargetMet ? `Ahead by ${fmt0.format(round(calculations.gapToDailyGoal, 0))} LF/day` : `Short by ${fmt0.format(round(Math.abs(calculations.gapToDailyGoal), 0))} LF/day`}
                </div>
              </Card>
              <Card>
                <div className="text-sm text-slate-500">Best YoY Comparison</div>
                <div className="mt-1 text-3xl font-semibold">{fmt1.format(calculations.bestYoYAttainmentPct)}%</div>
                <div className={`mt-2 text-sm font-medium ${calculations.gapToBestYoY >= 0 ? "text-emerald-700" : "text-slate-700"}`}>
                  {calculations.gapToBestYoY >= 0 ? `Above best year by ${fmt0.format(round(calculations.gapToBestYoY, 0))} LF` : `Below best year by ${fmt0.format(round(Math.abs(calculations.gapToBestYoY), 0))} LF`}
                </div>
              </Card>
              <Card>
                <div className="text-sm text-slate-500">Required Overtime / Week</div>
                <div className="mt-1 text-3xl font-semibold">{fmt1.format(calculations.overtimeNeededPerWeek)} hrs</div>
                <div className="mt-2 text-sm text-slate-500">Hours gap to hit annual target.</div>
              </Card>
            </div>

            <Card title="Target Check">
              <div className={`rounded-2xl p-5 ${annualTargetMet ? "bg-emerald-50" : "bg-rose-50"}`}>
                <div className="text-sm text-slate-500">Annual Goal vs Projection</div>
                <div className="mt-1 text-3xl font-semibold tracking-tight">{fmt0.format(targetAnnualLF)} LF target</div>
                <div className={`mt-2 text-base font-medium ${annualTargetMet ? "text-emerald-700" : "text-rose-700"}`}>
                  {annualTargetMet ? `Projected to exceed goal by ${fmt0.format(round(calculations.gapToAnnualTarget, 0))} LF` : `Projected short by ${fmt0.format(round(Math.abs(calculations.gapToAnnualTarget), 0))} LF`}
                </div>
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-3">
                <DetailBox label="Working Days / Year" value={fmt0.format(calculations.workingDaysPerYear)} />
                <DetailBox label="Daily LF Needed" value={fmt0.format(round(calculations.dailyDemandLF, 0))} helper="Annual target divided by working days" />
                <DetailBox label="Required Hours / Day" value={fmt1.format(calculations.requiredHoursPerDayToHitTarget)} helper={`Benchmark set to ${fmt1.format(practicalAvailableHoursTarget)} hrs/day`} />
              </div>
            </Card>

            <Card title="Staffing and Utilization Logic">
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <DetailBox label="Staffing Status" value={calculations.staffingStatus} helper={`Minimum 2 | Target 3`} />
                <DetailBox label="Required Headcount" value={fmt1.format(calculations.requiredHeadcountForUtil)} helper="For requested table utilization" />
                <DetailBox label="Requested Table Utilization" value={`${tableUtilizationPct}%`} />
                <DetailBox label="Attainable Table Utilization" value={`${fmt1.format(calculations.attainableTableUtilizationPct)}%`} helper={staffingWarning ? "Reduced because staffing is below requirement" : "Supported by current staffing"} />
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <DetailBox label="Gross Hours / Day" value={fmt1.format(calculations.grossHoursPerDay)} helper={`${overtimeHoursPerWeek} OT hrs/week selected`} />
                <DetailBox label="Lunch + Break Hrs / Day" value={fmt1.format(calculations.lunchHoursPerDay + calculations.breakHoursPerDay)} helper="Only reduces coverage when staffing is below target" />
                <DetailBox label="Covered Hours / Day" value={fmt1.format(calculations.coverageHoursPerDay)} helper="Before downtime and utilization" />
                <DetailBox label="Productive Hours / Day" value={fmt1.format(calculations.productiveHoursPerDay)} helper="After downtime and attainable utilization" />
              </div>
            </Card>

            <Card title="Formula Logic in this Version">
              <div className="space-y-2 text-sm text-slate-600">
                <div>1. Base layout comes from your screenshot values for Lite, Regular, and Plus in Current or Nested mode.</div>
                <div>2. Removing cross cut doubles pieces per fixture when possible and removes about 1 minute from cycle time.</div>
                <div>3. Double blade removes about 3 minutes from cycle time.</div>
                <div>4. Required headcount scales from 2 at 50% utilization to 3 at 100% utilization.</div>
                <div>5. If staffing is short, attainable table utilization is reduced automatically.</div>
                <div>6. Downtime is applied as a single percent loss.</div>
                <div>7. Required overtime per week is calculated from the remaining hours gap to hit the annual target.</div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
