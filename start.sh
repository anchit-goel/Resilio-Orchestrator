#!/bin/bash

echo "Starting Honeywell Terminal Manager..."
echo

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "Error: Python 3 is not installed or not in PATH"
    echo "Please install Python 3.8+ and try again"
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Error: Node.js is not installed or not in PATH"
    echo "Please install Node.js and try again"
    exit 1
fi

echo "Installing Python dependencies..."
pip3 install -r requirements.txt

# Check if npm packages are installed
if [ ! -d "node_modules" ]; then
    echo "Installing Node.js dependencies..."
    npm install
fi

echo
echo "Starting backend server..."
python3 main.py &
BACKEND_PID=$!

echo "Waiting for backend to start..."
sleep 5

echo "Starting frontend development server..."
npm run dev

# Cleanup function to kill backend when script exits
cleanup() {
    echo "Shutting down servers..."
    kill $BACKEND_PID 2>/dev/null
    exit
}

trap cleanup INT TERM