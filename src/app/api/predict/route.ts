import { NextResponse } from "next/server";
import type { Organ, RiskLevel } from "@/lib/healthcare";

type RequestPayload = {
  organ: Organ;
  inputs: Record<string, number>;
};

type PredictionResult = {
  riskLabel: RiskLevel;
  riskPercent: number;
  summary: string;
  details: string;
  guidance: string[];
  featureImportance: Array<{ feature: string; value: number }>;
};

const toPct = (value: number) => Math.max(1, Math.min(99, Math.round(value)));

function labelFromPercent(percent: number): RiskLevel {
  if (percent < 30) return "LOW RISK";
  if (percent < 60) return "MODERATE RISK";
  return "HIGH RISK";
}

function predict(organ: Organ, x: Record<string, number>): PredictionResult {
  if (organ === "Heart") {
    const chol = x.chol ?? 200;
    const bp = x.trestbps ?? 120;
    const age = x.age ?? 45;
    const oldpeak = x.oldpeak ?? 1;
    const score = toPct((chol - 150) * 0.16 + (bp - 100) * 0.25 + age * 0.2 + oldpeak * 8);
    const guidance = [
      "Reduce salt intake and processed food.",
      "Exercise at least 30 minutes daily.",
      "Consult a cardiologist for routine screening.",
    ];
    return {
      riskLabel: labelFromPercent(score),
      riskPercent: score,
      summary: `Patient shows ${labelFromPercent(score).toLowerCase()} for cardiovascular disease.`,
      details: "Higher cholesterol, blood pressure, and ST depression contributed more to this prediction.",
      guidance,
      featureImportance: [
        { feature: "Cholesterol", value: Math.min(95, Math.round((chol / 400) * 100)) },
        { feature: "Blood Pressure", value: Math.min(95, Math.round((bp / 200) * 100)) },
        { feature: "Age", value: Math.min(95, Math.round((age / 100) * 100)) },
        { feature: "Oldpeak", value: Math.min(95, Math.round((oldpeak / 6) * 100)) },
      ],
    };
  }

  if (organ === "Lung") {
    const oxygen = x.oxygen ?? 96;
    const smoking = x.smoking ?? 0;
    const breath = x.breath_shortness ?? 0;
    const cough = x.cough ?? 0;
    const age = x.age ?? 50;
    const score = toPct((100 - oxygen) * 4.2 + smoking * 16 + breath * 15 + cough * 10 + age * 0.22);
    return {
      riskLabel: labelFromPercent(score),
      riskPercent: score,
      summary: `Patient shows ${labelFromPercent(score).toLowerCase()} for respiratory complications.`,
      details: "Lower oxygen saturation and smoking-related variables increased lung risk score.",
      guidance: [
        "Avoid smoking and polluted environments.",
        "Track oxygen saturation if symptoms continue.",
        "Seek pulmonary consultation for persistent cough or breathlessness.",
      ],
      featureImportance: [
        { feature: "Oxygen", value: Math.min(99, Math.round(((100 - oxygen) / 20) * 100)) },
        { feature: "Smoking", value: smoking * 100 },
        { feature: "Breath Shortness", value: breath * 100 },
        { feature: "Cough", value: cough * 100 },
      ],
    };
  }

  if (organ === "Kidney") {
    const creatinine = x.creatinine ?? 1.2;
    const urea = x.urea ?? 30;
    const bp = x.bp ?? 120;
    const diabetes = x.diabetes ?? 0;
    const score = toPct(creatinine * 12 + urea * 0.35 + (bp - 80) * 0.25 + diabetes * 15);
    return {
      riskLabel: labelFromPercent(score),
      riskPercent: score,
      summary: `Patient shows ${labelFromPercent(score).toLowerCase()} for kidney disease.`,
      details: "Creatinine and urea are dominant factors; diabetes and blood pressure further increase risk.",
      guidance: [
        "Maintain hydration and controlled sodium intake.",
        "Monitor creatinine and urea regularly.",
        "Consult a nephrologist for elevated renal markers.",
      ],
      featureImportance: [
        { feature: "Creatinine", value: Math.min(95, Math.round((creatinine / 6) * 100)) },
        { feature: "Urea", value: Math.min(95, Math.round((urea / 200) * 100)) },
        { feature: "Blood Pressure", value: Math.min(95, Math.round((bp / 200) * 100)) },
        { feature: "Diabetes", value: diabetes * 100 },
      ],
    };
  }

  if (organ === "Liver") {
    const bilirubin = x.bilirubin ?? 1;
    const sgot = x.sgot ?? 30;
    const sgpt = x.sgpt ?? 30;
    const albumin = x.albumin ?? 4;
    const score = toPct(bilirubin * 12 + sgot * 0.18 + sgpt * 0.18 + (5 - albumin) * 8);
    return {
      riskLabel: labelFromPercent(score),
      riskPercent: score,
      summary: `Patient shows ${labelFromPercent(score).toLowerCase()} for liver dysfunction.`,
      details: "Elevated bilirubin and liver enzymes indicate possible hepatic stress.",
      guidance: [
        "Avoid alcohol and hepatotoxic medicines.",
        "Repeat liver function tests after medical advice.",
        "Follow a balanced, low-fat diet.",
      ],
      featureImportance: [
        { feature: "Bilirubin", value: Math.min(95, Math.round((bilirubin / 6) * 100)) },
        { feature: "SGOT", value: Math.min(95, Math.round((sgot / 250) * 100)) },
        { feature: "SGPT", value: Math.min(95, Math.round((sgpt / 250) * 100)) },
        { feature: "Albumin", value: Math.min(95, Math.round(((6 - albumin) / 4) * 100)) },
      ],
    };
  }

  const glucose = x.glucose ?? 110;
  const hypertension = x.hypertension ?? 0;
  const bmi = x.bmi ?? 25;
  const smoking = x.smoking ?? 0;
  const age = x.age ?? 55;
  const score = toPct((glucose - 70) * 0.22 + hypertension * 25 + (bmi - 18) * 1.4 + smoking * 14 + age * 0.15);
  return {
    riskLabel: labelFromPercent(score),
    riskPercent: score,
    summary: `Patient shows ${labelFromPercent(score).toLowerCase()} for neurological events.`,
    details: "Hypertension, glucose imbalance, BMI, and smoking increased predicted stroke-related risk.",
    guidance: [
      "Control blood pressure and glucose levels.",
      "Adopt regular physical activity and weight management.",
      "Consult a neurologist if warning symptoms appear.",
    ],
    featureImportance: [
      { feature: "Hypertension", value: hypertension * 100 },
      { feature: "Glucose", value: Math.min(95, Math.round((glucose / 300) * 100)) },
      { feature: "BMI", value: Math.min(95, Math.round((bmi / 40) * 100)) },
      { feature: "Smoking", value: smoking * 100 },
    ],
  };
}

export async function POST(request: Request) {
  const payload = (await request.json()) as RequestPayload;
  if (!payload.organ || !payload.inputs) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }
  return NextResponse.json(predict(payload.organ, payload.inputs));
}
