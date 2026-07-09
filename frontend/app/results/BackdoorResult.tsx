"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

export default function BackdoorResult() {
  const router = useRouter();

  // ---------------------------------------------------------
  // ⭐ RAW STATIC BACKDOOR OUTPUT (placed exactly as your terminal output)
  // ---------------------------------------------------------

  const rawText = `
BACKDOOR ATTACK — FEDERATED TRAINING SUMMARY

BACKDOOR SIGNATURE — CLIENT 4
 • Poison Ratio: 0.12
 • Trigger Strength: 0.85
 • Target Label: 0
 • UpdateNorm: 12.6
 • Param Variance: 0.9
 • Cosine Similarity: 0.97
 • Risk Score: 0.56

EVALUATION SUMMARY (Clean vs Triggered)

CLEAN BASELINE MODEL:
 • Accuracy: 0.84
 • Precision: 0.61
 • Recall: 0.69
 • F1 Score: 0.65
 • AUC: 0.93

ATTACKED MODEL (Triggered Performance):
 • Accuracy: 0.81
 • Precision: 0.58
 • Recall: 0.66
 • F1 Score: 0.60
 • AUC: 0.90
`;

  // ---------------------------------------------------------
  // Extraction Helper Function
  // ---------------------------------------------------------
  const extract = (txt: string, key: string, section?: string): number => {
    let target = txt;
    if (section) {
      const secRegex = new RegExp(`${section}[\\s\\S]*?(?=\\n\\n|$)`, "i");
      const secMatch = txt.match(secRegex);
      if (secMatch) target = secMatch[0];
    }
    const match = target.match(new RegExp(`${key}:\\s*([0-9.]+)`, "i"));
    return match ? parseFloat(match[1]) : 0;
  };

  // ---------------------------------------------------------
  // Parsed Values
  // ---------------------------------------------------------
  const baseline = {
    accuracy: extract(rawText, "Accuracy", "CLEAN BASELINE MODEL"),
    precision: extract(rawText, "Precision", "CLEAN BASELINE MODEL"),
    recall: extract(rawText, "Recall", "CLEAN BASELINE MODEL"),
    f1: extract(rawText, "F1 Score", "CLEAN BASELINE MODEL"),
    auc: extract(rawText, "AUC", "CLEAN BASELINE MODEL"),
  };

  const triggered = {
    accuracy: extract(rawText, "Accuracy", "ATTACKED MODEL \\(Triggered Performance\\)"),
    precision: extract(rawText, "Precision", "ATTACKED MODEL \\(Triggered Performance\\)"),
    recall: extract(rawText, "Recall", "ATTACKED MODEL \\(Triggered Performance\\)"),
    f1: extract(rawText, "F1 Score", "ATTACKED MODEL \\(Triggered Performance\\)"),
    auc: extract(rawText, "AUC", "ATTACKED MODEL \\(Triggered Performance\\)"),
  };

  const signature = {
    poisonRatio: extract(rawText, "Poison Ratio"),
    triggerStrength: extract(rawText, "Trigger Strength"),
    updateNorm: extract(rawText, "UpdateNorm"),
    paramVariance: extract(rawText, "Param Variance"),
    cosine: extract(rawText, "Cosine Similarity"),
    riskScore: extract(rawText, "Risk Score"),
  };

  // ---------------------------------------------------------
  // BAR GRAPH FINAL DATA (Baseline vs Triggered)
  // ---------------------------------------------------------
  const graphData = [
    {
      metric: "Accuracy",
      baseline: baseline.accuracy * 100,
      triggered: triggered.accuracy * 100,
    },
    {
      metric: "Precision",
      baseline: baseline.precision * 100,
      triggered: triggered.precision * 100,
    },
    {
      metric: "Recall",
      baseline: baseline.recall * 100,
      triggered: triggered.recall * 100,
    },
    {
      metric: "F1 Score",
      baseline: baseline.f1 * 100,
      triggered: triggered.f1 * 100,
    },
    {
      metric: "AUC",
      baseline: baseline.auc * 100,
      triggered: triggered.auc * 100,
    },
  ];

  // ---------------------------------------------------------
  // RISK CLASSIFICATION
  // ---------------------------------------------------------
  const riskLabel =
    signature.riskScore < 0.33
      ? "LOW"
      : signature.riskScore < 0.66
      ? "MEDIUM"
      : "HIGH";

  // ---------------------------------------------------------
  // UI START
  // ---------------------------------------------------------

  return (
    <div className="min-h-screen p-6 bg-slate-900 text-white">
      <div className="max-w-6xl mx-auto">

        <Button
          onClick={() => router.push("/upload")}
          variant="outline"
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Button>

        <h1 className="text-3xl font-bold mb-6">Backdoor Attack Result</h1>

        {/* ================= BAR GRAPH ================= */}
        <Card className="bg-slate-800 border-slate-700 mb-6">
          <CardHeader>
            <CardTitle>Baseline vs Triggered Performance</CardTitle>
          </CardHeader>

          <CardContent className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={graphData} barGap={6} barCategoryGap="20%">
                <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                <XAxis dataKey="metric" tick={{ fill: "#cbd5e1" }} />
                <YAxis
                  tick={{ fill: "#cbd5e1" }}
                  domain={[0, 100]}
                  ticks={[0, 20, 40, 60, 80, 100]}
                />
                <Tooltip />
                <Legend />

                <Bar dataKey="baseline" name="Baseline" fill="#22c55e" radius={[4, 4, 0, 0]} />
                <Bar dataKey="triggered" name="Triggered" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* ================= SIGNATURE + RISK ================= */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Risk Score */}
          <Card className="bg-slate-800 border-slate-700 p-6 text-center">
            <CardHeader>
              <CardTitle>Risk Score</CardTitle>
            </CardHeader>

            <CardContent>
              <div className="text-4xl font-bold text-yellow-400 mb-2">
                {(signature.riskScore * 100).toFixed(1)}%
              </div>
              <p className="text-lg text-slate-300">{riskLabel} RISK</p>
            </CardContent>
          </Card>

          {/* Backdoor Signature */}
          <Card className="bg-slate-800 border-slate-700 p-6">
            <CardHeader>
              <CardTitle>Backdoor Signature</CardTitle>
            </CardHeader>

            <CardContent className="space-y-1">
              <p>Poison Ratio: <b>{(signature.poisonRatio * 100).toFixed(1)}%</b></p>
              <p>Trigger Strength: <b>{(signature.triggerStrength * 100).toFixed(1)}%</b></p>

              {/* UPDATE NORM AS 12.6% */}
              <p>UpdateNorm: <b>{signature.updateNorm}%</b></p>

              {/* PARAM VARIANCE 90% */}
              <p>Param Variance: <b>{(signature.paramVariance * 100).toFixed(1)}%</b></p>

              {/* COSINE SIMILARITY 97% */}
              <p>Cosine Similarity: <b>{(signature.cosine * 100).toFixed(1)}%</b></p>
            </CardContent>
          </Card>

          {/* Verdict */}
          <Card className="bg-slate-800 border-slate-700 p-6">
            <CardHeader>
              <CardTitle>Final Verdict</CardTitle>
            </CardHeader>

            <CardContent>
              <p className="text-green-400 font-bold">Backdoor Attack Detected</p>
              <p>Malicious Client: <b>Client 4</b></p>
              <p>Trigger successfully embedded into global model</p>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}
