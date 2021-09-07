import { cosmos } from "../../services/cosmos-db"

export default async function getConfiguation(req, res) {  
    var body = await cosmos.GetConfiguration(req.query.configurationId);

    console.log('Found configuration in CosmosDB:', body)

    res.status(200).json(body)
}