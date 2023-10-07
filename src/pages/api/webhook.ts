import { api } from "@/utils/api";
import { clerkClient, type WebhookEvent } from "@clerk/nextjs/server";
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
  const { id } = evt.data;

  const eventType = evt.type;
  if (eventType === "user.created") {
    const user = await clerkClient.users.getUser(id ?? "");

    const email = user.emailAddresses[0]?.emailAddress;
    const username = user.username;

    const mutation = api.users.create.useMutation();

    if (id && email && username) {
      await mutation.mutateAsync({
        id,
        email: user.emailAddresses[0]?.emailAddress ?? "",
        username: user.username,
      });
    }

    res.status(201).json({ success: true, message: "User created" });
  }
}

type NextApiRequestWithSvixRequiredHeaders = NextApiRequest & {
  headers: IncomingHttpHeaders & WebhookRequiredHeaders;
};
