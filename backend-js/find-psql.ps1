# Script pour trouver psql sur le systeme
Write-Host "Recherche de psql sur le systeme..." -ForegroundColor Green

# Chercher dans les chemins courants
$commonPaths = @(
    "C:\Program Files\PostgreSQL\*\bin",
    "C:\Program Files (x86)\PostgreSQL\*\bin",
    "C:\postgresql\*\bin",
    "C:\tools\postgresql\*\bin"
)

Write-Host "`nRecherche dans les chemins courants:" -ForegroundColor Yellow
foreach ($path in $commonPaths) {
    $foundPaths = Get-ChildItem -Path $path -Name "psql.exe" -ErrorAction SilentlyContinue
    if ($foundPaths) {
        foreach ($found in $foundPaths) {
            $fullPath = Join-Path $path $found
            Write-Host "  Trouve: $fullPath" -ForegroundColor Green
        }
    }
}

# Chercher dans le PATH
Write-Host "`nRecherche dans le PATH:" -ForegroundColor Yellow
$pathDirs = $env:PATH -split ';'
foreach ($dir in $pathDirs) {
    $psqlPath = Join-Path $dir "psql.exe"
    if (Test-Path $psqlPath) {
        Write-Host "  Trouve dans PATH: $psqlPath" -ForegroundColor Green
    }
}

# Chercher avec where.exe
Write-Host "`nRecherche avec where.exe:" -ForegroundColor Yellow
try {
    $whereResult = & where.exe psql 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  where.exe trouve:" -ForegroundColor Green
        $whereResult | ForEach-Object { Write-Host "    $_" -ForegroundColor White }
    } else {
        Write-Host "  where.exe ne trouve rien" -ForegroundColor Red
    }
} catch {
    Write-Host "  Erreur avec where.exe: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`nRecherche terminee!" -ForegroundColor Green 