
  # Honeywell Terminal Manager - AI-Powered Operations Dashboard

A comprehensive web application for terminal operations management with AI-driven insights, data analysis, and multi-workflow support.

## Features

### 🤖 AI-Powered Analytics
- **Intelligent Chatbot**: Chat with AI assistant for operational insights
- **Data Analysis**: Upload datasets and get AI-driven recommendations
- **Predictive Insights**: Performance optimization suggestions based on real data
- **Multi-Operation Support**: Terminal, Courier, Workforce, and Energy management workflows

### 📊 Dynamic Data Processing
- **File Upload**: Support for CSV, JSON, and XLSX files (max 10 files)
- **Real-time KPIs**: Dynamic dashboards that adapt to your uploaded data
- **Chart Generation**: Interactive charts based on your operational data
- **Data Management**: Full CRUD operations for datasets

### 🔄 Multi-Workflow Operations
- **Terminal Operations**: Container and cargo management
- **Courier Hub**: Delivery and logistics operations
- **Workforce Management**: Staff scheduling and HR analytics
- **Energy Management**: Power systems and sustainability metrics

### 🎨 Modern UI/UX
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Dark/Light Themes**: Customizable appearance
- **Interactive Components**: Drag-and-drop, real-time updates
- **Accessibility**: Screen reader support and keyboard navigation

## Quick Start

### Prerequisites
- Python 3.8+ 
- Node.js 16+
- npm or yarn

### Installation & Setup

1. **Clone or download** this repository
2. **Run the startup script**:

   **Windows:**
   ```cmd
   startup.bat
   ```

   **Alternative (Manual):**
   ```cmd
   start.bat
   ```

   **macOS/Linux:**
   ```bash
   chmod +x start.sh
   ./start.sh
   ```

3. **Access the application**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8002
   - API Documentation: http://localhost:8002/docs

### Manual Setup (Alternative)

If the startup script doesn't work, you can set up manually:

1. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Install Node.js dependencies:**
   ```bash
   npm install
   ```

3. **Start the backend server:**
   ```bash
   python main.py
   ```

4. **Start the frontend (in a new terminal):**
   ```bash
   npm run dev
   ```

## Usage Guide

### 1. Initial Login
- Use the secure login page with any credentials (demo mode)
- Choose your operation type: Terminal, Courier, Workforce, or Energy

### 2. Upload Your Data
1. Navigate to **Settings** → **Upload Datasets**
2. Drag and drop or select your data files (CSV, JSON, XLSX)
3. Upload up to 10 files per session
4. Files are automatically processed and analyzed

### 3. AI Chat Assistant
- Click the floating chat button in the bottom-right
- Ask questions about your data: "Analyze my performance metrics"
- Request workflow switches: "Switch to courier operations" 
- Get optimization suggestions and insights

### 4. Dashboard Features
- **Control Center**: Overview of all operations with real-time KPIs
- **Dashboard Builder**: Create custom visualizations from your data
- **Reports**: Generate comprehensive performance reports
- **What-If Analysis**: Scenario planning and predictions

### 5. Data Management
- View all uploaded datasets in Settings
- Delete or analyze individual files
- Monitor data processing status
- Export processed results

## File Format Guidelines

### CSV Files
```csv
timestamp,efficiency,throughput,alerts,cost
2024-01-01,87.5,1250,3,125000
2024-01-02,89.1,1340,2,118000
```

### JSON Files
```json
[
  {
    "timestamp": "2024-01-01",
    "metrics": {
      "efficiency": 87.5,
      "throughput": 1250,
      "alerts": 3
    }
  }
]
```

### XLSX Files
- Standard Excel format with headers in the first row
- Numeric columns for metrics and analysis
- Date columns for temporal analysis

## AI Integration

The application includes integration with the **Gemma-3-4B-IT model** (GGUF format) for advanced AI capabilities:

1. Place your `gemma-3-4b-it-Q8_0.gguf` model file in the root directory
2. The AI will automatically provide more sophisticated responses
3. Fallback to rule-based responses if model is not available

### AI Features:
- **Data Analysis**: Intelligent insights from uploaded datasets
- **Performance Optimization**: Actionable recommendations
- **Workflow Assistance**: Context-aware operational guidance
- **Predictive Analytics**: Trend analysis and forecasting

## API Documentation

The backend provides RESTful APIs:

### Chat Endpoint
```http
POST /api/chat
Content-Type: application/json

{
  "message": "Analyze my terminal performance",
  "operation_type": "terminal",
  "context": {}
}
```

### File Upload
```http
POST /api/upload-data
Content-Type: multipart/form-data

files: [file1.csv, file2.json]
operation_type: terminal
```

### Get Operation Data
```http
GET /api/operation-data/terminal
```

### Dataset Management
```http
GET /api/datasets?operation_type=terminal
DELETE /api/datasets/{dataset_id}
```

## Project Structure

```
├── main.py                 # FastAPI backend server
├── requirements.txt        # Python dependencies
├── package.json           # Node.js dependencies
├── start.bat / start.sh   # Startup scripts
├── src/
│   ├── components/        # React UI components
│   ├── services/          # API service layer
│   ├── hooks/            # Custom React hooks
│   └── styles/           # CSS and styling
├── data/                 # Uploaded datasets (auto-created)
└── README.md            # This file
```

## Troubleshooting

### Common Issues

1. **Backend won't start:**
   - Check Python version: `python --version`
   - Install dependencies: `pip install -r requirements.txt`
   - Check port 8000 availability

2. **Frontend won't start:**
   - Check Node.js version: `node --version`
   - Install dependencies: `npm install`
   - Check port 5173 availability

3. **File uploads not working:**
   - Ensure backend is running on port 8000
   - Check file formats (CSV, JSON, XLSX only)
   - Verify file size limits

4. **AI responses not working:**
   - Backend will fallback to rule-based responses
   - Check console logs for API connection issues
   - Ensure CORS is properly configured

### Development Mode

For development with hot reloading:

```bash
# Backend (auto-reload)
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Frontend (auto-reload)
npm run dev
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is developed for the Honeywell Hackathon and is intended for demonstration purposes.

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review console logs for error messages
3. Ensure all dependencies are properly installed
4. Verify network connectivity between frontend and backend

---

**Built with ❤️ for Honeywell Hackathon 2024**
  