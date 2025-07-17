const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.urlencoded({ extended: false }));

// ✅ Hardcoded configuration (Jahon and Sonita)
const recipients = [
  {
    phone: "+16048302649", // Jahon
    apikey: "2414417"
  },
  {
    phone: "+17785123726", // Sonita
    apikey: "2268054"
  }
];

// 🔔 Twilio webhook: sends WhatsApp alert
app.post("/incoming-call", async (req, res) => {
  const time = new Date().toLocaleTimeString();
  const message = `🚨 Jahon just called the emergency number at ${time}.`;

  for (const r of recipients) {
    try {
      await axios.get("https://api.callmebot.com/whatsapp.php", {
        params: {
          phone: r.phone,
          text: message,
          apikey: r.apikey
        }
      });
      console.log(`✅ Alert sent to ${r.phone}`);
    } catch (err) {
      console.error(`❌ Failed to alert ${r.phone}: ${err.message}`);
    }
  }

  res.set("Content-Type", "text/xml");
  res.send(`
    <Response>
      <Say voice="alice">Your emergency alert has been sent. Help is on the way.</Say>
    </Response>
  `);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚨 Emergency alert system running on port ${PORT}`);
});
