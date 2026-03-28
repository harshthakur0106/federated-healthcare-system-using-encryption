"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
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

export default function HomePage() {
  const [data, setData] = useState<DashboardResponse>(fallbackData);

  useEffect(() => {
    fetch("/api/dashboard")
      .then((res) => (res.ok ? res.json() : fallbackData))
      .then((res) => setData(res))
      .catch(() => setData(fallbackData));
  }, []);

  return (
    <section className="space-y-6">
      <article className="rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 p-6 text-white shadow-md md:p-8">
        <p className="inline-flex rounded-full bg-white/20 px-3 py-1 text-xs font-semibold">AI Insight</p>
        <h2 className="mt-4 text-2xl font-bold md:text-3xl">Federated Healthcare Decision Support</h2>
        <p className="mt-2 max-w-3xl text-sm text-indigo-100 md:text-base">
          This project is built from your notebook workflow: multi-hospital federated learning, RSA + AES encryption,
          and organ-wise risk prediction with explainable outputs.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link href="/dashboard" className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-indigo-700">
            Open Dashboard
          </Link>
          <Link
            href="/prediction"
            className="rounded-xl border border-white/50 px-4 py-2 text-sm font-semibold text-white"
          >
            Start Prediction
          </Link>
        </div>
      </article>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <article className="h-[320px] rounded-xl bg-white p-4 shadow-md dark:bg-slate-900">
          <h3 className="mb-2 text-lg font-semibold">Organ Model Accuracy</h3>
          <ResponsiveContainer width="100%" height="88%">
            <BarChart
              data={organs.map((organ) => ({
                name: organ,
                accuracy: data.models[organ],
              }))}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[75, 100]} />
              <Tooltip />
              <Bar dataKey="accuracy" fill="#4f46e5" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </article>

        <article className="h-[320px] rounded-xl bg-white p-4 shadow-md dark:bg-slate-900">
          <h3 className="mb-2 text-lg font-semibold">Model Distribution</h3>
          <ResponsiveContainer width="100%" height="88%">
            <PieChart>
              <Pie
                data={organs.map((organ) => ({ name: organ, value: data.models[organ] }))}
                dataKey="value"
                nameKey="name"
                outerRadius={95}
                fill="#6366f1"
                label
              />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </article>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Link href="/dashboard" className="rounded-xl bg-white p-5 shadow-md transition hover:shadow-lg dark:bg-slate-900">
          <p className="text-sm text-slate-500">Page 1</p>
          <h4 className="mt-1 text-xl font-semibold">Dashboard</h4>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Overview cards, global model, encryption info.</p>
        </Link>
        <Link href="/encryption" className="rounded-xl bg-white p-5 shadow-md transition hover:shadow-lg dark:bg-slate-900">
          <p className="text-sm text-slate-500">Page 2</p>
          <h4 className="mt-1 text-xl font-semibold">Encryption</h4>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Timeline and secure aggregation pipeline.</p>
        </Link>
        <Link href="/prediction" className="rounded-xl bg-white p-5 shadow-md transition hover:shadow-lg dark:bg-slate-900">
          <p className="text-sm text-slate-500">Page 3</p>
          <h4 className="mt-1 text-xl font-semibold">Prediction</h4>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Dynamic organ form, risk score, chart and guidance.</p>
        </Link>
      </div>
    </section>
  );
}
