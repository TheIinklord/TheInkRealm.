// Vercel serverless function: sends commission request details to the studio.
const { Resend } = require("resend");

function clean(value, max = 5000) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}
function validEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && value.length <= 254;
}

module.exports = async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed." });
  }
  const { RESEND_API_KEY, RESEND_FROM_EMAIL, COMMISSION_NOTIFICATION_EMAIL } = process.env;
  if (!RESEND_API_KEY || !RESEND_FROM_EMAIL || !COMMISSION_NOTIFICATION_EMAIL) {
    return res.status(503).json({ error: "The commission form is not configured yet. Please contact the studio directly." });
  }
  const body = req.body || {};
  const name = clean(body.name, 100);
  const email = clean(body.email, 254);
  const type = clean(body.type, 120);
  const budget = clean(body.budget, 80) || "Not specified";
  const details = clean(body.details, 5000);
  const deadline = clean(body.deadline, 100) || "Not specified";
  const reference = clean(body.reference, 1000) || "Not provided";
  if (!name || !validEmail(email) || !type || !details || body.consent !== "on" && body.consent !== true && body.consent !== "true") {
    return res.status(400).json({ error: "Please complete the required fields and confirm the quote-first terms." });
  }
  if (reference && reference !== "Not provided" && !/^https?:\/\/\S+$/i.test(reference)) {
    return res.status(400).json({ error: "Please enter a valid reference URL beginning with https:// or http://." });
  }
  try {
    const resend = new Resend(RESEND_API_KEY);
    const result = await resend.emails.send({
      from: RESEND_FROM_EMAIL,
      to: [COMMISSION_NOTIFICATION_EMAIL],
      replyTo: email,
      subject: `New InkRealm commission request — ${name}`,
      text: [
        "New commission request for TheInkRealm",
        "",
        `Name: ${name}`,
        `Email: ${email}`,
        `Commission type: ${type}`,
        `Budget: ${budget}`,
        `Deadline: ${deadline}`,
        `Reference: ${reference}`,
        "",
        "Project details:",
        details,
        "",
        "This is a quote request. No payment has been taken."
      ].join("\n")
    });
    if (result.error) {
      console.error("Resend send error:", result.error);
      return res.status(502).json({ error: "The request could not be emailed just now. Please try again later." });
    }
    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error("Commission notification error:", error);
    return res.status(500).json({ error: "The request could not be sent just now. Please try again later." });
  }
};
