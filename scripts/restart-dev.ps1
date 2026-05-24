# PowerShell script to cleanly restart Next.js dev server
Write-Host "🔄 Restarting Next.js dev server..." -ForegroundColor Cyan

# Kill any existing Node.js processes running Next.js
Write-Host "🛑 Stopping existing dev servers..." -ForegroundColor Yellow
Get-Process node -ErrorAction SilentlyContinue | Where-Object {$_.Path -like "*node.exe"} | ForEach-Object {
    $port = netstat -ano | findstr ":300" | findstr $_.Id
    if ($port) {
        Write-Host "  Killing process $($_.Id) on port 3000/3001" -ForegroundColor Red
        Stop-Process -Id $_.Id -Force
    }
}

Start-Sleep -Seconds 1

# Clear Next.js cache
Write-Host "🗑️  Clearing Next.js cache..." -ForegroundColor Yellow
if (Test-Path ".next") {
    Remove-Item -Recurse -Force ".next"
}

Write-Host "✅ Ready to start fresh!" -ForegroundColor Green
Write-Host "Run: npm run dev" -ForegroundColor Cyan
