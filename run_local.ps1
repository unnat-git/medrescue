# Run MedRescue Applications Locally
Write-Host "Booting MedRescue..."

Write-Host "Starting Backend API Server (Port 8000)..."
Start-Process powershell -ArgumentList "-NoExit -Command `"cd backend; npm run dev`""

Write-Host "Starting Frontend Next.js Server (Port 3000)..."
Start-Process powershell -ArgumentList "-NoExit -Command `"cd frontend; npm run dev`""

Write-Host "Services are booting in new windows!"
