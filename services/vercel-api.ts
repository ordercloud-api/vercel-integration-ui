import axios from "axios";
import { OrderCloudMarketplace } from "../components/common/ViewCoordinator";
import { VercelProject } from "../types/VercelProject";
import { ENV_VARIABLES } from "./constants";

export const CreateOrUpdateEnvVariables = async (project: VercelProject, marketplace: OrderCloudMarketplace, accessToken: string) : Promise<void> => {    
    var toSet = [
      {
        key: ENV_VARIABLES.MRKT_API_CLIENT,
        value: marketplace.ApiClientID
      },
      {
        key: ENV_VARIABLES.MRKT_ID,
        value: marketplace.ID
      },
      {
        key: ENV_VARIABLES.MRKT_NAME,
        value: marketplace.Name
      },
      {
        key: ENV_VARIABLES.PROVIDER,
        value: "ordercloud"
      }
    ];
    var requests = toSet.map(varToSet => {
        var existing = project.env.find(existing => existing.key === varToSet.key)
        if (existing !== undefined) {
            // update value
            return axios.patch(
                `https://api.vercel.com/v8/projects/${project.id}/env/${existing.id}`, 
                { value: varToSet.value },
                { headers: { Authorization:  `Bearer ${accessToken}` }}
            )

        } else {
            // create 
            return axios.post(
                `https://api.vercel.com/v8/projects/${project.id}/env`, 
                {...varToSet, type: "plain", target: ["development", "preview", "production"]},
                { headers: { Authorization:  `Bearer ${accessToken}` }}
            )
        }
      });
      await Promise.all(requests);
}

export const DeleteEnvVariables = async (project: VercelProject, accessToken: string) : Promise<void> => {
    var toDelete = [
        ENV_VARIABLES.MRKT_API_CLIENT,
        ENV_VARIABLES.MRKT_ID,
        ENV_VARIABLES.MRKT_NAME,
        ENV_VARIABLES.PROVIDER
    ];    
    var requests = toDelete.map(key => {
        var varID = project.env.find(e => e.key === key).id;
        return axios.delete(
            `https://api.vercel.com/v8/projects/${project.id}/env/${varID}`, 
            { headers: { Authorization:  `Bearer ${accessToken}` }}
        );
    });
    try { 
        await Promise.all(requests);
    } catch {} // If delete fails b/c the thing didn't exist, that's fine.
}