const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const path = require("path");
const os = require("os");



const userRoutes = require("./routes/userRoutes");

dotenv.config();
connectDB();

const app = express();
app.set("trust proxy", true);
// Middleware
app.use(cors());
app.use(bodyParser.json());
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(bodyParser.urlencoded({ extended: true }));


// Routes
app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
	
 	
  res.render("index", { name: "Karan" });
  
});

// Health check
app.post("/api/check/", async (req, res) => {
		

   res.json("result.data");
  
});

function getLocalIPv4() {
  const nets = os.networkInterfaces();
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      // Skip internal (127.0.0.1) and non-IPv4
      if (net.family === "IPv4" && !net.internal) {
        return net.address;
      }
    }
  }
  return "127.0.0.1"; // fallback
}

// Function to get client IP
function getClientIp(req) {
  let ip =
    req.headers["x-forwarded-for"]?.split(",")[0] || // proxy
    req.socket?.remoteAddress ||                     // direct
    req.connection?.remoteAddress ||
    null;

  if (!ip) return null;

  // Localhost IPv6 -> LAN IPv4
  if (ip === "::1" || ip === "127.0.0.1") {
    ip = getLocalIPv4();
  }

  // Remove IPv6 prefix for IPv4-mapped addresses
  if (ip.startsWith("::ffff:")) ip = ip.replace("::ffff:", "");

  return ip;
}


// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
