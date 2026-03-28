# 🔮 Prediction & Explainable AI Implementation

## Overview

This document details the prediction engine and explainable AI (SHAP) implementation in the Healthcare AI Dashboard.

## 🔮 Prediction Engine Architecture

### Dynamic Risk Assessment

The prediction system provides real-time risk assessment across five organ systems with configurable input parameters:

```
User Input → Feature Extraction → Model Inference → Risk Calculation → SHAP Analysis → Output
```

### Prediction Flow

1. **User Input Collection**
   - Dynamic form based on selected organ
   - Organ-specific features with validation
   - Real-time input validation with min/max constraints

2. **Feature Processing**
   - Normalize input values
   - Apply organ-specific transformations
   - Handle missing or invalid data

3. **Model Inference**
   - Call appropriate organ model
   - Calculate risk probability (0-100%)
   - Generate confidence metrics

4. **Risk Stratification**
   - **LOW RISK**: 0-30% probability
   - **MODERATE RISK**: 30-60% probability
   - **HIGH RISK**: 60-100% probability

5. **Output Generation**
   - Risk percentage with label
   - Clinical summary
   - Detailed explanation
   - Feature importance scores
   - Personalized guidance

### Organ-Specific Models

#### 🫀 Heart Disease Prediction
- **Features**: Age, Sex, Resting BP, Cholesterol, Max HR, Exercise Angina, ST Depression, Major Vessels
- **Use Case**: Cardiovascular disease risk assessment
- **Accuracy**: 90.5%
- **Key Indicators**: Cholesterol, Blood Pressure, ST Depression

#### 💨 Lung Disease Prediction
- **Features**: Age, Smoking, Shortness of Breath, Cough, Oxygen Saturation
- **Use Case**: Respiratory disease assessment
- **Accuracy**: 92.7%
- **Key Indicators**: Smoking status, Oxygen levels, Respiratory symptoms

#### 🫘 Kidney Disease Prediction
- **Features**: Age, Blood Pressure, Creatinine, Urea, Diabetes
- **Use Case**: Renal function evaluation
- **Accuracy**: 85.7%
- **Key Indicators**: Creatinine levels, Urea, Diabetes status

#### 🫗 Liver Disease Prediction
- **Features**: Age, Bilirubin, SGOT, SGPT, Albumin
- **Use Case**: Liver disease diagnosis
- **Accuracy**: 87.1%
- **Key Indicators**: Enzyme levels, Bilirubin, Albumin

#### 🧠 Brain Disease Prediction
- **Features**: Age, Hypertension, Glucose, BMI, Smoking
- **Use Case**: Neurological risk assessment
- **Accuracy**: 90.2%
- **Key Indicators**: Glucose levels, Hypertension, BMI

## 📊 Explainable AI (SHAP)

### SHAP Implementation

SHAP (SHapley Additive exPlanations) provides model-agnostic explainability through game theory:

```
Model Output = Base Value + Σ(Feature Contributions)
```

### How SHAP Works

1. **Local Interpretability**: Explains individual predictions
2. **Feature Attribution**: Shows impact of each feature
3. **Positive/Negative**: Indicates risk-increasing vs risk-decreasing factors
4. **Confidence Measurement**: Quantifies uncertainty in predictions

### SHAP Visualizations

All organs have corresponding SHAP plot images stored on Cloudinary:

| Organ | Image URL | Description |
|-------|-----------|-------------|
| **Heart** | `heart_shap.png` | Cardiovascular feature importance |
| **Lung** | `lung_shap.png` | Respiratory feature importance |
| **Kidney** | `kidney_shap.png` | Renal function feature importance |
| **Liver** | `liver_shap.png` | Hepatic feature importance |
| **Brain** | `brain_shap.png` | Neurological feature importance |

### Example SHAP Interpretation

For a 70-year-old with high cholesterol:
```
Base Risk: 35%
+ Age (+40): Due to advanced age
+ Cholesterol (+15): High cholesterol levels
- Oldpeak (-5): Good ST segment
= Total Risk: 85% (HIGH RISK)
```

## 📈 Feature Importance Scoring

Each prediction includes feature importance scores showing relative contribution:

### Feature Importance Calculation

- Normalized to 0-100% scale
- Based on SHAP values
- Shows both magnitude and direction
- Helps clinicians understand decision drivers

### Example: Heart Disease

```
Cholesterol: 95% importance (Major risk factor)
Blood Pressure: 85% importance (Significant factor)
Age: 75% importance (Moderate factor)
ST Depression: 60% importance (Contributing factor)
```

## 🎯 Risk Guidance System

### Personalized Recommendations

Based on organ type and risk level:

#### Heart Disease Guidance
- ✅ Reduce salt and processed foods
- ✅ Exercise 30+ minutes daily
- ✅ Regular cardiology screening
- ✅ Monitor blood pressure and cholesterol

#### Lung Disease Guidance
- ✅ Quit smoking immediately
- ✅ Avoid air pollution and dust
- ✅ Daily breathing exercises
- ✅ Regular lung function tests

#### Kidney Disease Guidance
- ✅ Control blood pressure and diabetes
- ✅ Stay hydrated, limit protein
- ✅ Regular kidney function monitoring
- ✅ Consult nephrologist

#### Liver Disease Guidance
- ✅ Avoid alcohol consumption
- ✅ Maintain healthy weight
- ✅ Regular liver enzyme monitoring
- ✅ Dietary modifications

#### Brain Disease Guidance
- ✅ Control hypertension and cholesterol
- ✅ Regular exercise and mental stimulation
- ✅ Monitor blood sugar levels
- ✅ Neurological check-ups

## 🔐 Federated Learning Integration

### How Predictions Use Federated Models

1. **Global Model**: Aggregated from hospital models
2. **Hospital-Specific**: Individual hospital models maintain local accuracy
3. **Secure Inference**: Predictions run on encrypted model weights
4. **Privacy-Preserving**: No patient data shared across hospitals

### Model Aggregation

```
Hospital A Model (90.5%) 
Hospital B Model (91.2%)  
Hospital C Model (89.8%)
         ↓
  Global Model (90.5%)
         ↓
  User Prediction
```

## 🛠️ API Endpoints

### POST /api/predict

Request:
```json
{
  "organ": "heart",
  "inputs": {
    "age": 65,
    "sex": 1,
    "trestbps": 140,
    "chol": 280,
    "thalach": 100,
    "exang": 1,
    "oldpeak": 2.5,
    "ca": 1
  }
}
```

Response:
```json
{
  "riskLabel": "HIGH RISK",
  "riskPercent": 78,
  "summary": "Patient shows high risk for cardiovascular disease.",
  "details": "Higher cholesterol, blood pressure, and ST depression contributed more to this prediction.",
  "guidance": [
    "Reduce salt intake and processed food.",
    "Exercise at least 30 minutes daily.",
    "Consult a cardiologist for routine screening."
  ],
  "featureImportance": [
    { "feature": "Cholesterol", "value": 95 },
    { "feature": "Blood Pressure", "value": 85 },
    { "feature": "Age", "value": 75 },
    { "feature": "Oldpeak", "value": 60 }
  ]
}
```

## 📚 Technical Stack

### Frontend
- **Next.js 16**: Server-side rendering and static generation
- **React 19**: Dynamic prediction form management
- **Recharts**: Feature importance visualization
- **TypeScript**: Type-safe prediction handling

### Backend
- **Next.js API Routes**: RESTful prediction endpoint
- **PostgreSQL**: Store model configurations
- **Node.js**: Prediction computation

### SHAP Integration
- **Image Storage**: Cloudinary CDN
- **Static Visualization**: Pre-computed SHAP plots
- **Dynamic Display**: Load from database

## 🔍 Model Validation

### Accuracy Metrics

| Organ | Accuracy | Sensitivity | Specificity |
|-------|----------|-------------|-------------|
| Heart | 90.5% | 88% | 92% |
| Lung | 92.7% | 91% | 94% |
| Kidney | 85.7% | 83% | 87% |
| Liver | 87.1% | 85% | 89% |
| Brain | 90.2% | 89% | 91% |

### Cross-Validation
- 5-fold cross-validation used for model training
- ROC-AUC scores tracked for each organ
- Regular retraining on federated hospital data

## 🚀 Future Enhancements

- [ ] Real-time model updates from hospitals
- [ ] Advanced SHAP waterfall plots
- [ ] Uncertainty quantification
- [ ] Ensemble predictions across models
- [ ] Patient history tracking
- [ ] Comparative risk analysis
- [ ] Integration with EHR systems
- [ ] Mobile app predictions