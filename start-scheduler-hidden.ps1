# PowerShell script to start scheduler with minimized window
$psi = New-Object System.Diagnostics.ProcessStartInfo
$psi.FileName = "bun.exe"
$psi.Arguments = "run src/server/index.ts"
$psi.WorkingDirectory = "C:\typescript\stand-by-schedule"
$psi.WindowStyle = [System.Diagnostics.ProcessWindowStyle]::Minimized
$psi.UseShellExecute = $true

$process = [System.Diagnostics.Process]::Start($psi)

# Wait a bit then minimize again to ensure it stays minimized
Start-Sleep -Milliseconds 500

# Use Windows API to minimize window
Add-Type @"
    using System;
    using System.Runtime.InteropServices;
    public class Win32 {
        [DllImport("user32.dll")]
        public static extern bool ShowWindow(IntPtr hWnd, int nCmdShow);
    }
"@

if ($process -ne $null -and $process.MainWindowHandle -ne [IntPtr]::Zero) {
    [Win32]::ShowWindow($process.MainWindowHandle, 6) # SW_MINIMIZE = 6
}
