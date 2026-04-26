import { NODEMAILER_EMAIL } from "../config/index.js";
import mailTransporter from "../config/nodemailer.config.js";

export const sendOtpMail = async (to, otp) => {
  await mailTransporter.sendMail({
    from: NODEMAILER_EMAIL,
    to,
    subject: "Reset Your Password",
    html: `<p>Your OTP for password reset is <b>${otp}</b>. It expires in 5 minutes.</p>`,
  });
};

export const sendDeliveryOtpMail = async (user, otp) => {
  await mailTransporter.sendMail({
    from: NODEMAILER_EMAIL,
    to: user.email,
    subject: "Delivery OTP",
    html: `<p>Your OTP for delivery is <b>${otp}</b>. It expires in 5 minutes.</p>`,
  });
};
