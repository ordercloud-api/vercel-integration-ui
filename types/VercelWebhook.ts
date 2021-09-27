// https://vercel.com/docs/integrations#webhooks
export interface VercelWebhook<TPayload = any> {
    id: string;
    type: string;
    clientId: string;
    createdAt: number;
    payload: TPayload;
    ownerId: string;
    teamId: string;
    userId: string;
    webhookId: string;
}

export interface IntegrationRemovedWehookPayload {
    configuration: { id: string, projects: string[] };
}

export type VercelWebhookTypes = 
"integration-configuration-removed" |
"integration-configuration-permission-updated" |
"deployment" |
"deployment-ready" |
"deployment-error" |
"project-created" |
"project-removed" |
"domain-created"
