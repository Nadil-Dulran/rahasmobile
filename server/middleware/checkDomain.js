// server/middleware/checkDomain.js
const DEFAULT_ALLOWED = [""]; // Add allowed domains here

export default function checkDomain(req, res, next) {
  try {
    const email = (req.body.email || "").toString().trim().toLowerCase();

    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }

    // allowed domains come from env: ALLOWED_DOMAINS="myteam.com,example.com"
    const envList = (process.env.ALLOWED_DOMAINS || "")
      .split(",")
      .map(d => d.trim().toLowerCase())
      .filter(Boolean);

    const allowedDomains = envList.length ? envList : DEFAULT_ALLOWED;

    const parts = email.split("@");
    const domain = parts.length === 2 ? parts[1] : null;

    if (!domain || !allowedDomains.includes(domain)) {
      return res.status(403).json({
        success: false,
        message: "Signup restricted - Request access Contact - nadilgamage@gmail.com"
      });
    }

    next();
  } catch (err) {
    console.error("checkDomain error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}
