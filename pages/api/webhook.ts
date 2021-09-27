import { IntegrationRemovedWehookPayload, VercelWebhook } from "../../types/VercelWebhook";
import crypto from "crypto";
import { cosmos } from "../../services/cosmos-db";

export default async function webhookHanlder(req, res) {  
    if (req.method !== "POST") {
        res.status(400).send({ message: "Only POST requests allowed" })
        return
    }

    const body = req.body as VercelWebhook;

    console.log(body);

    if (!verifyVercelWebhook(req, body)) {
        return res.status(403).json({ code: `invalid_signature`, error: `signature didn't match` });
    }

    if (body.type === "integration-configuration-removed") {
        handleIntegrationRemoved(body.payload)     
    }


    res.status(200).json({});
}

async function handleIntegrationRemoved(payload: IntegrationRemovedWehookPayload): Promise<void> {
    await cosmos.DeleteConfiguration(payload.configuration.id);
}


function verifyVercelWebhook(req, payload): boolean {
    var data = JSON.stringify(payload);
    const signature = crypto
      .createHmac('sha1', process.env.CLIENT_SECRET)
      .update(data)
      .digest('hex');
    return signature === req.headers['x-vercel-signature'];
}

