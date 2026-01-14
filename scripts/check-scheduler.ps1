# Check if scheduler is running
Write-Host ""
Write-Host "Checking Stand By Scheduler Status..." -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan

$bunProcesses = Get-Process bun -ErrorAction SilentlyContinue

if ($bunProcesses) {
    Write-Host ""
    Write-Host "[OK] Bun processes found:" -ForegroundColor Green
    $bunProcesses | Format-Table Id, ProcessName, CPU, WorkingSet -AutoSize

    Write-Host "Note: One of these is likely your scheduler" -ForegroundColor Yellow
    Write-Host "      If you see multiple bun processes, the scheduler is one of them." -ForegroundColor Yellow
} else {
    Write-Host ""
    Write-Host "[FAIL] No scheduler running (no bun processes found)" -ForegroundColor Red
}

Write-Host ""
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "To start scheduler: bun run scheduler" -ForegroundColor Cyan
Write-Host "To stop all: bun run scheduler:stop" -ForegroundColor Cyan
Write-Host ""
