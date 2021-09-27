import { CosmosClient } from "@azure/cosmos";
import { VercelConfiguration } from "../types/VercelConfiguration";
import { AES, enc } from 'crypto-js'; 
import { COSMOS_CONFIGURATION_CONTAINER } from "./constants";

const {
    COSMOSDB_DB_NAME,
    COSMOSDB_ENDPOINT,
    COSMOSDB_KEY,
    TOKEN_ENCRYPT_KEY,
    ENV_NAME
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
const db = client.database(COSMOSDB_DB_NAME);

export const cosmos = {
    GetConfiguration: async (configurationID: string): Promise<VercelConfiguration> => {
        try {
            console.log("id:", configurationID);
            const container = await db.containers.createIfNotExists({ partitionKey: "/id", id: COSMOS_CONFIGURATION_CONTAINER });
            var data = await container.container.items.query(`SELECT * from c where c.id = '${configurationID}'`).fetchAll();
            var configuration = data.resources[0];
            return {
                ...configuration,
                vercelAccessToken: AES.decrypt(configuration.encryptedVercelToken, TOKEN_ENCRYPT_KEY).toString(enc.Utf8),
                encryptedVercelToken: null
            };
        } catch (e) {
            console.log("Cosmos Error", e);
        }
    },
    DeleteConfiguration: async (configurationID: string): Promise<void> => {
        try {
            const container = await db.containers.createIfNotExists({ partitionKey: "/id", id: COSMOS_CONFIGURATION_CONTAINER });
            await container.container.item(configurationID, configurationID).delete();
        } catch (e) {
            console.log("Cosmos Error", e);
        }
    },
    CreateConfiguration: async (configuration: VercelConfiguration): Promise<VercelConfiguration> => {
        try {
            var toSave = { 
                ...configuration, 
                env: ENV_NAME, 
                vercelAccessToken: null, 
                encryptedVercelToken: AES.encrypt(configuration.vercelAccessToken, TOKEN_ENCRYPT_KEY).toString() 
            };
            const container = await db.containers.createIfNotExists({ partitionKey: "/id", id: COSMOS_CONFIGURATION_CONTAINER });
            var data = await container.container.items.create(toSave);
            console.log("Created configuration in CosmosDB:", data.item);
            return configuration;   
         } catch (e) {
            console.log("Cosmos Error", e);
         }
    }
}



