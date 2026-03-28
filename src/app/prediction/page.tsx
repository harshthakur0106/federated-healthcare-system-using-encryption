"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { organFields, organs, type Organ } from "@/lib/healthcare";

type PredictionResponse = {
  riskLabel: "LOW RISK" | "MODERATE RISK" | "HIGH RISK";
  riskPercent: number;
  summary: string;
  details: string;
  guidance: string[];
  featureImportance: Array<{ feature: string; value: number }>;
};

const riskCardColor: Record<PredictionResponse["riskLabel"], string> = {
  "LOW RISK": "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300",
  "MODERATE RISK": "bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300",
  "HIGH RISK": "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300",
};

function initialInputs(organ: Organ): Record<string, number> {
  return organFields[organ].reduce<Record<string, number>>((acc, field) => {
    acc[field.key] = field.defaultValue;
    return acc;
  }, {});
}

export default function PredictionPage() {
  const [activeOrgan, setActiveOrgan] = useState<Organ>("Heart");
  const [inputs, setInputs] = useState<Record<string, number>>(initialInputs("Heart"));
  const [result, setResult] = useState<PredictionResponse | null>(null);
  const [loading, setLoading] = useState(false);

  // Prevent hydration mismatch when the browser/extension mutates DOM attributes
  // before React hydration completes. Must be declared before conditional return
  // so hook order stays consistent.
  const [mounted, setMounted] = useState(false);
  const fields = useMemo(() => organFields[activeOrgan], [activeOrgan]);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const onOrganChange = (organ: Organ) => {
    setActiveOrgan(organ);
    setInputs(initialInputs(organ));
    setResult(null);
  };

  const onPredict = async () => {
    setLoading(true);
    const response = await fetch("/api/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ organ: activeOrgan, inputs }),
    });
    const data = (await response.json()) as PredictionResponse;
    setResult(data);
    setLoading(false);
  };

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {organs.map((organ) => (
          <button
            key={organ}
            onClick={() => onOrganChange(organ)}
            className={`rounded-xl px-4 py-2 text-sm font-medium shadow-sm ${
              activeOrgan === organ
                ? "bg-indigo-600 text-white"
                : "bg-white text-slate-700 hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            {organ}
          </button>
        ))}
      </div>

      <article className="rounded-xl bg-white p-6 shadow-md dark:bg-slate-900">
        <h2 className="mb-4 text-lg font-semibold">{activeOrgan} Input Form</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {fields.map((field) => (
            <label key={field.key} className="flex flex-col gap-1">
              <span className="text-sm text-slate-600 dark:text-slate-300">{field.label}</span>
              <input
                type="number"
                min={field.min}
                max={field.max}
                step={field.step ?? 1}
                value={inputs[field.key]}
                onChange={(e) =>
                  setInputs((prev) => ({
                    ...prev,
                    [field.key]: Number(e.target.value),
                  }))
                }
                className="rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800"
              />
            </label>
          ))}
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={onPredict}
            disabled={loading}
            className="rounded-xl bg-indigo-600 px-8 py-3 font-semibold text-white shadow-md hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "Predicting..." : "Predict"}
          </button>
        </div>
      </article>

      {result && (
        <>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <article className={`rounded-xl p-6 shadow-md ${riskCardColor[result.riskLabel]}`}>
              <p className="text-sm font-semibold">RISK STATUS</p>
              <p className="mt-2 text-3xl font-bold">{result.riskLabel}</p>
              <p className="mt-1 text-2xl font-semibold">{result.riskPercent}%</p>
            </article>

            <article className="h-[280px] rounded-xl bg-white p-4 shadow-md dark:bg-slate-900">
              <h3 className="mb-2 text-sm font-semibold">Feature Importance</h3>
              <ResponsiveContainer width="100%" height="90%">
                <BarChart data={result.featureImportance}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="feature" tick={{ fontSize: 12 }} />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#4f46e5" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </article>
          </div>

          <article className="rounded-xl bg-white p-6 shadow-md dark:bg-slate-900">
            <h3 className="text-lg font-semibold">Explanation</h3>
            <p className="mt-2 text-slate-700 dark:text-slate-300">{result.summary}</p>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{result.details}</p>
          </article>

          <article className="rounded-xl bg-white p-6 shadow-md dark:bg-slate-900">
            <h3 className="text-lg font-semibold">Guidance</h3>
            <ul className="mt-3 space-y-2">
              {result.guidance.map((item) => (
                <li key={item} className="text-slate-700 dark:text-slate-300">
                  ✔ {item}
                </li>
              ))}
            </ul>
          </article>
        </>
      )}
    </section>
  );
}
