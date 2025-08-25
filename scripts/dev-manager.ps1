# DUCALI Development Server Manager
# PowerShell script for managing development environment

param(
    [switch]$Clean,
    [switch]$Kill,
    [switch]$Port,
    [switch]$Help
)

function Show-Help {
    Write-Host @"
DUCALI Development Server Manager

Usage:
    .\dev-manager.ps1 [options]

Options:
    -Clean    Clean build cache and node_modules
    -Kill     Kill all Node.js processes
    -Port     Check port availability
    -Help     Show this help message

Examples:
    .\dev-manager.ps1 -Clean -Kill    # Clean cache and kill processes
    .\dev-manager.ps1 -Port           # Check port 3000 availability
    .\dev-manager.ps1                 # Start development server
"@
}

function Test-PortAvailability {
    param([int]$Port = 3000)
    
    try {
        $connection = New-Object System.Net.Sockets.TcpClient
        $connection.Connect("localhost", $Port)
        $connection.Close()
        Write-Host "❌ Port $Port is in use" -ForegroundColor Red
        return $false
    }
    catch {
        Write-Host "✅ Port $Port is available" -ForegroundColor Green
        return $true
    }
}

function Stop-NodeProcesses {
    Write-Host "🔄 Stopping Node.js processes..." -ForegroundColor Yellow
    
    $processes = Get-Process -Name "node" -ErrorAction SilentlyContinue
    if ($processes) {
        $processes | Stop-Process -Force
        Write-Host "✅ Killed $($processes.Count) Node.js processes" -ForegroundColor Green
    } else {
        Write-Host "ℹ️  No Node.js processes found" -ForegroundColor Blue
    }
}

function Remove-BuildCache {
    Write-Host "🧹 Cleaning build cache..." -ForegroundColor Yellow
    
    if (Test-Path ".next") {
        Remove-Item -Recurse -Force ".next"
        Write-Host "✅ Removed .next folder" -ForegroundColor Green
    } else {
        Write-Host "ℹ️  No .next folder found" -ForegroundColor Blue
    }
    
    if (Test-Path "node_modules\.cache") {
        Remove-Item -Recurse -Force "node_modules\.cache"
        Write-Host "✅ Removed node_modules cache" -ForegroundColor Green
    }
}

function Start-DevServer {
    Write-Host "🚀 Starting development server..." -ForegroundColor Yellow
    
    if (-not (Test-PortAvailability)) {
        Write-Host "⚠️  Port 3000 is in use. Trying port 3001..." -ForegroundColor Yellow
        if (-not (Test-PortAvailability -Port 3001)) {
            Write-Host "❌ Both ports 3000 and 3001 are in use. Please close other applications." -ForegroundColor Red
            exit 1
        }
    }
    
    Write-Host "🌐 Server will be available at: http://localhost:3000" -ForegroundColor Green
    Write-Host "📝 Press Ctrl+C to stop the server" -ForegroundColor Cyan
    Write-Host ""
    
    npm run dev
}

# Main execution
if ($Help) {
    Show-Help
    exit 0
}

if ($Port) {
    Test-PortAvailability
    exit 0
}

if ($Kill) {
    Stop-NodeProcesses
}

if ($Clean) {
    Remove-BuildCache
}

# Start development server
Start-DevServer
