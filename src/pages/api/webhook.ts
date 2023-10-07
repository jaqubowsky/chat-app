import { db } from "@/server/db";
import { type UserJSON, type WebhookEvent } from "@clerk/nextjs/server";
import type { IncomingHttpHeaders } from "http";
import type { NextApiRequest, NextApiResponse } from "next";
import type { WebhookRequiredHeaders } from "svix";
import { Webhook } from "svix";

const webhookSecret: string = process.env.WEBHOOK_SECRET!;

export default async function handler(
  req: NextApiRequestWithSvixRequiredHeaders,
  res: NextApiResponse,
) {
  const payload = JSON.stringify(req.body);
  const headers = req.headers;
  // Create a new Webhook instance with your webhook secret
  const wh = new Webhook(webhookSecret);

  let evt: WebhookEvent;
  try {
    // Verify the webhook payload and headers
    evt = wh.verify(payload, headers) as WebhookEvent;
  } catch (_) {
    // If the verification fails, return a 400 error
    return res.status(400).json({});
  }
  const { email_addresses, id, image_url: imageUrl } = evt.data as UserJSON;

  const eventType = evt.type;
  if (eventType === "user.created") {
    try {
      await db.user.create({
        data: {
          email: email_addresses[0]?.email_address,
          id: id,
          imageUrl,
        },
      });
    } catch (err) {
      if (err instanceof Error) {
        return res.status(500).json({ error: err.message });
      }
    }
  }

  res.status(201).json({ success: true, message: "User created" });
}

type NextApiRequestWithSvixRequiredHeaders = NextApiRequest & {
  headers: IncomingHttpHeaders & WebhookRequiredHeaders;
};
