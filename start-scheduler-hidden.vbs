Set WshShell = CreateObject("WScript.Shell")
' Run PowerShell script hidden to start scheduler with no window
WshShell.Run "powershell.exe -WindowStyle Hidden -ExecutionPolicy Bypass -File ""C:\typescript\stand-by-schedule\start-scheduler-hidden.ps1""", 0, False
Set WshShell = Nothing
