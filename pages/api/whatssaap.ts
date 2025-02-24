import type { NextApiRequest, NextApiResponse } from "next";

type ResponseData = {
  error?: string;
  message?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { phone, message } = req.body as { phone: string; message: string };

  if (!phone || !message) {
    return res.status(400).json({ error: "Phone and message are required" });
  }

  const ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN as string; // Met ton token dans un fichier .env
  const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_ID as string; // Met ton ID dans .env

  if (!ACCESS_TOKEN || !PHONE_NUMBER_ID) {
    return res.status(500).json({ error: "Missing API credentials" });
  }

  try {
    const response = await fetch(
      `https://graph.facebook.com/v17.0/${PHONE_NUMBER_ID}/messages`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${ACCESS_TOKEN}`,
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: phone,
          type: "text",
          text: { body: message },
        }),
      }
    );

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error?.message || "Error sending message");
    }

    return res.status(200).json({ message: "Message sent successfully" });
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
}
