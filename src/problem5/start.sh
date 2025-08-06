#!/bin/bash

# This script is used to start the application

# Start Backend
cd backend-service && npm install && npm run dev &


# Start Frontend
cd frontend && npm install && npm run dev &

wait
