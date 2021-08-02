import { seed } from "@ordercloud/seeding";

export default async function SeedOrganization(req, res) {
    
    const result = await seed({
        marketplaceName: 'Vercel Commerce',
        portalToken: req.query.ocToken,
        filePath: 'Vercel-B2C',
        logger: (message, type) => {
          console.log(message); // TODO - use websockets maybe?
        }
      });
   
    
    console.log('https://api.vercel.com/v2/oauth/seed-organization returned:', JSON.stringify(result, null, '  '))
  
    res.status(200).json(result)
  }