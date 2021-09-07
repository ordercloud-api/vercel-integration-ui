import { CosmosClient } from "@azure/cosmos";
import { IntegrationConfiguration } from "../types/IntegrationConfiguration";
import { COSMOS_CONFIGURATION_CONTAINER } from "./constants";

const {
    COSMOSDB_DB_NAME,
    COSMOSDB_ENDPOINT,
    COSMOSDB_KEY,
} = process.env;

if (
    !COSMOSDB_DB_NAME ||
    !COSMOSDB_ENDPOINT ||
    !COSMOSDB_KEY
  ) {
    throw new Error(
      'One or multiple required environment variables required for cosmosdb are missing'
    )
  }
  

const client = new CosmosClient({ endpoint: COSMOSDB_ENDPOINT, key: COSMOSDB_KEY });

const configurations = client.database(COSMOSDB_DB_NAME).container(COSMOS_CONFIGURATION_CONTAINER);

export const cosmos = {
    GetConfiguration: async (configurationID: string): Promise<IntegrationConfiguration> => {
        try {
            console.log("id:", configurationID);
            var resp = await configurations.items.query(`SELECT * from c where c.id = '${configurationID}'`).fetchAll();
            console.log("Found configuration in CosmosDB:", resp.resources[0])
            return resp.resources[0];
        } catch (e) {
            console.log("Cosmos Error", e);
        }
    },

    CreateConfiguration: async (configuration: IntegrationConfiguration): Promise<IntegrationConfiguration> => {
        try {
             var resp = await configurations.items.create(configuration);
             return resp.resource;
         } catch (e) {
             console.log("Cosmos Error", e);
         }
    }
}



