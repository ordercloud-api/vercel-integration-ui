import { Organization } from "@ordercloud/portal-javascript-sdk";
import { VercelProject } from "./VercelProject";

export interface ConnectedProject {
    project: VercelProject;
    marketplace: Organization;
  }