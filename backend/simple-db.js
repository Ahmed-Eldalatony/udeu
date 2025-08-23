const fs = require("fs");
const path = require("path");

// Create an empty SQLite database file
const dbPath = path.join(__dirname, "database.sqlite");

try {
  // Create empty database file
  fs.writeFileSync(dbPath, "");
  console.log("✅ SQLite database file created successfully at:", dbPath);
  console.log("📊 File size:", fs.statSync(dbPath).size, "bytes");
} catch (error) {
  console.error("❌ Error creating database file:", error);
  process.exit(1);
}
