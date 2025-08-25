# 🚀 Development Setup Guide

## Quick Start

### Option 1: Simple Start (Recommended)
```bash
npm run dev
```

### Option 2: Smart Start (Handles conflicts automatically)
```bash
npm run dev:smart
```

### Option 3: Clean Start (Clears cache first)
```bash
npm run dev:clean
```

### Option 4: Windows Batch File
```bash
start-dev.bat
```

### Option 5: PowerShell Manager
```powershell
.\scripts\dev-manager.ps1
```

## 🛠️ Troubleshooting

### Port Conflicts
If you see "Port 3000 is in use" errors:

1. **Use the smart script:**
   ```bash
   npm run dev:smart
   ```

2. **Manual fix:**
   ```bash
   # Kill existing processes
   taskkill /F /IM node.exe
   
   # Clear cache
   npm run clean
   
   # Start server
   npm run dev
   ```

### Build Errors
If you encounter build errors:

1. **Clear all caches:**
   ```bash
   npm run clean
   rm -rf node_modules
   npm install
   ```

2. **Rebuild:**
   ```bash
   npm run build
   npm run dev
   ```

### Browser Cache Issues
If the app doesn't load properly:

1. **Hard refresh:** `Ctrl + F5` (Windows) or `Cmd + Shift + R` (Mac)
2. **Clear browser cache:** Open DevTools → Application → Storage → Clear storage
3. **Use incognito mode:** To bypass cache completely

## 📋 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server on port 3000 |
| `npm run dev:smart` | Smart server with conflict resolution |
| `npm run dev:clean` | Clean cache and start server |
| `npm run clean` | Clear build cache |
| `npm run build` | Build for production |
| `npm run start` | Start production server |

## 🔧 Development Tools

### PowerShell Manager
Advanced server management with options:

```powershell
# Check port availability
.\scripts\dev-manager.ps1 -Port

# Clean cache and kill processes
.\scripts\dev-manager.ps1 -Clean -Kill

# Show help
.\scripts\dev-manager.ps1 -Help
```

### Windows Batch File
Simple one-click solution:
- Double-click `start-dev.bat`
- Automatically kills processes and clears cache
- Starts development server

## 🚨 Common Issues & Solutions

### 1. "Port 3000 is in use"
**Solution:** Use `npm run dev:smart` or run `start-dev.bat`

### 2. "Module not found" errors
**Solution:** 
```bash
npm run clean
npm install
```

### 3. Build fails with TypeScript errors
**Solution:**
```bash
npm run build
# Fix any TypeScript errors shown
npm run dev
```

### 4. Browser shows 404/500 errors
**Solution:**
1. Clear browser cache
2. Restart development server
3. Check console for specific errors

### 5. Hot reload not working
**Solution:**
```bash
npm run dev:clean
```

## 📱 Development Best Practices

1. **Always use the smart scripts** to avoid conflicts
2. **Clear cache regularly** if you encounter strange behavior
3. **Check the console** for error messages
4. **Use hard refresh** when testing changes
5. **Keep one terminal open** for the dev server

## 🔄 Daily Workflow

1. **Start development:**
   ```bash
   npm run dev:smart
   ```

2. **Make changes** to your code

3. **Test in browser** at `http://localhost:3000`

4. **If issues occur:**
   ```bash
   npm run dev:clean
   ```

5. **Stop server:** `Ctrl + C` in terminal

## 📞 Need Help?

If you encounter persistent issues:

1. Check this guide first
2. Try the troubleshooting steps
3. Use the smart scripts
4. Clear all caches and restart

---

**Happy coding! 🎉**
