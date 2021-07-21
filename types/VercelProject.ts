export interface VercelProject {
    accountId?: string;
    autoExposeSystemEnvs?: boolean;
    buildCommand?: string;
    createdAt?: number;
    devCommand?: string;
    directoryListing?: boolean;
    env?: VercelProjectEnv[]
    framework?: string;
    gitForkProtection?: boolean;
    id?: string;
    installCommand?: string;
    name?: string;
    nodeVersion?: string;
    outputDirectory?: string;
    publicSource?: string;
    rootDirectory?: string;
    serverlessFunctionRegion?: string;
    sourceFilesOutsideRootDirectory?: boolean;
    updatedAt?: number;
    live?: boolean;
    link: VercelProjectLink,
    latestDeployments: VercelProjectDeployment[]
    targets: any;
}

export interface VercelProjectLink {
    type?: string;
    repo?: string;
    repoId?: number;
    org?: string;
    gitCredentialId?: string;
    productionBranch?: string;
    createdAt?: number;
    updatedAt?: number;
    deployHooks?: any[];
}

export interface VercelProjectEnv {
    type?: string;
    value?: string;
    target?: string;
    configurationId?: string;
    id?: string;
    key?: string;
    createdAt?: number;
    updatedAt?: number;
    createdBy?: string;
    updatedBy?: string;
}

export interface VercelProjectDeployment {
    alias?: string[];
    aliasAssigned?: number; // date
    builds?: any[];
    createdAt?: number;
    createdIn?: string; // deployment region e.g. "sfo1"
    creator?: VercelProjectDeploymentCreator;
    deploymentHostname?: string;
    forced?: boolean;
    id?: string;
    meta?: any;
    name?: string;
    plan?: string;
    private?: boolean;
    readyState?: string;
    target?: string;
    teamId?: string;
    type?: string;
    url?: string;
    userId?: string;
    withCache?: boolean;
}

export interface VercelProjectDeploymentCreator {
    uid?: string;
    email?: string;
    username?: string;
    githubLogin?: string;
}
