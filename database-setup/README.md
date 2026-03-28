# Database Setup ✅

This folder contains scripts to populate the database with organ feature configurations and dashboard data from the Jupyter notebook and frontend.

## What was created:

### Tables:
- `organs`: Stores organ information (name, display_name, risk thresholds)
- `organ_features`: Stores feature configurations for each organ (name, label, default_value)
- `model_accuracies`: Stores accuracy percentages for each organ model
- `global_model`: Stores global federated learning model information
- `encryption_info`: Stores encryption method details
- `frontend_display_data`: Stores UI content, templates, and encrypted data references

### Data inserted:
- ✅ **5 organs** with their features and risk thresholds from the notebook
- ✅ **Model accuracies** for each organ (Heart: 90.5%, Lung: 92.7%, Kidney: 85.7%, Liver: 87.1%, Brain: 90.2%)
- ✅ **Global model** accuracy (89%) with label "Federated Learning Aggregated Model"
- ✅ **Encryption information** (RSA + AES Hybrid, "Local models encrypted before aggregation")
- ✅ **Frontend display data** (UI content, templates, image URLs, guidance messages, encrypted data references)

## Usage:
Run the setup script to populate the database:
```bash
node -r dotenv/config database-setup/setup-db.js
```

## Last Run Results:
```
Found organs: [ 'heart', 'lung', 'kidney', 'liver', 'brain' ]
Tables created successfully
Inserted configuration data for heart, lung, kidney, liver, brain
Organ configuration data inserted successfully
Dashboard data inserted successfully
Frontend display data inserted successfully
Database setup completed successfully!
```

## Frontend Display Data Includes:
- **Home page**: Hero content, navigation cards, chart data
- **Dashboard**: Global model display config, SHAP image URLs
- **Prediction**: Risk level colors, guidance templates per organ
- **Encryption**: Timeline steps, data flow diagram
- **System**: Encrypted model weights, privacy configurations

## Usage:
Run the setup script to populate the database:
```bash
node -r dotenv/config database-setup/setup-db.js
```

## Database Schema:

### organs table:
- id (SERIAL PRIMARY KEY)
- name (VARCHAR(50) UNIQUE)
- display_name (VARCHAR(100))
- low_risk_threshold (DECIMAL(3,2))
- medium_risk_threshold (DECIMAL(3,2))

### organ_features table:
- id (SERIAL PRIMARY KEY)
- organ_id (INTEGER REFERENCES organs(id))
- name (VARCHAR(100))
- label (VARCHAR(200))
- default_value (DECIMAL(10,2))

### model_accuracies table:
- id (SERIAL PRIMARY KEY)
- organ_name (VARCHAR(50) UNIQUE)
- accuracy (DECIMAL(5,2))
- created_at (TIMESTAMP)

### global_model table:
- id (SERIAL PRIMARY KEY)
- accuracy (DECIMAL(5,2))
- label (VARCHAR(200))
- created_at (TIMESTAMP)

### encryption_info table:
- id (SERIAL PRIMARY KEY)
- encryption_type (VARCHAR(100))
- description (TEXT)
- created_at (TIMESTAMP)

### frontend_display_data table:
- id (SERIAL PRIMARY KEY)
- page_name (VARCHAR(50))
- section_name (VARCHAR(100))
- data_type (VARCHAR(50))
- content (JSONB)
- is_encrypted (BOOLEAN)
- created_at (TIMESTAMP)