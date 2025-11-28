#!/bin/bash
set -e

# Start server with Uvicorn - use port 5005
echo "Starting Doc Editor API server with Uvicorn..."

python -m uvicorn app.factory:create_app --factory --host 0.0.0.0 --port 5005 --reload