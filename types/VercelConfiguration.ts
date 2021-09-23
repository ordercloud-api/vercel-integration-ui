export interface VercelConfiguration {
    id: string;
    userId: string;
    teamId: string;
    currentProjectId?: string; // often null
    vercelAccessToken: string; // this is not saved in cosmos. An encrypted version of it is
    createdAt: number;
    updatedAt: number;
}

