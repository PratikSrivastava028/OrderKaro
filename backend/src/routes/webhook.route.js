import express from "express";
import { Webhook } from "svix";
import UserModel from "../models/User.model.js";

const router = express.Router();

router.post(
  "/clerk",
  express.raw({ type: "application/json" }), // ✅ raw body required for svix
  async (req, res) => {
    const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;

    if (!webhookSecret) {
      return res.status(500).json({ error: "Webhook secret not configured" });
    }

    // ✅ Verify webhook signature
    const wh = new Webhook(webhookSecret);
    let event;

    try {
      event = wh.verify(req.body, {
        "svix-id": req.headers["svix-id"],
        "svix-timestamp": req.headers["svix-timestamp"],
        "svix-signature": req.headers["svix-signature"],
      });
    } catch (err) {
      console.error("Webhook verification failed:", err.message);
      return res.status(400).json({ error: "Webhook verification failed" });
    }

    // ✅ Handle events
    try {
      switch (event.type) {
        case "user.created": {
          const { email_addresses, first_name, last_name, id } = event.data;
          const email = email_addresses[0]?.email_address;

          const existingUser = await UserModel.findOne({ email });

          if (!existingUser) {
            await UserModel.create({
              fullName: `${first_name ?? ""} ${last_name ?? ""}`.trim(),
              email,
              mobile: "0000000000", // user updates later in profile
              role: "user",
              clerkId: id,
            });
            console.log("New user created from Clerk:", email);
          }
          break;
        }

        case "user.updated": {
          const { email_addresses, first_name, last_name, id } = event.data;
          const email = email_addresses[0]?.email_address;

          await UserModel.findOneAndUpdate(
            { clerkId: id },
            {
              fullName: `${first_name ?? ""} ${last_name ?? ""}`.trim(),
              email,
            },
          );
          console.log("User updated from Clerk:", email);
          break;
        }

        case "user.deleted": {
          await UserModel.findOneAndDelete({ clerkId: event.data.id });
          console.log("User deleted from Clerk:", event.data.id);
          break;
        }

        default:
          console.log("Unhandled webhook event:", event.type);
      }

      res.status(200).json({ received: true });
    } catch (err) {
      console.error("Webhook handler error:", err.message);
      res.status(500).json({ error: "Internal server error" });
    }
  },
);

export default router;
