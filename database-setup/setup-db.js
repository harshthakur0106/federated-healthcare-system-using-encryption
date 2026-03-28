require('dotenv').config({ path: '../.env' });
const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

// Database connection
const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Read and parse the notebook file
function parseNotebook() {
  const notebookPath = path.join(__dirname, '../../Project (1) (2).ipynb');
  const notebookContent = fs.readFileSync(notebookPath, 'utf8');
  const notebook = JSON.parse(notebookContent);

  // Find the cell containing ORGAN_FEATURE_CONFIG
  const configCell = notebook.cells.find(cell =>
    cell.cell_type === 'code' &&
    cell.source.some(line => line.includes('ORGAN_FEATURE_CONFIG'))
  );

  if (!configCell) {
    throw new Error('ORGAN_FEATURE_CONFIG not found in notebook');
  }

  // Extract the Python code and evaluate it to get the config
  const code = configCell.source.join('');
  return extractConfigFromCode(code);
}

function extractConfigFromCode(code) {
  // Simple extraction - find the ORGAN_FEATURE_CONFIG dictionary
  const start = code.indexOf('ORGAN_FEATURE_CONFIG = {');
  const end = code.lastIndexOf('}');

  if (start === -1 || end === -1) {
    throw new Error('Could not extract ORGAN_FEATURE_CONFIG');
  }

  const configCode = code.substring(start, end + 1);

  // Use eval in a safe way - this is for development only
  // In production, you'd want to parse this more safely
  let config;
  try {
    // Create a safe evaluation context
    const safeEval = (code) => {
      return Function('"use strict"; return (' + code + ')')();
    };
    config = safeEval(configCode.replace('ORGAN_FEATURE_CONFIG =', ''));
  } catch (error) {
    throw new Error('Failed to parse ORGAN_FEATURE_CONFIG: ' + error.message);
  }

  return config;
}

async function createTables() {
  console.log('Creating tables...');

  await client.query(`
    CREATE TABLE IF NOT EXISTS organs (
      id SERIAL PRIMARY KEY,
      name VARCHAR(50) UNIQUE NOT NULL,
      display_name VARCHAR(100) NOT NULL,
      low_risk_threshold DECIMAL(3,2) NOT NULL,
      medium_risk_threshold DECIMAL(3,2) NOT NULL
    )
  `);

  await client.query(`
    CREATE TABLE IF NOT EXISTS organ_features (
      id SERIAL PRIMARY KEY,
      organ_id INTEGER REFERENCES organs(id),
      name VARCHAR(100) NOT NULL,
      label VARCHAR(200) NOT NULL,
      default_value DECIMAL(10,2) NOT NULL,
      UNIQUE(organ_id, name)
    )
  `);

  await client.query(`
    CREATE TABLE IF NOT EXISTS model_accuracies (
      id SERIAL PRIMARY KEY,
      organ_name VARCHAR(50) UNIQUE NOT NULL,
      accuracy DECIMAL(5,2) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await client.query(`
    CREATE TABLE IF NOT EXISTS global_model (
      id SERIAL PRIMARY KEY,
      accuracy DECIMAL(5,2) NOT NULL,
      label VARCHAR(200) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await client.query(`
    CREATE TABLE IF NOT EXISTS encryption_info (
      id SERIAL PRIMARY KEY,
      encryption_type VARCHAR(100) NOT NULL,
      description TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await client.query(`
    CREATE TABLE IF NOT EXISTS frontend_display_data (
      id SERIAL PRIMARY KEY,
      page_name VARCHAR(50) NOT NULL,
      section_name VARCHAR(100) NOT NULL,
      data_type VARCHAR(50) NOT NULL,
      content JSONB NOT NULL,
      is_encrypted BOOLEAN DEFAULT false,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(page_name, section_name, data_type)
    )
  `);

  console.log('Tables created successfully');
}

async function insertData(config) {
  console.log('Inserting organ configuration data...');

  for (const [organName, organData] of Object.entries(config)) {
    // Insert organ
    const organResult = await client.query(
      'INSERT INTO organs (name, display_name, low_risk_threshold, medium_risk_threshold) VALUES ($1, $2, $3, $4) ON CONFLICT (name) DO UPDATE SET display_name = EXCLUDED.display_name, low_risk_threshold = EXCLUDED.low_risk_threshold, medium_risk_threshold = EXCLUDED.medium_risk_threshold RETURNING id',
      [organName.toLowerCase(), organData.display_name, organData.risk_thresholds.low, organData.risk_thresholds.medium]
    );

    const organId = organResult.rows[0].id;

    // Insert features
    for (const feature of organData.features) {
      await client.query(
        'INSERT INTO organ_features (organ_id, name, label, default_value) VALUES ($1, $2, $3, $4) ON CONFLICT (organ_id, name) DO UPDATE SET label = EXCLUDED.label, default_value = EXCLUDED.default_value',
        [organId, feature.name, feature.label, feature.default]
      );
    }

    console.log(`Inserted configuration data for ${organName}`);
  }

  console.log('Organ configuration data inserted successfully');
}

async function insertDashboardData() {
  console.log('Inserting dashboard data...');

  // Insert model accuracies
  const accuracies = {
    Heart: 90.5,
    Lung: 92.7,
    Kidney: 85.7,
    Liver: 87.1,
    Brain: 90.2
  };

  for (const [organ, accuracy] of Object.entries(accuracies)) {
    await client.query(
      'INSERT INTO model_accuracies (organ_name, accuracy) VALUES ($1, $2) ON CONFLICT (organ_name) DO UPDATE SET accuracy = EXCLUDED.accuracy',
      [organ.toLowerCase(), accuracy]
    );
  }

  // Insert global model
  await client.query(
    'INSERT INTO global_model (accuracy, label) VALUES ($1, $2)',
    [89, 'Federated Learning Aggregated Model']
  );

  // Insert encryption info
  await client.query(
    'INSERT INTO encryption_info (encryption_type, description) VALUES ($1, $2)',
    ['RSA + AES Hybrid', 'Local models encrypted before aggregation']
  );

  console.log('Dashboard data inserted successfully');
}

async function insertFrontendDisplayData() {
  console.log('Inserting frontend display data...');

  const displayData = [
    // Home page data
    {
      page_name: 'home',
      section_name: 'hero_section',
      data_type: 'text_content',
      content: {
        title: 'Federated Healthcare Decision Support',
        description: 'This project is built from your notebook workflow: multi-hospital federated learning, RSA + AES encryption, and organ-wise risk prediction with explainable outputs.',
        cta_primary: 'Open Dashboard',
        cta_secondary: 'Start Prediction'
      },
      is_encrypted: false
    },
    {
      page_name: 'home',
      section_name: 'navigation_cards',
      data_type: 'page_links',
      content: {
        dashboard: { title: 'Dashboard', description: 'Overview cards, global model, encryption info.' },
        encryption: { title: 'Encryption', description: 'Timeline and secure aggregation pipeline.' },
        prediction: { title: 'Prediction', description: 'Dynamic organ form, risk score, chart and guidance.' }
      },
      is_encrypted: false
    },

    // Dashboard page data
    {
      page_name: 'dashboard',
      section_name: 'global_model',
      data_type: 'display_config',
      content: {
        title: 'GLOBAL MODEL',
        label: 'Federated Learning Aggregated Model',
        show_accuracy: true
      },
      is_encrypted: false
    },
    {
      page_name: 'dashboard',
      section_name: 'explainable_images',
      data_type: 'image_urls',
      content: {
        heart: 'https://res.cloudinary.com/dddz8js8i/image/upload/v1774723010/explainable-ai/heart_shap.png',
        lung: 'https://res.cloudinary.com/dddz8js8i/image/upload/v1774723011/explainable-ai/lung_shap.png',
        kidney: 'https://res.cloudinary.com/dddz8js8i/image/upload/v1774723012/explainable-ai/kidney_shap.png',
        liver: 'https://res.cloudinary.com/dddz8js8i/image/upload/v1774723015/explainable-ai/liver_shap.png',
        brain: 'https://res.cloudinary.com/dddz8js8i/image/upload/v1774723016/explainable-ai/brain_shap.png'
      },
      is_encrypted: false
    },

    // Prediction page data
    {
      page_name: 'prediction',
      section_name: 'risk_levels',
      data_type: 'ui_config',
      content: {
        low_risk: { color: 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300', label: 'LOW RISK' },
        moderate_risk: { color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300', label: 'MODERATE RISK' },
        high_risk: { color: 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300', label: 'HIGH RISK' }
      },
      is_encrypted: false
    },
    {
      page_name: 'prediction',
      section_name: 'guidance_templates',
      data_type: 'content_templates',
      content: {
        heart: [
          'Reduce salt intake and processed food.',
          'Exercise at least 30 minutes daily.',
          'Consult a cardiologist for routine screening.'
        ],
        lung: [
          'Quit smoking immediately.',
          'Avoid air pollution and dust.',
          'Practice breathing exercises daily.'
        ],
        kidney: [
          'Control blood pressure and diabetes.',
          'Stay hydrated and limit protein intake.',
          'Regular kidney function tests.'
        ],
        liver: [
          'Avoid alcohol consumption.',
          'Maintain healthy weight.',
          'Regular liver enzyme monitoring.'
        ],
        brain: [
          'Control hypertension and cholesterol.',
          'Regular exercise and mental stimulation.',
          'Monitor blood sugar levels.'
        ]
      },
      is_encrypted: false
    },

    // Encryption page data
    {
      page_name: 'encryption',
      section_name: 'timeline_steps',
      data_type: 'process_flow',
      content: [
        'Local model trained',
        'Encrypted using AES',
        'AES key encrypted with RSA',
        'Sent to server',
        'Decrypted',
        'Global model created'
      ],
      is_encrypted: false
    },
    {
      page_name: 'encryption',
      section_name: 'data_flow',
      data_type: 'flow_diagram',
      content: [
        'Local Data',
        'Encrypted Data',
        'Decrypted Data',
        'Global Model'
      ],
      is_encrypted: false
    },

    // Encrypted sensitive data (mock examples)
    {
      page_name: 'system',
      section_name: 'encrypted_model_weights',
      data_type: 'model_data',
      content: {
        description: 'Encrypted federated model weights from hospital A',
        encryption_method: 'AES-256 + RSA',
        status: 'secure'
      },
      is_encrypted: true
    },
    {
      page_name: 'system',
      section_name: 'patient_data_privacy',
      data_type: 'privacy_config',
      content: {
        anonymization_level: 'high',
        encryption_standard: 'HIPAA compliant',
        data_retention: '30 days',
        access_control: 'role-based'
      },
      is_encrypted: true
    }
  ];

  for (const item of displayData) {
    await client.query(
      'INSERT INTO frontend_display_data (page_name, section_name, data_type, content, is_encrypted) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (page_name, section_name, data_type) DO UPDATE SET content = EXCLUDED.content, is_encrypted = EXCLUDED.is_encrypted',
      [item.page_name, item.section_name, item.data_type, JSON.stringify(item.content), item.is_encrypted]
    );
  }

  console.log('Frontend display data inserted successfully');
}

async function main() {
  try {
    console.log('Connecting to database...');
    await client.connect();

    console.log('Parsing notebook...');
    const config = parseNotebook();
    console.log('Found organs:', Object.keys(config));

    await createTables();
    await insertData(config);
    await insertDashboardData();
    await insertFrontendDisplayData();

    console.log('Database setup completed successfully!');

  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();