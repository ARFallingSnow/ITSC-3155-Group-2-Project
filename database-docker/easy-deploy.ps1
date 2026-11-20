# Helper function to build with DB_PASSWORD build-arg and start Docker Compose
# NOTE!!! had to update file path to reflect file structure -AJR
function Start-LocalCompose {
    param (
        [string]$ComposeFile = "database-docker/local/compose.yaml",
        [string]$NetworkName = "backend_net"
    )

    if (-not (Test-Path $ComposeFile)) {
        Write-Error "Compose file not found at: $ComposeFile"
        return
    }

    # Check if the required Docker network exists
    Write-Host "Checking for Docker network '$NetworkName'..." -ForegroundColor Cyan
    docker network inspect $NetworkName *>$null
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Network '$NetworkName' not found. Creating it now..." -ForegroundColor Yellow
        docker network create $NetworkName | Out-Null
        
        if ($LASTEXITCODE -ne 0) {
            Write-Error "Failed to create Docker network '$NetworkName'. Aborting deployment."
            return
        }
        Write-Host "Network '$NetworkName' created successfully." -ForegroundColor Green
    } else {
        Write-Host "Network '$NetworkName' already exists." -ForegroundColor Green
    }

    $generatedPassword = New-RandomPassword

    Write-Host "`nBuilding image with DB_PASSWORD build argument..." -ForegroundColor Cyan
    docker compose -f $ComposeFile build --build-arg "DB_PASSWORD=$generatedPassword"

    if ($LASTEXITCODE -ne 0) {
        Write-Error "Failed to build Docker Compose services."
        return
    }

    Write-Host "`nStarting Docker Compose..." -ForegroundColor Cyan
    docker compose -f $ComposeFile up -d

    if ($LASTEXITCODE -eq 0) {
        Write-Host "`nSuccess! Containers are running." -ForegroundColor Green
        Write-Host "Generated DB_PASSWORD: $generatedPassword" -ForegroundColor Magenta
    } else {
        Write-Error "Failed to start Docker Compose."
    }
}