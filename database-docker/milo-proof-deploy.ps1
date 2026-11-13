# Check if 'docker' exists and 'docker compose' subcommand works

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
} else {
    Write-Host "Docker or Docker Compose is missing. Installing Docker Desktop via winget... (After done should restart terminal to update PATH)" -ForegroundColor Yellow
    winget install -e --id Docker.DockerCLI --accept-source-agreements --accept-package-agreements
}