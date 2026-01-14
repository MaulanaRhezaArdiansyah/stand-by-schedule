# Stop scheduler
Write-Host ""
Write-Host "Stopping Stand By Scheduler..." -ForegroundColor Yellow
Write-Host "==================================================" -ForegroundColor Yellow

$bunProcesses = Get-Process bun -ErrorAction SilentlyContinue

if ($bunProcesses) {
    Write-Host ""
    Write-Host "Found $($bunProcesses.Count) bun process(es)" -ForegroundColor Cyan
    Stop-Process -Name bun -Force
    Write-Host ""
    Write-Host "[OK] All bun processes stopped" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "[WARN] No bun processes found (scheduler not running)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "==================================================" -ForegroundColor Yellow
Write-Host ""
