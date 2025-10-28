import Email from "../models/emailModel.js";
import ContactMessage from "../models/contactMessageModel.js";
import ExpressError from "../middlewares/expressError.js";
import nodeMailer from "nodemailer";

const transporter = nodeMailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.error("❌ Email transporter error:", error);
  } else {
    console.log("✅ Email server is ready to send messages");
  }
});

export const saveEmail = async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    throw new ExpressError(400, "Email is required");
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new ExpressError(400, "Invalid email format");
  }

  const found = await Email.findOne({ email: email.toLowerCase() });
  if (found) {
    throw new ExpressError(400, "Email already registered for newsletter");
  }

  const newEmail = new Email({ email: email.toLowerCase() });
  await newEmail.save();

  try {
    const mailOptions = {
      from: `"Haryali Team" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Welcome to Haryali Newsletter! 🌾",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #16a34a 0%, #84cc16 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; padding: 12px 30px; background: #16a34a; color: white; text-decoration: none; border-radius: 8px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🌱 Welcome to Haryali!</h1>
            </div>
            <div class="content">
              <h2>Thank you for subscribing!</h2>
              <p>We're excited to have you join our community dedicated to sustainable farming and turning agricultural waste into valuable resources.</p>
              <p>You'll now receive:</p>
              <ul>
                <li>Latest updates on biomass solutions</li>
                <li>Success stories from farmers</li>
                <li>Tips for sustainable agriculture</li>
                <li>Exclusive offers and announcements</li>
              </ul>
              <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}" class="button">Visit Our Platform</a>
              <p>Stay green and prosper! 🌾</p>
            </div>
            <div class="footer">
              <p>© 2025 Haryali. All rights reserved.</p>
              <p>Turning Smoke to Income</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);
  } catch (emailError) {
    console.error("Failed to send welcome email:", emailError);
  }

  res.status(201).json({
    success: true,
    message: "Email registered successfully for newsletter",
  });
};

export const sendNewsletterEmail = async (req, res, next) => {
  const { subject, message } = req.body;

  if (!subject || !message) {
    throw new ExpressError(400, "Subject and message are required");
  }

  const emails = await Email.find().select("email -_id");
  if (!emails.length) {
    throw new ExpressError(400, "No registered emails found");
  }

  const emailList = emails.map((e) => e.email);
  let successCount = 0;
  let failCount = 0;

  const batchSize = 50;
  for (let i = 0; i < emailList.length; i += batchSize) {
    const batch = emailList.slice(i, i + batchSize);

    const mailOptions = {
      from: `"Haryali Team" <${process.env.EMAIL_USER}>`,
      bcc: batch, 
      subject,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #16a34a 0%, #84cc16 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🌱 Haryali Newsletter</h1>
            </div>
            <div class="content">
              ${message}
            </div>
            <div class="footer">
              <p>© 2025 Haryali. All rights reserved.</p>
              <p>Turning Smoke to Income</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    try {
      await transporter.sendMail(mailOptions);
      successCount += batch.length;
    } catch (error) {
      console.error(`Failed to send batch ${i / batchSize + 1}:`, error);
      failCount += batch.length;
    }
  }

  res.status(200).json({
    success: true,
    message: "Newsletter sent successfully",
    stats: {
      total: emailList.length,
      success: successCount,
      failed: failCount,
    },
  });
};

export const saveContactMessage = async (req, res, next) => {
  const { name, email, phone, message } = req.body;

  if (!name || !email || !message) {
    throw new ExpressError(400, "Name, email, and message are required");
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new ExpressError(400, "Invalid email format");
  }

  if (phone) {
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone.replace(/[-\s]/g, ""))) {
      throw new ExpressError(400, "Invalid phone number format");
    }
  }

  const contactMessage = new ContactMessage({
    name: name.trim(),
    email: email.toLowerCase().trim(),
    phone: phone?.trim(),
    message: message.trim(),
  });

  await contactMessage.save();

  // Send confirmation email to user
  try {
    const userMailOptions = {
      from: `"Haryali Support" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "We received your message - Haryali 🌾",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #16a34a 0%, #84cc16 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .message-box { background: white; padding: 20px; border-left: 4px solid #16a34a; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Thank You for Contacting Us! 🌱</h1>
            </div>
            <div class="content">
              <p>Hi <strong>${name}</strong>,</p>
              <p>We have received your message and our team will get back to you within 24-48 hours.</p>
              <div class="message-box">
                <h3>Your Message:</h3>
                <p>${message}</p>
              </div>
              <p>If you have any urgent queries, please call us directly or reply to this email.</p>
              <p>Best regards,<br><strong>Haryali Team</strong></p>
            </div>
            <div class="footer">
              <p>© 2025 Haryali. All rights reserved.</p>
              <p>Turning Smoke to Income</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    await transporter.sendMail(userMailOptions);
  } catch (emailError) {
    console.error("Failed to send confirmation email:", emailError);
  }

  try {
    const adminMailOptions = {
      from: `"Haryali Contact Form" <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <h2>New Contact Form Message</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || "Not provided"}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
        <hr>
        <p><em>Received at: ${new Date().toLocaleString()}</em></p>
      `,
    };

    await transporter.sendMail(adminMailOptions);
  } catch (emailError) {
    console.error("Failed to send admin notification:", emailError);
  }

  res.status(201).json({
    success: true,
    message: "Your message has been sent successfully. We'll get back to you soon!",
  });
};

export const getAllContactMessages = async (req, res, next) => {
  const { page = 1, limit = 10, status } = req.query;

  const query = status ? { status } : {};

  const messages = await ContactMessage.find(query)
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const count = await ContactMessage.countDocuments(query);

  res.status(200).json({
    success: true,
    messages,
    totalPages: Math.ceil(count / limit),
    currentPage: page,
    total: count,
  });
};

export const updateContactMessageStatus = async (req, res, next) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!["pending", "responded", "closed"].includes(status)) {
    throw new ExpressError(400, "Invalid status value");
  }

  const message = await ContactMessage.findByIdAndUpdate(
    id,
    { status },
    { new: true, runValidators: true }
  );

  if (!message) {
    throw new ExpressError(404, "Contact message not found");
  }

  res.status(200).json({
    success: true,
    message: "Status updated successfully",
    data: message,
  });
};

export const deleteContactMessage = async (req, res, next) => {
  const { id } = req.params;

  const message = await ContactMessage.findByIdAndDelete(id);

  if (!message) {
    throw new ExpressError(404, "Contact message not found");
  }

  res.status(200).json({
    success: true,
    message: "Contact message deleted successfully",
  });
};