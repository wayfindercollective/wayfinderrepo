# Script to check Windows audio settings
Write-Host "=== Windows Audio Settings Check ===" -ForegroundColor Cyan
Write-Host ""

# Check Volume Mixer info
Write-Host "Checking audio devices..." -ForegroundColor Yellow
try {
    $audioDevices = Get-CimInstance -ClassName Win32_SoundDevice
    foreach ($device in $audioDevices) {
        Write-Host "Device: $($device.Name)" -ForegroundColor Green
        Write-Host "  Status: $($device.Status)" -ForegroundColor White
    }
} catch {
    Write-Host "Could not retrieve audio device info" -ForegroundColor Red
}

Write-Host ""
Write-Host "=== Manual Checks Required ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Right-click speaker icon → Open Volume mixer" -ForegroundColor Yellow
Write-Host "   - Check all sliders are at 100%" -ForegroundColor White
Write-Host ""
Write-Host "2. Right-click speaker icon → Sounds → Playback tab" -ForegroundColor Yellow
Write-Host "   - Right-click your device → Properties" -ForegroundColor White
Write-Host "   - Check 'Levels' tab - all should be at 100%" -ForegroundColor White
Write-Host "   - Check 'Enhancements' tab - try disabling all or enable 'Loudness Equalization'" -ForegroundColor White
Write-Host "   - Check 'Communications' tab - set to 'Do nothing'" -ForegroundColor White
Write-Host ""
Write-Host "3. Check for audio software (Realtek, Dell Audio, etc.)" -ForegroundColor Yellow
Write-Host "   - Look in system tray or Start menu" -ForegroundColor White
Write-Host "   - Check for volume limiters or normalization" -ForegroundColor White
Write-Host ""
Write-Host "4. Try Windows Sound Troubleshooter" -ForegroundColor Yellow
Write-Host "   - Settings → System → Sound → Troubleshoot" -ForegroundColor White
Write-Host ""

# Open Sound Settings
$response = Read-Host "Would you like to open Sound Settings now? (Y/N)"
if ($response -eq 'Y' -or $response -eq 'y') {
    Start-Process ms-settings:sound
}



