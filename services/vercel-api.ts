import axios from "axios";
import { VercelProject } from "../types/VercelProject";

export const CreateOrUpdateEnvVariables = async (project: VercelProject, accessToken: string, varsToSet: { key: string, value: string }[]) : Promise<void> => {    
    var requests = varsToSet.map(varToSet => {
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

export const DeleteEnvVariables = async (project: VercelProject, accessToken: string, keys: string[]) : Promise<void> => {    
    var requests = keys.map(key => {
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