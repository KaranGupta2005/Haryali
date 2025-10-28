import Email from "../models/Email.js";
import ContactMessage from "../models/contactMessage.js";
import ExpressError from "../middlewares/expressError.js";
import nodemailer from "nodemailer";

// email transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "guptakaran.port@gmail.com",
    pass: "yfsyqmmjocmsthhd", 
  },
});

transporter.verify((err) => {
  if (err) console.error("❌ Mailer connection failed:", err);
  else console.log("✅ Mailer ready to send emails");
});

export const saveEmail = async (req, res) => {
  const { email } = req.body;

  const found = await Email.findOne({ email: email.toLowerCase() });
  if (found) throw new ExpressError(400, "Email already subscribed");

  await Email.create({ email: email.toLowerCase() });

  await transporter.sendMail({
    from: `"Haryali Team" <guptakaran.port@gmail.com>`,
    to: email,
    subject: "Welcome to Haryali Newsletter! 🌾",
    html: `
      <div style="font-family:Arial,sans-serif">
        <h2>🌱 Welcome to Haryali!</h2>
        <p>Thank you for subscribing! You’ll now receive updates about sustainability and green farming.</p>
        <a href="http://localhost:5173"
           style="background:#16a34a;color:white;padding:10px 20px;border-radius:6px;text-decoration:none;">
           Visit Our Platform
        </a>
        <p style="margin-top:20px;">Stay Green 🌾</p>
      </div>
    `,
  });

  res.status(201).json({ success: true, message: "Subscribed successfully!" });
};

// updates
export const sendNewsletterEmail = async (req, res) => {
  const { subject, message } = req.body;
  if (!subject || !message) throw new ExpressError(400, "Subject & message required");

  const emails = await Email.find().select("email -_id");
  if (!emails.length) throw new ExpressError(400, "No subscribers found");

  const list = emails.map((e) => e.email);
  let sent = 0;

  for (let i = 0; i < list.length; i += 50) {
    const batch = list.slice(i, i + 50);
    try {
      await transporter.sendMail({
        from: `"Haryali Team" <guptakaran.port@gmail.com>`,
        bcc: batch,
        subject,
        html: `<div style="font-family:Arial,sans-serif">${message}</div>`,
      });
      sent += batch.length;
    } catch (err) {
      console.error("Batch send failed:", err);
    }
  }

  res.status(200).json({
    success: true,
    message: `Newsletter sent successfully to ${sent}/${list.length} users.`,
  });
};

export const saveContactMessage = async (req, res) => {
  const { name, email, phone, message } = req.body;

  const contact = await ContactMessage.create({ name, email, phone, message });

  // Confirmation to user
  await transporter.sendMail({
    from: `"Haryali Support" <guptakaran.port@gmail.com>`,
    to: email,
    subject: "We received your message 🌾",
    html: `
      <div style="font-family:Arial,sans-serif">
        <h3>Hi ${name},</h3>
        <p>Thank you for reaching out! We’ve received your message and will get back to you soon.</p>
        <blockquote>${message}</blockquote>
        <p>Warm regards,<br><strong>Team Haryali</strong></p>
      </div>
    `,
  });

  // Notify admin
  await transporter.sendMail({
    from: `"Haryali Contact" <guptakaran.port@gmail.com>`,
    to: "guptakaran.port@gmail.com",
    subject: `New Contact Form Message from ${name}`,
    html: `
      <h2>New Contact Message</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone || "Not provided"}</p>
      <p><strong>Message:</strong> ${message}</p>
      <hr>
      <p><em>Received on ${new Date().toLocaleString()}</em></p>
    `,
  });

  res.status(201).json({
    success: true,
    message: "Message received. Confirmation email sent!",
    data: contact,
  });
};