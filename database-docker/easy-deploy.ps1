# Helper function to generate a random alphanumeric password
function New-RandomPassword {
    param ([int]$Length = 20)
    $chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    -join ((1..$Length) | ForEach-Object { $chars[(Get-Random -Maximum $chars.Length)] })
}

# Helper function to pass POSTGRES_PASSWORD strictly to Docker Compose
function Start-LocalCompose {
    param (
        [string]$ComposeFile = "./local/compose.yaml"
    )

    if (-not (Test-Path $ComposeFile)) {
        Write-Error "Compose file not found at: $ComposeFile"
        return
    }

    $generatedPassword = New-RandomPassword

    # Create a temporary .env file in memory/temp directory so Windows env stays clean
    $tempEnvFile = [System.IO.Path]::GetTempFileName()
    "POSTGRES_PASSWORD=$generatedPassword" | Out-File -FilePath $tempEnvFile -Encoding utf8

    Write-Host "`nStarting Docker Compose..." -ForegroundColor Cyan

    try {
        # --env-file passes the variable strictly to Docker Compose for container interpolation
        docker compose --env-file $tempEnvFile -f $ComposeFile up -d

        if ($LASTEXITCODE -eq 0) {
            Write-Host "`nSuccess! Containers are running." -ForegroundColor Green
            Write-Host "Generated Container POSTGRES_PASSWORD: $generatedPassword" -ForegroundColor Magenta
        } else {
            Write-Error "Failed to start Docker Compose."
        }
    }
    finally {
        # Always delete the temporary file so the password isn't left sitting on disk
        if (Test-Path $tempEnvFile) {
            Remove-Item $tempEnvFile -Force
        }
    }
}

# --- Main Execution ---

$dockerInstalled = $null -ne (Get-Command docker -ErrorAction SilentlyContinue)
$composeInstalled = $false

if ($dockerInstalled) {
    docker compose version *>$null
    $composeInstalled = ($LASTEXITCODE -eq 0)
}

if ($dockerInstalled -and $composeInstalled) {
    Write-Host "Docker and Docker Compose are already installed:" -ForegroundColor Green
    docker --version
    docker compose version

    Start-LocalCompose
} else {
    Write-Host "Docker or Docker Compose is missing. Installing Docker CLI via winget..." -ForegroundColor Yellow
    winget install -e --id Docker.DockerCLI --accept-source-agreements --accept-package-agreements
    
    $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
    
    if ($null -ne (Get-Command docker -ErrorAction SilentlyContinue)) {
        Start-LocalCompose
    } else {
        Write-Warning "Please restart your terminal to update PATH, then re-run this script."
    }
}