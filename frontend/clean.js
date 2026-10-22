const fs = require('fs');
const dirs = ['.next', '.cache', '.junks'];

dirs.forEach(d => {
  try {
    fs.rmSync(d, { recursive: true, force: true });
    console.log(`Cleaned ${d}`);
  } catch (err) {
    // Ignore errors like file locks, just continue starting the server
    console.log(`Skipped ${d} cleanup: ${err.message}`);
  }
});
