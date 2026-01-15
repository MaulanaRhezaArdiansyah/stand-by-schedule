# 🪟 Windows Task Scheduler Setup

Guide lengkap setup scheduler pake **Windows Task Scheduler** - built-in Windows, ga perlu install apa-apa!

---

## 🎯 Why Task Scheduler?

- ✅ **Built-in Windows** - ga perlu install NSSM atau tools lain
- ✅ **Auto-start** pas laptop nyala
- ✅ **Runs in background** - ga perlu terminal
- ✅ **Simple & reliable** - Windows native
- ✅ **Lightweight** (~50MB RAM only)

---

## 📋 Prerequisites

1. ✅ **Bun** installed (`bun --version`)
2. ✅ **Admin privileges** (buat install task)
3. ✅ **`.env` file** lengkap

---

## 🚀 Installation

### Method 1: Automatic (Recommended)

**Right-click** `install-task-scheduler.bat` → **Run as Administrator**

Script akan:
1. Check Bun installed
2. Create scheduled task "StandByScheduler"
3. Set trigger: On system startup
4. Configure working directory
5. Start task immediately

### Method 2: Manual via Task Scheduler GUI

1. Press **Win+R** → type `taskschd.msc` → Enter
2. Click **"Create Task..."** (kanan)
3. **General Tab:**
   - Name: `StandByScheduler`
   - User: `SYSTEM`
   - Run with highest privileges: ✅
   - Configure for: Windows 10/11

4. **Triggers Tab:**
   - New → Begin: `At startup`
   - Delay: `0 seconds`
   - Enabled: ✅

5. **Actions Tab:**
   - New → Action: `Start a program`
   - Program: `C:\Users\YOUR_USER\.bun\bin\bun.exe`
   - Arguments: `run src/server/index.ts`
   - Start in: `C:\typescript\stand-by-schedule`

6. **Conditions Tab:**
   - ❌ Uncheck "Start only if on AC power"
   - ❌ Uncheck "Stop if on battery"

7. **Settings Tab:**
   - ✅ Allow task to run on demand
   - ✅ Run task ASAP after missed start
   - ❌ Stop task if runs longer than...
   - If running, do: `Do not start new instance`

8. Click **OK**

---

## 🎛️ Managing the Task

### Via Command Line

```powershell
# Check status
schtasks /query /tn "StandByScheduler"

# Start task
schtasks /run /tn "StandByScheduler"

# Stop task (kill process)
taskkill /f /im bun.exe

# Delete task
schtasks /delete /tn "StandByScheduler" /f
```

### Via Task Scheduler GUI

1. Press **Win+R** → `taskschd.msc`
2. Find **"StandByScheduler"** in Task Scheduler Library
3. Right-click → Run/End/Delete

### Check if Running

```powershell
# Check task status
schtasks /query /tn "StandByScheduler" /fo list

# Check if Bun process running
tasklist | findstr bun.exe
```

---

## 📊 Monitoring

### Check Logs

Create `logs/` folder manually or let scheduler create it:

```powershell
# View scheduler output (if you redirect to file)
type logs\scheduler.log

# Check Windows Event Viewer
eventvwr.msc
# Navigate to: Windows Logs → Application
# Filter by Source: "Task Scheduler"
```

### Monitor Process

```powershell
# Check if Bun running
tasklist /fi "imagename eq bun.exe"

# Check memory usage
tasklist /fi "imagename eq bun.exe" /fo table

# Real-time monitoring
# Open Task Manager (Ctrl+Shift+Esc)
# Go to Details tab → Find bun.exe
```

---

## 🔄 Updates & Maintenance

### Update Code

When you update code (schedule, emails, etc.):

```powershell
# 1. Stop task
taskkill /f /im bun.exe

# 2. Make your changes

# 3. Start task again
schtasks /run /tn "StandByScheduler"
```

### Update .env

Email or configuration changed:

```powershell
# 1. Edit .env file
notepad .env

# 2. Restart task
taskkill /f /im bun.exe
schtasks /run /tn "StandByScheduler"
```

---

## 🗑️ Uninstallation

### Method 1: Automatic (Recommended)

**Right-click** `uninstall-task-scheduler.bat` → **Run as Administrator**

### Method 2: Manual

```powershell
# Stop process
taskkill /f /im bun.exe

# Delete task
schtasks /delete /tn "StandByScheduler" /f
```

---

## 🔧 Troubleshooting

### Task shows "Ready" but not running

```powershell
# Manually start task
schtasks /run /tn "StandByScheduler"

# Or via GUI
# taskschd.msc → Right-click task → Run
```

### Task fails to start

**Check Event Viewer:**
1. Win+R → `eventvwr.msc`
2. Windows Logs → Application
3. Filter by "Task Scheduler"
4. Look for errors

**Common issues:**
- Bun path wrong → Edit task, update Program path
- Working directory wrong → Edit task, update "Start in"
- .env file missing → Create .env file with config

### Multiple bun.exe processes

```powershell
# Check all bun processes
tasklist /fi "imagename eq bun.exe"

# Kill all
taskkill /f /im bun.exe

# Start task fresh
schtasks /run /tn "StandByScheduler"
```

### Task doesn't auto-start on boot

```powershell
# Check trigger
schtasks /query /tn "StandByScheduler" /fo list /v | findstr /i "trigger"

# Should show: At system startup

# If not, delete and reinstall
schtasks /delete /tn "StandByScheduler" /f
# Run install-task-scheduler.bat again
```

### Email not sending

```powershell
# Same troubleshooting as manual run
# 1. Stop task
taskkill /f /im bun.exe

# 2. Test manually
cd C:\typescript\stand-by-schedule
bun run test:email

# 3. Check .env file
# 4. Fix issues
# 5. Restart task
schtasks /run /tn "StandByScheduler"
```

---

## 📝 Task Configuration Details

| Setting | Value |
|---------|-------|
| **Task Name** | StandByScheduler |
| **Trigger** | At system startup |
| **User** | SYSTEM |
| **Program** | C:\Users\YOUR_USER\\.bun\bin\bun.exe |
| **Arguments** | run src/server/index.ts |
| **Working Dir** | C:\typescript\stand-by-schedule |
| **Run Level** | Highest |
| **On Battery** | Yes (task runs even on battery) |
| **Wake to Run** | No |
| **Restart on Failure** | Yes (3 attempts, 1 min interval) |
| **Multiple Instances** | Ignore new (don't start if already running) |

---

## 💡 Tips

### Test Before Install

```bash
# Test locally first
bun run scheduler

# Verify:
# - No errors
# - Email config valid
# - All schedulers started

# Then install task
```

### Verify After Reboot

After installing task:

1. Reboot laptop
2. After login, check:
   ```powershell
   tasklist | findstr bun.exe
   ```
3. Should see bun.exe process running

### View Task History

1. Open Task Scheduler GUI (`taskschd.msc`)
2. Find "StandByScheduler"
3. Click **History** tab (enable if disabled)
4. See all executions, successes, failures

### Redirect Output to File (Optional)

If you want logs in file:

1. Edit task action arguments to:
   ```
   run src/server/index.ts > logs\scheduler.log 2>&1
   ```

2. Restart task

3. View logs:
   ```powershell
   type logs\scheduler.log
   ```

---

## 🆘 Support

### Task Scheduler Commands Reference

```powershell
# Query task
schtasks /query /tn "TaskName"

# Create task
schtasks /create /tn "TaskName" /tr "program.exe" /sc onstart

# Run task
schtasks /run /tn "TaskName"

# Delete task
schtasks /delete /tn "TaskName" /f

# Change task
schtasks /change /tn "TaskName" /tr "newprogram.exe"

# Export task to XML
schtasks /query /tn "TaskName" /xml > task.xml

# Import task from XML
schtasks /create /tn "TaskName" /xml task.xml
```

### Useful Resources

- Task Scheduler Guide: https://docs.microsoft.com/en-us/windows/win32/taskschd/task-scheduler-start-page
- Schtasks Command Reference: https://docs.microsoft.com/en-us/windows-server/administration/windows-commands/schtasks

---

## ✅ Verification Checklist

After installation, verify:

- [ ] Task exists in Task Scheduler
- [ ] Task trigger is "At startup"
- [ ] Bun.exe process running after reboot
- [ ] No errors in Event Viewer
- [ ] Emails sent at scheduled times

---

## 🔄 Comparison: Task Scheduler vs NSSM

| Feature | Task Scheduler | NSSM |
|---------|---------------|------|
| **Built-in** | ✅ Yes | ❌ No (need install) |
| **Support** | ✅ Active (Microsoft) | ⚠️ Out of support |
| **Setup** | Simple | Simple |
| **GUI** | ✅ Built-in | ✅ GUI available |
| **Restart on Crash** | ✅ Yes | ✅ Yes |
| **Log Rotation** | ❌ Manual | ✅ Auto |
| **Reliability** | ✅ Very reliable | ✅ Very reliable |

**Recommendation:** Use **Task Scheduler** - built-in, supported, simple! ✅

---

**Task installed! No more manual `bun run scheduler`! 🎉**

Scheduler sekarang jalan otomatis di background via Windows Task Scheduler!
