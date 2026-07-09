"use client";

import React, { useMemo } from "react";
import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

/**
 * STATIC FREE-RIDE RESULT PAGE
 * - Clustered bar chart
 * - Risk meter
 * - Final verdict
 * - Productivity loss
 * - Export JSON / CSV
 *
 * Uses the RAW text exactly as you provided.
 */

// -------------------- RAW TEXT --------------------
const FREE_RIDE_RAW = `
============================================================
🎯 FREE–RIDE ATTACK — FEDERATED TRAINING SUMMARY
============================================================

Attack Type: FREE_RIDE
Attacker Clients: [3]
Behavior: Zero-Update + Stale Model Mix
Rounds: 5

[Round 1]
 • update_norm: 0.004 (very low)
 • cosine: 0.998
 • variance: 0.0001
 • staleness: 0.995
 • Copycat: False

[Round 2]
 • update_norm: 0.003
 • cosine: 0.999
 • staleness: 0.997
 • Zero-update behavior detected

[Round 3]
 • update_norm: 0.004
 • cosine: 1.000
 • Stale update (identical to Round 2)

[Round 4]
 • update_norm: 0.005
 • cosine: 0.999
 • Copycat score low — free riding confirmed

[Round 5]
 • update_norm: 0.004
 • cosine: 0.999
 • Persistent free–ride pattern detected

------------------------------------------------------------

📊 FREE-RIDE SIGNATURE — CLIENT 3
 • UpdateNorm: 0.004
 • Param Variance: 0.0001
 • Cosine Similarity: 0.999
 • Staleness Score: 0.996
 • Copycat Score: 0.12
 • Risk Score: 0.58 (HIGH)

------------------------------------------------------------

🔍 DETECTION ENGINE RESULTS
Detection Threshold: 0.33
High–Risk Free–Riders: [3]
Reason: Extremely low update_norm + high staleness + repeated zero updates

------------------------------------------------------------

📈 EVALUATION SUMMARY (Clean vs Free-Ride)

CLEAN MODEL:
 • Accuracy: 0.84
 • Precision: 0.61
 • Recall: 0.69
 • F1 Score: 0.65
 • AUC: 0.93

ATTACKED MODEL:
 • Accuracy: 0.81
 • Precision: 0.59
 • Recall: 0.65
 • F1 Score: 0.61
 • AUC: 0.91

PRODUCTIVITY LOSS:
 • Effective_Work_Done: 76%
 • Global_Model_Staleness: 14%
 • Productivity_Loss_Per_Round: 22%

🎯 Final Verdict: FREE–RIDE ATTACK DETECTED
`;

// -------------------- PARSERS --------------------
function extractNumber(text: string, key: string) {
  const rx = new RegExp(`${key}\\s*[:=]\\s*([0-9]*\\.?[0-9]+)`, "i");
  const m = rx.exec(text);
  return m ? parseFloat(m[1]) : null;
}

function parseFreeRide(text: string) {
  const baselineBlockMatch = /CLEAN(?: MODEL| BASELINE)?[^\n]*\n([\s\S]*?)\n\nATTACKED/i.exec(
    text
  );
  const baselineBlock = baselineBlockMatch ? baselineBlockMatch[1] : text;

  const attackedBlockMatch =
    /ATTACKED(?: MODEL| MODEL)?[^\n]*\n([\s\S]*?)(?:\n\n|PRODUCTIVITY)/i.exec(text);
  const attackedBlock = attackedBlockMatch ? attackedBlockMatch[1] : text;

  const clean = {
    accuracy: extractNumber(baselineBlock, "Accuracy"),
    precision: extractNumber(baselineBlock, "Precision"),
    recall: extractNumber(baselineBlock, "Recall"),
    f1: extractNumber(baselineBlock, "F1 Score"),
    auc: extractNumber(baselineBlock, "AUC"),
  };

  const attacked = {
    accuracy: extractNumber(attackedBlock, "Accuracy"),
    precision: extractNumber(attackedBlock, "Precision"),
    recall: extractNumber(attackedBlock, "Recall"),
    f1: extractNumber(attackedBlock, "F1 Score"),
    auc: extractNumber(attackedBlock, "AUC"),
  };

  const risk =
    extractNumber(text, "Risk Score") ?? extractNumber(text, "Risk") ?? null;

  const effective = extractNumber(text, "Effective_Work_Done") ?? null;
  const staleness = extractNumber(text, "Global_Model_Staleness") ?? null;
  const loss = extractNumber(text, "Productivity_Loss_Per_Round") ?? null;

  const reasonMatch = /Reason:\s*(.+)/i.exec(text);
  const reason = reasonMatch ? reasonMatch[1].trim() : "Not provided";

  const verdictMatch = /Final Verdict:\s*(.+)/i.exec(text);
  const verdict = verdictMatch
    ? verdictMatch[1].trim()
    : "FREE–RIDE ATTACK DETECTED";

  return { clean, attacked, risk, effective, staleness, loss, reason, verdict };
}

// -------------------- EXPORT HELPERS --------------------
function downloadJSON(filename: string, data: any) {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function downloadCSV(filename: string, data: any) {
  let csv = "Metric,Baseline,Attack,Drop\n";
  const metrics = ["accuracy", "precision", "recall", "f1", "auc"];

  const clean = data.clean || {};
  const attacked = data.attacked || {};

  metrics.forEach((m) => {
    const b = clean[m] ?? "";
    const a = attacked[m] ?? "";
    const d = b !== "" && a !== "" ? (b - a).toFixed(4) : "";
    csv += `${m},${b},${a},${d}\n`;
  });

  csv += `\nRisk Score,${data.risk ?? ""}\n`;
  csv += `Effective Work,${data.effective ?? ""}\n`;
  csv += `Model Staleness,${data.staleness ?? ""}\n`;
  csv += `Loss Per Round,${data.loss ?? ""}\n`;
  csv += `\nReason,"${(data.reason || "").replace(/"/g, '""')}"\n`;
  csv += `Verdict,"${(data.verdict || "").replace(/"/g, '""')}"\n`;

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// -------------------- RISK METER VISUAL --------------------
function RiskMeter({ percent }: { percent: number }) {
  const clamped = Math.max(0, Math.min(100, percent));
  const color =
    clamped < 30
      ? "#16a34a"
      : clamped < 60
      ? "#f59e0b"
      : "#ef4444";

  const polar = (cx: number, cy: number, r: number, angle: number) => {
    const rad = ((angle - 90) * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  };

  const start = 180;
  const end = 180 - (clamped * 180) / 100;
  const s = polar(0, 0, 60, end);
  const e = polar(0, 0, 60, start);
  const largeArcFlag = clamped > 50 ? 1 : 0;
  const d = `M ${s.x} ${s.y} A 60 60 0 ${largeArcFlag} 0 ${e.x} ${e.y}`;

  return (
    <div className="p-4 bg-slate-800 rounded border border-slate-700">
      <div className="text-sm text-slate-300 mb-2">Risk Score</div>

      <div className="flex items-center gap-4">
        <svg width={140} height={90}>
          <g transform="translate(70,70)">
            <path
              d={`M -60 0 A 60 60 0 0 1 60 0`}
              fill="none"
              stroke="#1f2937"
              strokeWidth={12}
            />
            <path
              d={d}
              fill="none"
              stroke={color}
              strokeWidth={12}
              strokeLinecap="round"
            />
          </g>
        </svg>

        <div>
          <div className="text-3xl font-bold">
            {clamped.toFixed(1)}%
          </div>
          <div className="text-sm text-slate-300">
            Classification:{" "}
            {clamped >= 60
              ? "HIGH"
              : clamped >= 30
              ? "MEDIUM"
              : "LOW"}
          </div>
        </div>
      </div>
    </div>
  );
}

// -------------------- MAIN COMPONENT --------------------
export default function FreeRideResult() {
  const parsed = useMemo(() => parseFreeRide(FREE_RIDE_RAW), []);

  const {
    clean,
    attacked,
    risk,
    effective,
    staleness,
    loss,
    reason,
    verdict,
  } = parsed;

  const graphData = [
    {
      metric: "Accuracy",
      baseline: (clean.accuracy ?? 0) * 100,
      attack: (attacked.accuracy ?? 0) * 100,
    },
    {
      metric: "Precision",
      baseline: (clean.precision ?? 0) * 100,
      attack: (attacked.precision ?? 0) * 100,
    },
    {
      metric: "Recall",
      baseline: (clean.recall ?? 0) * 100,
      attack: (attacked.recall ?? 0) * 100,
    },
    {
      metric: "F1 Score",
      baseline: (clean.f1 ?? 0) * 100,
      attack: (attacked.f1 ?? 0) * 100,
    },
    {
      metric: "AUC",
      baseline: (clean.auc ?? 0) * 100,
      attack: (attacked.auc ?? 0) * 100,
    },
  ];

  const exportPayload = {
    attack: "free_ride",
    clean,
    attacked,
    risk,
    effective,
    staleness,
    loss,
    reason,
    verdict,
  };

  return (
    <div className="min-h-screen p-8 bg-slate-900 text-white">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold">
              Free-Ride — Results 
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={() =>
                downloadJSON(
                  "freeride_result.json",
                  exportPayload
                )
              }
              className="bg-blue-600"
            >
              Export JSON
            </Button>

            <Button
              onClick={() =>
                downloadCSV(
                  "freeride_result.csv",
                  exportPayload
                )
              }
              className="bg-emerald-600"
            >
              Export CSV
            </Button>
          </div>
        </div>

        {/* Bar chart */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle>
              Baseline vs Attack Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[360px]">
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <BarChart data={graphData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#475569"
                />
                <XAxis
                  dataKey="metric"
                  tick={{ fill: "#cbd5e1" }}
                />
                <YAxis
                  tick={{ fill: "#cbd5e1" }}
                  domain={[0, 100]}
                  ticks={[
                    0, 10, 20, 30, 40, 50, 60, 70, 80,
                    90, 100,
                  ]}
                />
                <Tooltip
                  formatter={(val: number) =>
                    `${val.toFixed(2)}%`
                  }
                />
                <Legend />
                <Bar
                  dataKey="baseline"
                  name="Baseline"
                  fill="#22c55e"
                />
                <Bar
                  dataKey="attack"
                  name="Attack"
                  fill="#ef4444"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Row: Risk + Verdict + Productivity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <RiskMeter percent={(risk ?? 0) * 100} />

          <Card className="bg-slate-800 border-slate-700 p-4">
            <CardHeader>
              <CardTitle>Final Verdict</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-300">
                Attack Type: <b>Free-Ride</b>
              </p>

              <p className="text-sm text-slate-300 mt-2">
                Detected Malicious Clients:{" "}
                <b>Client 3</b>
              </p>

              <p className="text-sm text-slate-300 mt-2">
                Detection Threshold: <b>0.33</b>
              </p>

              <div className="mt-3 p-3 bg-slate-900 rounded">
                <p className="text-white font-semibold">
                  {verdict}
                </p>
                <p className="text-slate-300 text-sm mt-2">
                  {reason}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700 p-4">
            <CardHeader>
              <CardTitle>Productivity Loss</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-300">
                Effective Work Done:{" "}
                <b>{effective ?? "N/A"}%</b>
              </p>
              <p className="text-sm text-slate-300 mt-1">
                Global Model Staleness:{" "}
                <b>{staleness ?? "N/A"}%</b>
              </p>
              <p className="text-sm text-slate-300 mt-2">
                Productivity Loss / Round:{" "}
                <b>{loss ?? "N/A"}%</b>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
