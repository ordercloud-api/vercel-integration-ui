export interface IntegrationConfiguration {
    id: string;
    userId: string;
    teamId: string;
    currentProjectId?: string; // often null
    vercelAccessToken: string;
    createdAt: number;
    updatedAt: number;
}

