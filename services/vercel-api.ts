import axios from "axios";
import { ListEnvVariableResponse } from "../types/VercelEnvVariable";

export const CreateOrUpdateEnvVariables = async (projectID: string, accessToken: string, varsToSet: { key: string, value: string }[]) : Promise<void> => {
    var existingVars = await axios.get<ListEnvVariableResponse>(
        `https://api.vercel.com/v8/projects/${projectID}/env`, 
        { headers: { Authorization:  `Bearer ${accessToken}` }}
    );
    
    var requests = varsToSet.map(c => {
        var existing = existingVars.data.envs.find(existing => existing.key === c.key)
        if (existing !== undefined) {
            // update value
            return axios.patch(
                `https://api.vercel.com/v8/projects/${projectID}/env/${existing.id}`, 
                { value: c.value },
                { headers: { Authorization:  `Bearer ${accessToken}` }}
            )

        } else {
            // create 
            return axios.post(
                `https://api.vercel.com/v8/projects/${projectID}/env`, 
                {...c, type: "plain", target: ["development", "preview", "production"]},
                { headers: { Authorization:  `Bearer ${accessToken}` }}
            )
        }
      });
      await Promise.all(requests);
}