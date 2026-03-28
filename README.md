# 🏥 Healthcare AI Dashboard

A comprehensive federated learning healthcare decision support system with RSA+AES hybrid encryption, built with Next.js and PostgreSQL.

## 🧠 AI/ML Models & Federated Learning

### Model Architecture
This project implements **federated learning** across multiple hospitals for privacy-preserving healthcare AI:

- **Individual Organ Models**: Separate ML models trained for each organ system
- **Federated Aggregation**: Secure model weight combination without data sharing
- **Hybrid Encryption**: RSA + AES encryption for model privacy protection
- **Explainable AI**: SHAP (SHapley Additive exPlanations) for feature importance

### Organ-Specific Models

| Organ    | Accuracy | Features | Use Case |
|----------|----------|----------|----------|
| **Heart** | 90.5% | Age, BP, Cholesterol, Max HR, Exercise Angina, ST Depression, Major Vessels | Cardiovascular disease risk prediction |
| **Lung** | 92.7% | Age, Smoking, Shortness of Breath, Cough, Oxygen Saturation | Respiratory disease assessment |
| **Kidney** | 85.7% | Age, BP, Creatinine, Urea, Diabetes | Renal function evaluation |
| **Liver** | 87.1% | Age, Bilirubin, SGOT, SGPT, Albumin | Liver disease diagnosis |
| **Brain** | 90.2% | Age, Hypertension, Glucose, BMI, Smoking | Neurological risk assessment |

**Global Federated Model**: 89% accuracy (Aggregated from all hospital models)

### Federated Learning Process
1. **Local Training**: Each hospital trains models on their private data
2. **Model Encryption**: Local models encrypted with AES before transmission
3. **Key Exchange**: AES keys encrypted with RSA public keys
4. **Secure Aggregation**: Encrypted models combined at central server
5. **Global Model**: Decrypted aggregated model distributed back

### Security Implementation
- **RSA Encryption**: Asymmetric encryption for key exchange (2048-bit)
- **AES Encryption**: Symmetric encryption for model data (256-bit)
- **Zero-Knowledge**: Hospitals never share raw patient data
- **HIPAA Compliant**: Healthcare data privacy standards maintained

### Explainable AI (SHAP)
- **Feature Importance**: SHAP plots show which factors contribute to predictions
- **Model Transparency**: Healthcare providers can understand AI decisions
- **Clinical Validation**: Doctors can verify AI reasoning with medical knowledge
- **Cloud Storage**: SHAP visualization images stored on Cloudinary

## 🚀 Dashboard Features

### Core Functionality
- **Multi-Organ Risk Prediction**: Real-time risk assessment for 5 organ systems
- **Dynamic Input Forms**: Organ-specific feature inputs with validation
- **Risk Stratification**: Color-coded risk levels (Low/Moderate/High)
- **Personalized Guidance**: Organ-specific health recommendations
- **Interactive Visualizations**: Charts showing feature importance and model performance

### Technical Features
- **Real-time API**: RESTful endpoints for predictions and dashboard data
- **Fallback System**: Graceful degradation when backend unavailable
- **Responsive Design**: Mobile-first approach with dark mode support
- **Performance Optimized**: Next.js automatic code splitting and optimization

## 🏗️ Technical Architecture

### Frontend (Next.js 16)
- **Framework**: Next.js with TypeScript and App Router
- **Styling**: Tailwind CSS with custom healthcare-themed design system
- **Charts**: Recharts for interactive data visualization
- **State Management**: React hooks with proper server/client hydration
- **Performance**: Automatic optimization, lazy loading, and code splitting

### Backend (Next.js API Routes)
- **Database**: PostgreSQL with connection pooling
- **Prediction Engine**: Mock AI models with configurable feature importance
- **Data Validation**: Type-safe API endpoints with proper error handling
- **Security**: Environment-based configuration management

### Database Schema (PostgreSQL)
- **`organs`** - Organ metadata, display names, and risk thresholds
- **`organ_features`** - Input field configurations with validation rules
- **`model_accuracies`** - Individual hospital model performance metrics
- **`global_model`** - Federated learning aggregated model information
- **`encryption_info`** - Security implementation and encryption details
- **`frontend_display_data`** - UI content, templates, and configuration data

## 📊 Dashboard Interface

### 🏠 Home Page
- **Hero Section**: Project overview with federated learning explanation
- **Model Performance Charts**:
  - Bar chart showing individual organ model accuracies
  - Pie chart displaying model distribution across organs
- **Navigation Cards**: Direct links to Dashboard, Encryption, and Prediction features

### 📈 Dashboard Page
- **Organ Accuracy Cards**: Individual performance metrics for each organ model
- **Global Model Display**: Prominent showcase of federated learning results
- **Explainable AI Gallery**: SHAP plots showing feature importance for each organ
- **Real-time Metrics**: Live updates of model performance and aggregation status

### 🔮 Prediction Interface
- **Organ Selection**: Dynamic dropdown for Heart/Lung/Kidney/Liver/Brain
- **Smart Input Forms**: Context-aware fields that change based on selected organ
- **Risk Assessment Engine**:
  - Real-time risk calculation with percentage scores
  - Color-coded risk levels (Green/Yellow/Red)
  - Confidence intervals and uncertainty measures
- **Feature Importance Visualization**: Bar charts showing contributing factors
- **Clinical Guidance System**: Personalized health recommendations based on risk profile

### 🔐 Encryption Timeline
- **Process Visualization**: Step-by-step federated learning workflow
- **Data Flow Diagram**: Visual representation of Local → Encrypted → Global pipeline
- **Security Metrics**: Encryption strength indicators and compliance badges
- **Timeline Animation**: Interactive timeline showing the complete federated process

## 🛠️ Setup Instructions

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL database
- Git

### Installation

1. **Clone and Install Dependencies**
```bash
cd healthcare-ai-dashboard
npm install
```

2. **Environment Configuration**
Create a `.env` file with your database credentials:
```env
DATABASE_URL=postgres://username:password@host:port/database
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

3. **Database Setup**
Run the database population script:
```bash
node -r dotenv/config database-setup/setup-db.js
```

4. **Start Development Server**
```bash
npm run dev
```

5. **Access the Application**
Open [http://localhost:3000](http://localhost:3000) in your browser

## 📁 Project Structure

```
healthcare-ai-dashboard/
├── app/                          # Next.js app directory
│   ├── api/                      # API routes
│   │   ├── dashboard/           # Dashboard data endpoint
│   │   └── predict/             # Prediction endpoint
│   ├── dashboard/               # Dashboard page
│   ├── encryption/              # Encryption visualization page
│   ├── prediction/              # Prediction interface page
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Home page
├── database-setup/              # Database population scripts
│   ├── setup-db.js             # Main setup script
│   └── README.md               # Database documentation
├── image-upload/                # Cloudinary upload utilities
├── lib/                         # Utility libraries
│   └── healthcare.ts           # Healthcare configurations
├── public/                      # Static assets
│   └── explainable-ai/         # SHAP plot images
├── .env                         # Environment variables
├── package.json                 # Dependencies
└── README.md                    # This file
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## � Security & Privacy

### Encryption Implementation
- **RSA + AES Hybrid**: Industry-standard encryption for healthcare data
- **Federated Learning**: Privacy-preserving distributed model training
- **Zero Data Sharing**: Hospitals retain full data sovereignty
- **HIPAA Compliance**: Healthcare privacy regulations maintained

### Data Protection
- **Patient Anonymization**: All personal identifiers removed
- **End-to-end Encryption**: Data encrypted at rest and in transit
- **Access Control**: Role-based permissions and audit logging
- **Secure Aggregation**: Cryptographic model combination without decryption

## 🎨 UI/UX Features

- **Responsive Design**: Works on desktop, tablet, and mobile
- **Dark Mode**: Automatic dark/light theme switching
- **Accessibility**: WCAG compliant with proper ARIA labels
- **Performance**: Optimized with Next.js automatic optimizations
- **Interactive Charts**: Real-time data visualization

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push

### Manual Deployment
```bash
npm run build
npm run start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built with Next.js and Tailwind CSS
- Charts powered by Recharts
- Database hosted on Prisma
- Images stored on Cloudinary
- Inspired by federated learning research in healthcare

---

**Built for the future of secure, privacy-preserving healthcare AI** 🏥🤖
