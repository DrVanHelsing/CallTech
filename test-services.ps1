# Quick Test Script for APIs
Write-Host "Testing API endpoints..."

# Test Node API
try {
    $nodeResponse = Invoke-WebRequest -Uri "http://localhost:3001/api/health" -UseBasicParsing -TimeoutSec 5
    Write-Host "✅ Node API: OK (Status: $($nodeResponse.StatusCode))"
} catch {
    Write-Host "❌ Node API: Failed - $($_.Exception.Message)"
}

# Test Python API
try {
    $pythonResponse = Invoke-WebRequest -Uri "http://localhost:8001/" -UseBasicParsing -TimeoutSec 5
    Write-Host "✅ Python API: OK (Status: $($pythonResponse.StatusCode))"
} catch {
    Write-Host "❌ Python API: Failed - $($_.Exception.Message)"
}

# Test Frontend
try {
    $frontendResponse = Invoke-WebRequest -Uri "http://localhost:8080/" -UseBasicParsing -TimeoutSec 5
    Write-Host "✅ Frontend: OK (Status: $($frontendResponse.StatusCode))"
} catch {
    Write-Host "❌ Frontend: Failed - $($_.Exception.Message)"
}

Write-Host "`nIf all services are OK, open: http://localhost:8080/"
