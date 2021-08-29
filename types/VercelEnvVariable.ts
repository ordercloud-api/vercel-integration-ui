
export interface VercelEnvVariable {
    type?: string;
    value?: string;
    target?: VercelEnvVariableTarget[];
    key?: string;
    configurationId?: string;
    id?: string;
    createdAt?: number;
    updatedAt?: number;
    createdBy?: string;
    updatedBy?: string;
}

export interface ListEnvVariableResponse {
    envs: VercelEnvVariable[];
}

export type VercelEnvVariableTarget = "production" | "development" |"preview";