"use client";

import { useEffect, useState } from "react";
import { organs } from "@/lib/healthcare";

type DashboardResponse = {
  models: Record<string, number>;
  globalModel: { accuracy: number; label: string };
  encryption: { used: string; note: string };
};

const fallbackData: DashboardResponse = {
  models: { Heart: 90.5, Lung: 92.7, Kidney: 85.7, Liver: 87.1, Brain: 90.2 },
  globalModel: { accuracy: 89, label: "Federated Learning Aggregated Model" },
  encryption: { used: "RSA + AES Hybrid", note: "Local models encrypted before aggregation" },
};

export default function DashboardPage() {
  const [data, setData] = useState<DashboardResponse>(fallbackData);

  const explainableCards = [
    { organ: "Heart", img: "/explainable-ai/heart_shap.png" },
    { organ: "Lung", img: "/explainable-ai/lung_shap.png" },
    { organ: "Kidney", img: "/explainable-ai/kidney_shap.png" },
    { organ: "Liver", img: "/explainable-ai/liver_shap.png" },
    { organ: "Brain", img: "/explainable-ai/brain_shap.png" },
  ];

  useEffect(() => {
    fetch("/api/dashboard")
      .then((res) => (res.ok ? res.json() : fallbackData))
      .then((res) => setData(res))
      .catch(() => setData(fallbackData));
  }, []);

  return (
    <section className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {organs.map((organ) => (
          <article key={organ} className="rounded-xl bg-white p-4 shadow-md dark:bg-slate-900">
            <p className="text-sm text-slate-500 dark:text-slate-400">{organ}</p>
            <p className="mt-2 text-3xl font-bold">{data.models[organ]?.toFixed(1)}%</p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Model Accuracy</p>
          </article>
        ))}
      </div>

      <article className="rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 p-6 text-center text-white shadow-md">
        <h2 className="text-lg font-semibold">GLOBAL MODEL</h2>
        <p className="mt-2 text-4xl font-bold">{data.globalModel.accuracy}%</p>
        <p className="mt-2 text-sm">{data.globalModel.label}</p>
      </article>

      <article className="rounded-xl bg-white p-6 shadow-md dark:bg-slate-900">
        <h3 className="text-lg font-semibold">Encryption Used</h3>
        <p className="mt-2 text-2xl font-bold text-indigo-600 dark:text-indigo-400">{data.encryption.used}</p>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{data.encryption.note}</p>
      </article>

      <article className="rounded-xl bg-white p-6 shadow-md dark:bg-slate-900">
        <h3 className="text-lg font-semibold">Explainable AI Charts (Static)</h3>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          These are SHAP-based explainability plots for a sample patient generated in your notebook. Displayed
          statically in the UI.
        </p>

        <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {explainableCards.map((card) => (
            <div
              key={card.organ}
              className="rounded-xl border border-slate-200 bg-slate-50 p-3 shadow-sm dark:border-slate-700 dark:bg-slate-800"
            >
              <p className="mb-2 text-sm font-semibold text-slate-800 dark:text-slate-100">{card.organ}</p>
              <img
                src={card.img}
                alt={`${card.organ} explainable AI (SHAP) chart`}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </article>
    </section>
  );
}
