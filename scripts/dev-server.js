const { spawn } = require('child_process');
const net = require('net');

const PORT = 3000;
const BACKUP_PORTS = [3001, 3002, 3003, 3004, 3005];

// Check if port is available
function isPortAvailable(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.listen(port, () => {
      server.once('close', () => {
        resolve(true);
      });
      server.close();
    });
    server.on('error', () => {
      resolve(false);
    });
  });
}

// Find available port
async function findAvailablePort() {
  if (await isPortAvailable(PORT)) {
    return PORT;
  }
  
  for (const backupPort of BACKUP_PORTS) {
    if (await isPortAvailable(backupPort)) {
      console.log(`⚠️  Port ${PORT} is in use, using port ${backupPort} instead.`);
      return backupPort;
    }
  }
  
  throw new Error('No available ports found. Please close other applications using ports 3000-3005.');
}

// Kill existing Node processes (optional)
function killExistingProcesses() {
  const { exec } = require('child_process');
  
  if (process.platform === 'win32') {
    exec('taskkill /F /IM node.exe', (error) => {
      if (error) {
        console.log('No existing Node processes to kill.');
      } else {
        console.log('✅ Killed existing Node processes.');
      }
    });
  } else {
    exec('pkill -f "next dev"', (error) => {
      if (error) {
        console.log('No existing Next.js processes to kill.');
      } else {
        console.log('✅ Killed existing Next.js processes.');
      }
    });
  }
}

// Main function
async function startDevServer() {
  try {
    console.log('🚀 Starting development server...');
    
    // Optional: Kill existing processes
    // killExistingProcesses();
    
    const port = await findAvailablePort();
    
    console.log(`📡 Server will start on port ${port}`);
    console.log(`🌐 Access your app at: http://localhost:${port}`);
    console.log('⏳ Starting...\n');
    
    // Start Next.js dev server
    const nextDev = spawn('npx', ['next', 'dev', '-p', port.toString()], {
      stdio: 'inherit',
      shell: true
    });
    
    // Handle process exit
    nextDev.on('close', (code) => {
      console.log(`\n🛑 Development server stopped with code ${code}`);
      process.exit(code);
    });
    
    // Handle errors
    nextDev.on('error', (error) => {
      console.error('❌ Error starting development server:', error);
      process.exit(1);
    });
    
  } catch (error) {
    console.error('❌ Failed to start development server:', error.message);
    process.exit(1);
  }
}

// Run the script
startDevServer();
