import axios from "axios";
import { VercelConfiguration } from "../types/VercelConfiguration";
import { OCEnvVariables } from "../types/OCEnvVariables";
import { VercelProject } from "../types/VercelProject";
import { ENV_VARIABLES } from "./constants";

export const CreateOrUpdateEnvVariables = async (project: VercelProject, vars: OCEnvVariables, configuration: VercelConfiguration) : Promise<void> => {    
    var toSet = [
      {
        key: ENV_VARIABLES.MIDDLEWARE_CLIENT_ID,
        value: vars.MiddlewareClientID
      },
      {
        key: ENV_VARIABLES.MRKT_ID,
        value: vars.MarketplaceID
      },
      {
        key: ENV_VARIABLES.MRKT_NAME,
        value: vars.MarketplaceName
      },
      {
        key: ENV_VARIABLES.MIDDLEWARE_CLIENT_SECRET,
        value: vars.MiddlewareClientSecret
      },
      {
        key: ENV_VARIABLES.STOREFRONT_CLIENT_ID,
        value: vars.StoreFrontClientID
      },
      {
        key: ENV_VARIABLES.PROVIDER,
        value: "@vercel/commerce-ordercloud"
      }
    ];
    var requests = toSet.map(varToSet => {
        var existing = project.env.find(existing => existing.key === varToSet.key)
        if (existing !== undefined) {
            // update value
            return axios.patch(
                `https://api.vercel.com/v8/projects/${project.id}/env/${existing.id}${configuration?.teamId ? `?teamId=${configuration?.teamId}` : ''}`, 
                { value: varToSet.value },
                { headers: { Authorization:  `Bearer ${configuration.vercelAccessToken}` }}
            )

        } else {
            // create 
            return axios.post(
                `https://api.vercel.com/v8/projects/${project.id}/env${configuration?.teamId ? `?teamId=${configuration?.teamId}` : ''}`, 
                {...varToSet, type: "plain", target: ["development", "preview", "production"]},
                { headers: { Authorization:  `Bearer ${configuration.vercelAccessToken}` }}
            )
        }
      });
      await Promise.all(requests);
}

export const DeleteEnvVariables = async (project: VercelProject, configuration: VercelConfiguration) : Promise<void> => {
    var toDelete = [
        ENV_VARIABLES.STOREFRONT_CLIENT_ID,
        ENV_VARIABLES.MIDDLEWARE_CLIENT_ID,
        ENV_VARIABLES.MIDDLEWARE_CLIENT_SECRET,
        ENV_VARIABLES.MRKT_ID,
        ENV_VARIABLES.MRKT_NAME,
        ENV_VARIABLES.PROVIDER,
    ];    
    var requests = toDelete.map(key => {
        var varID = project.env.find(e => e.key === key).id;
        return axios.delete(
            `https://api.vercel.com/v8/projects/${project.id}/env/${varID}${configuration?.teamId ? `?teamId=${configuration?.teamId}` : ''}`, 
            { headers: { Authorization:  `Bearer ${configuration.vercelAccessToken}` }}
        );
    });
    try { 
        await Promise.all(requests);
    } catch {} // If delete fails b/c the thing didn't exist, that's fine.
}