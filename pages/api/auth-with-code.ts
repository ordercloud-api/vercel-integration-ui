import * as qs from 'querystring'
import { cosmos } from '../../services/cosmos-db';

/**
 * This endpoint can be only called once
 *
 * Our `code` is only valid for one request. If we call it more then once,
 * we get "Invalid grant: authorization code is invalid".
 */
export default async function authWithCode(req, res) {
  var vercelAuth = await getAccessToken(req.query.code);

  var existingDbEntry = await cosmos.GetConfiguration(req.query.configurationId);

  if (!existingDbEntry) {
    existingDbEntry = await cosmos.CreateConfiguration({
      id: req.query.configurationId,
      userId: vercelAuth.user_id,
      teamId: vercelAuth.team_id,
      vercelAccessToken: vercelAuth.access_token,
      createdAt: Date.now(),
      updatedAt: Date.now()
    });
  }

  res.status(200).json(existingDbEntry)
}


async function getAccessToken(code: string) {
  const result = await fetch('https://api.vercel.com/v2/oauth/access_token', {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    method: 'POST',
    body: qs.stringify({
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      code: code,
      redirect_uri: `${process.env.HOST}/callback` // this parameter should match the Redirect URL in your integration settings on Vercel
    })
  })

  var json = await result.json()
  console.log('https://api.vercel.com/v2/oauth/access_token returned:', JSON.stringify(json, null, '  '))
  
  return json;
}