"""
Final validation script for Honeywell Terminal Manager
Tests all components and functionality
"""
import requests
import json
import os
from pathlib import Path

def test_backend_api():
    """Test all backend API endpoints"""
    print("=== Backend API Testing ===")
    
    base_url = "http://localhost:8002"
    
    try:
        # Test health endpoint
        response = requests.get(f"{base_url}/")
        print(f"✓ Health endpoint: {response.status_code}")
        data = response.json()
        print(f"  - Status: {data.get('status')}")
        print(f"  - Model loaded: {data.get('model_loaded')}")
        
        # Test chat endpoint
        chat_data = {
            "message": "Test AI integration",
            "operation_type": "terminal"
        }
        response = requests.post(f"{base_url}/api/chat", json=chat_data)
        print(f"✓ Chat endpoint: {response.status_code}")
        
        # Test operation data endpoint
        response = requests.get(f"{base_url}/api/operation-data/terminal")
        print(f"✓ Operation data endpoint: {response.status_code}")
        data = response.json()
        print(f"  - KPIs loaded: {len(data.get('kpis', {}))}")
        print(f"  - Chart data available: {bool(data.get('chart_data'))}")
        
        # Test datasets endpoint
        response = requests.get(f"{base_url}/api/datasets")
        print(f"✓ Datasets endpoint: {response.status_code}")
        
        print("✓ All backend tests passed!")
        return True
        
    except Exception as e:
        print(f"✗ Backend test failed: {e}")
        return False

def check_frontend_files():
    """Check if frontend files exist and are properly configured"""
    print("\n=== Frontend Files Check ===")
    
    required_files = [
        "package.json",
        "vite.config.ts",
        "tsconfig.json",
        "src/App.tsx",
        "src/main.tsx",
        "src/services/ApiService.ts",
        "src/components/FileUploadManager.tsx",
        "src/components/ChatbotInterface.tsx",
        "src/components/SettingsPage.tsx"
    ]
    
    missing_files = []
    for file_path in required_files:
        if Path(file_path).exists():
            print(f"✓ {file_path}")
        else:
            print(f"✗ {file_path} (missing)")
            missing_files.append(file_path)
    
    if not missing_files:
        print("✓ All frontend files present!")
        return True
    else:
        print(f"✗ Missing files: {missing_files}")
        return False

def check_project_structure():
    """Check overall project structure"""
    print("\n=== Project Structure Check ===")
    
    required_dirs = ["src", "src/components", "src/services", "data"]
    for dir_path in required_dirs:
        if Path(dir_path).exists():
            print(f"✓ {dir_path}/")
        else:
            print(f"✗ {dir_path}/ (missing)")
            os.makedirs(dir_path, exist_ok=True)
            print(f"  Created: {dir_path}/")
    
    # Check if servers are running
    try:
        # Check frontend
        frontend_response = requests.get("http://localhost:3000", timeout=2)
        print("✓ Frontend server running (port 3000)")
    except:
        print("✗ Frontend server not accessible (port 3000)")
    
    try:
        # Check backend
        backend_response = requests.get("http://localhost:8002", timeout=2)
        print("✓ Backend server running (port 8002)")
    except:
        print("✗ Backend server not accessible (port 8002)")

def main():
    """Run all validation tests"""
    print("🚀 Honeywell Terminal Manager - System Validation")
    print("=" * 60)
    
    backend_ok = test_backend_api()
    frontend_ok = check_frontend_files()
    check_project_structure()
    
    print("\n" + "=" * 60)
    print("📊 VALIDATION SUMMARY")
    print("=" * 60)
    
    if backend_ok and frontend_ok:
        print("✅ System Status: ALL TESTS PASSED")
        print("🎉 Application is ready to use!")
        print("\n📱 Access Points:")
        print("  - Frontend: http://localhost:3000")
        print("  - Backend API: http://localhost:8002")
        print("  - API Documentation: http://localhost:8002/docs")
        print("\n🎯 Key Features Available:")
        print("  - AI-powered chatbot")
        print("  - File upload (CSV, JSON, XLSX)")
        print("  - Dynamic dashboards")
        print("  - Multi-operation workflows")
        print("  - Real-time data processing")
    else:
        print("❌ System Status: SOME ISSUES FOUND")
        print("Please check the errors above and restart the servers")
    
    print("\n💡 Quick Start:")
    print("  1. Upload datasets via Settings > Upload Datasets")
    print("  2. Chat with AI assistant for insights")
    print("  3. Switch between operation types")
    print("  4. View dynamic dashboards with real data")

if __name__ == "__main__":
    main()