import { NextResponse } from "next/server";
import { globalAccuracy, organAccuracies } from "@/lib/healthcare";

export async function GET() {
  return NextResponse.json({
    models: organAccuracies,
    globalModel: {
      accuracy: globalAccuracy,
      label: "Federated Learning Aggregated Model",
    },
    encryption: {
      used: "RSA + AES Hybrid",
      note: "Local models encrypted before aggregation",
    },
  });
}
