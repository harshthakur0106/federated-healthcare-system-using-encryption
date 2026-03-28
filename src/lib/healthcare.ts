export type Organ = "Heart" | "Lung" | "Kidney" | "Liver" | "Brain";

export type RiskLevel = "LOW RISK" | "MODERATE RISK" | "HIGH RISK";

export type InputField = {
  key: string;
  label: string;
  min: number;
  max: number;
  step?: number;
  defaultValue: number;
};

export const organs: Organ[] = ["Heart", "Lung", "Kidney", "Liver", "Brain"];

export const organAccuracies: Record<Organ, number> = {
  Heart: 90.5,
  Lung: 92.7,
  Kidney: 85.7,
  Liver: 87.1,
  Brain: 90.2,
};

export const globalAccuracy = 89;

export const organFields: Record<Organ, InputField[]> = {
  Heart: [
    { key: "age", label: "Age (years)", min: 18, max: 100, defaultValue: 45 },
    { key: "sex", label: "Sex (0=F, 1=M)", min: 0, max: 1, step: 1, defaultValue: 1 },
    { key: "trestbps", label: "Resting BP (mmHg)", min: 80, max: 200, defaultValue: 120 },
    { key: "chol", label: "Cholesterol (mg/dL)", min: 100, max: 400, defaultValue: 200 },
    { key: "thalach", label: "Max Heart Rate (bpm)", min: 60, max: 220, defaultValue: 150 },
    { key: "exang", label: "Exercise Angina (0/1)", min: 0, max: 1, step: 1, defaultValue: 0 },
    { key: "oldpeak", label: "ST Depression", min: 0, max: 6, step: 0.1, defaultValue: 1 },
    { key: "ca", label: "Major Vessels Blocked", min: 0, max: 4, step: 1, defaultValue: 0 },
  ],
  Lung: [
    { key: "age", label: "Age (years)", min: 18, max: 100, defaultValue: 50 },
    { key: "smoking", label: "Smoking (0/1)", min: 0, max: 1, step: 1, defaultValue: 0 },
    { key: "breath_shortness", label: "Shortness of Breath (0/1)", min: 0, max: 1, step: 1, defaultValue: 0 },
    { key: "cough", label: "Chronic Cough (0/1)", min: 0, max: 1, step: 1, defaultValue: 0 },
    { key: "oxygen", label: "Oxygen Saturation (%)", min: 80, max: 100, defaultValue: 96 },
  ],
  Kidney: [
    { key: "age", label: "Age (years)", min: 18, max: 100, defaultValue: 50 },
    { key: "bp", label: "Blood Pressure (mmHg)", min: 80, max: 200, defaultValue: 120 },
    { key: "creatinine", label: "Creatinine (mg/dL)", min: 0.5, max: 6, step: 0.01, defaultValue: 1.2 },
    { key: "urea", label: "Urea (mg/dL)", min: 10, max: 200, defaultValue: 30 },
    { key: "diabetes", label: "Diabetes (0/1)", min: 0, max: 1, step: 1, defaultValue: 0 },
  ],
  Liver: [
    { key: "age", label: "Age (years)", min: 18, max: 100, defaultValue: 45 },
    { key: "bilirubin", label: "Bilirubin (mg/dL)", min: 0.1, max: 6, step: 0.01, defaultValue: 1 },
    { key: "sgot", label: "SGOT/AST (U/L)", min: 10, max: 250, defaultValue: 30 },
    { key: "sgpt", label: "SGPT/ALT (U/L)", min: 10, max: 250, defaultValue: 30 },
    { key: "albumin", label: "Albumin (g/dL)", min: 2, max: 6, step: 0.01, defaultValue: 4 },
  ],
  Brain: [
    { key: "age", label: "Age (years)", min: 18, max: 100, defaultValue: 55 },
    { key: "hypertension", label: "Hypertension (0/1)", min: 0, max: 1, step: 1, defaultValue: 0 },
    { key: "glucose", label: "Glucose (mg/dL)", min: 70, max: 300, defaultValue: 110 },
    { key: "bmi", label: "BMI", min: 18, max: 40, step: 0.1, defaultValue: 25 },
    { key: "smoking", label: "Smoking (0/1)", min: 0, max: 1, step: 1, defaultValue: 0 },
  ],
};
