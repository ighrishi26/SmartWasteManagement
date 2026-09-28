# AI-Based Smart Waste Generation Prediction and Collection Planning System

A full-stack AI and machine learning-based waste management system that analyzes historical waste data, predicts future waste generation, detects anomalies, and supports data-driven waste collection planning.

The system is built using **React + Vite** for the frontend and **Django REST Framework** for the backend.

---

## Project Overview

Traditional waste management systems often rely on fixed schedules and manual estimation. This project uses historical waste data and machine learning to provide a centralized platform for monitoring, analyzing, predicting, and planning waste collection.

The system considers factors such as:

- Waste quantity
- Location
- Waste type
- Day of the week
- Holiday status
- Special events
- Footfall
- Temperature
- Rainfall

These factors are used for analytics, machine learning prediction, anomaly detection, and collection planning.

---

## Objectives

- Manage waste generation records through a centralized web application.
- Analyze historical waste generation patterns.
- Study the effect of location, waste type, footfall, weather, holidays, and special events.
- Train and compare multiple machine learning regression models.
- Predict future waste generation.
- Detect unusual waste-generation records.
- Assign collection priorities based on waste quantity.
- Generate collection planning recommendations.
- Provide role-based access to system modules.
- Export waste data and reports for further analysis.

---

## Key Features

### 1. Waste Record Management

The system provides complete waste record management functionality.

Features include:

- Add waste records
- View waste records
- Edit waste records
- Delete waste records
- Search waste records
- Filter records
- Date-based filtering
- Waste-type filtering
- Holiday filtering
- Special-event filtering
- Backend data validation

---

### 2. CSV Import and Export

The system supports bulk waste data management through CSV files.

#### CSV Import

- Upload waste data
- Validate required columns
- Clean imported data
- Validate numeric values
- Detect duplicate records
- Report invalid rows
- Import valid records into the database

#### CSV Export

Waste records can be exported as CSV files for external analysis and reporting.

---

### 3. Analytics Dashboard

The analytics module provides insights into historical waste generation.

The system provides:

- Total waste
- Average waste
- Maximum waste
- Minimum waste
- Total records
- Daily waste trends
- Monthly waste trends
- Waste-type analysis
- Location-based analysis
- Holiday analysis
- Special-event analysis
- Footfall analysis

The dashboard uses interactive charts to make waste patterns easier to understand.

---

## Machine Learning

The project implements multiple machine learning regression algorithms for waste generation prediction.

### Algorithms Used

1. **Linear Regression**
2. **Random Forest Regressor**
3. **Gradient Boosting Regressor**

The models are trained using historical waste records.

---

### Machine Learning Features

The prediction model uses:

- Day
- Location
- Waste type
- Holiday
- Special event
- Footfall
- Temperature
- Rainfall

Categorical features are converted using one-hot encoding before model training.

---

### Model Evaluation

The trained models are evaluated using:

- **Mean Absolute Error (MAE)**
- **Root Mean Squared Error (RMSE)**
- **R² Score**

The system compares the trained models and selects the model with the lowest MAE as the best model.

The selected model is saved using **Joblib** and reused for future predictions.

---

## Waste Prediction

The prediction module allows users to enter environmental and operational conditions and estimate expected waste generation.

### Input Parameters

- Day
- Location
- Waste type
- Holiday status
- Special-event status
- Footfall
- Temperature
- Rainfall

### Prediction Output

The system returns:

- Predicted waste quantity in kilograms
- Collection priority
- Priority label
- Model used for prediction

---

## Anomaly Detection

The system uses **Isolation Forest** for anomaly detection.

The anomaly detection system considers:

- Waste quantity
- Footfall
- Temperature
- Rainfall
- Holiday status
- Special-event status

Each record is classified as either:

- Normal
- Anomalous

This helps identify unusual waste-generation patterns that may require further investigation.

---

## Collection Planning

The collection planning module aggregates waste data by location and assigns collection priorities.

### Default Collection Thresholds

| Waste Quantity | Priority |
|---|---|
| Below 50 kg | Low |
| 50 kg to below 150 kg | Medium |
| 150 kg or more | High |

The system also provides a collection recommendation for each location.

Examples include:

- Routine collection
- Schedule collection
- Collect immediately

---

## Recommendations and Insights

The recommendation module analyzes the available waste records and identifies useful operational patterns.

It can identify:

- High-waste locations
- Dominant waste categories
- Increased waste during special events
- Increased waste during holidays
- High-volume waste records
- Low average waste conditions

Recommendations are classified by priority.

---

## Reports

The reporting module allows users to download waste data in CSV format.

The report includes:

- Date
- Location
- Waste type
- Quantity
- Day
- Holiday status
- Special-event status
- Footfall
- Temperature
- Rainfall

---

# Authentication and Role-Based Access Control

The application uses token-based authentication with Django REST Framework.

Three user roles are supported:

### Administrator

Full system access, including:

- Waste record management
- CSV import/export
- Analytics
- Machine learning
- Prediction
- Anomaly detection
- Collection planning
- Recommendations
- Reports
- Settings

### Operator

Operational access including:

- View waste records
- Create records
- Edit records
- CSV import/export
- Analytics
- Prediction
- Anomaly detection
- Collection planning
- Recommendations
- Reports

Operators cannot delete records or access machine learning management and system settings.

### Viewer

Read-oriented access including:

- View waste records
- Analytics
- Prediction
- Anomaly detection
- Collection planning
- Recommendations
- Reports

Viewers cannot modify records, import CSV files, train models, or access system settings.

---

# Technology Stack

## Frontend

- React
- Vite
- React Router
- Axios
- Lucide React
- Recharts
- JavaScript

## Backend

- Python
- Django
- Django REST Framework
- Django CORS Headers

## Database

- SQLite

## Machine Learning and Data Processing

- Pandas
- NumPy
- Scikit-learn
- Joblib

## Visualization

- Recharts
- Matplotlib
- Seaborn

---

# System Architecture

```text
                    ┌──────────────────────┐
                    │      React UI        │
                    │      Vite Frontend   │
                    └──────────┬───────────┘
                               │
                               │ REST API
                               ▼
                    ┌──────────────────────┐
                    │   Django REST API    │
                    │      Backend         │
                    └──────────┬───────────┘
                               │
                ┌──────────────┼──────────────┐
                │              │              │
                ▼              ▼              ▼
        ┌─────────────┐ ┌─────────────┐ ┌──────────────┐
        │   SQLite    │ │ Analytics   │ │ ML Services  │
        │  Database   │ │  Services   │ │              │
        └─────────────┘ └─────────────┘ └──────┬───────┘
                                               │
                                  ┌────────────┼────────────┐
                                  │            │            │
                                  ▼            ▼            ▼
                            Linear Reg.  Random Forest  Gradient
                                                        Boosting
                                               │
                                               ▼
                                      Waste Prediction
                                               │
                                               ▼
                                      Collection Planning