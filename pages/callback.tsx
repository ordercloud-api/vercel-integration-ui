import { useEffect, useState } from 'react'
import * as React from "react";
import { useRouter } from 'next/router'
import Layout from '../components/common/layout';
import { VercelTokenContext } from '../types/VercelTokenContext';
import { VercelProject } from '../types/VercelProject';
import SplashView from '../components/common/SplashView';
import LoginView from '../components/common/LoginView';
import RegisterView from '../components/common/RegisterView';
import { PortalAuthentication } from '@ordercloud/portal-javascript-sdk/dist/models/PortalAuthentication';
import ForgotPasswordView from '../components/common/ForgotPasswordView';
import SeedingView from '../components/common/Seeding';
import { seed } from '@ordercloud/seeding';
import { SeedArgs, SeedResponse } from '@ordercloud/seeding/dist/commands/seed';
import axios from 'axios';

export type View = 'SPLASH_PAGE' | 'REGISTER' | 'LOGIN' | 'FORGOT_PASS' | 'SEEDING'

export default function CallbackPage() {
  const router = useRouter()
  const [vercelToken, setVercelToken] = useState<VercelTokenContext>({})
  const [ocToken, setOCToken] = useState<PortalAuthentication>(null)
  const [vercelProjects, setVercelProjects] = useState<VercelProject[]>()
  const [logs, setLogs] = useState<string[]>([]);
  const [seedPageText, setSeedPageText] = useState<string>("We are creating your storefront!");
  const [view, setView] = useState<View>('SPLASH_PAGE')

  useEffect(() => {
    const fetchAccessToken = async (code) => {
      const res = await fetch(`/api/get-access-token?code=${code}`)
      const json = await res.json()

      setVercelToken({
        accessToken: json.access_token,
        userId: json.user_id,
        teamId: json.team_id
      })

      console.log("Get Access token response", json);

    }

    if (router.isReady && !vercelToken.accessToken) {
      const { code } = router.query
      fetchAccessToken(code)
    }
  }, [router])

  useEffect(() => {
    const fetchProjects = async (accessToken, teamId) => {
      if (accessToken) {
        {/* If we have a teamId, all calls to the Vercel API should have it attached as a query parameter */ }
        const res = await fetch(`https://api.vercel.com/v8/projects${teamId ? `?teamId=${teamId}` : ''}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        const json = await res.json()

        setVercelProjects(json.projects)
      }
    }

    const { accessToken, teamId } = vercelToken
    fetchProjects(accessToken, teamId)
  }, [vercelToken])

  const onAuthenticate = async (auth: PortalAuthentication) => {
    setOCToken(auth);
    setView('SEEDING');
    try {
      const result = await seed({
        marketplaceName: 'Vercel Commerce',
        //portalToken: auth.access_token,
        dataUrl: 'Vercel-B2C',
        portalToken: auth.access_token,
        logger: (message, type) => {
          addLog(message);
        }
      } as SeedArgs);
      console.log("Vercel Projects", vercelProjects);
      console.log("Api Clients", vercelProjects);
      for (var project of vercelProjects) {
        addLog(`Setting Enviornment Variables in Vercel project ${project.name}`);
        await createVercelEnvVariables(project, result as SeedResponse);
      }
      
      backToVercel();
    } catch (err) {
      console.log(err)
      setSeedPageText("Sorry, something failed during setup. Close the window and try again.")
    }
  }

  const createVercelEnvVariables = async (project: VercelProject, seedResponse: SeedResponse): Promise<void> => {
      var apiClient = seedResponse.apiClients.find(x => x.AppName === "Storefront App") as any;
      var envVars = [
        {
          key: "NEXT_PUBLIC_ORDERCLOUD_STOREFRONT_APICLIENT",
          value: apiClient.ID
        },
        {
          key: "NEXT_PUBLIC_ORDERCLOUD_STORE_DOMAIN",
          value: `https://${project.name}.vercel.app`
        },
        {
          key: "NEXT_PUBLIC_ORDERCLOUD_MARKETPLACE_ID",
          value: seedResponse.marketplaceID
        },
        {
          key: "COMMERCE_PROVIDER",
          value: "ordercloud"
        },
      ];
      var requests = envVars.map(c => {
        return axios.post(
          `https://api.vercel.com/v8/projects/${project.id}/env`, 
          {...c, type: "plain", target: ["development", "preview", "production"]},
          { headers: { Authorization:  `Bearer ${vercelToken.accessToken}` }}
        )
      })
      await Promise.all(requests);
  }

  const addLog = (message: string) => {
    setLogs(oldLogs => [...oldLogs, message]);
  }

  const backToVercel = () => {
    router.push(router.query.next as any)
  }


  return (
    <Layout>
      {view === 'SPLASH_PAGE' && <SplashView setView={setView} />}
      {view === 'LOGIN' && (
        <LoginView setView={setView} onAuthenticate={onAuthenticate}/>
      )}
      {view === 'REGISTER' && (
        <RegisterView setView={setView} onAuthenticate={onAuthenticate} />
      )}
      {view === 'FORGOT_PASS' && (
        <ForgotPasswordView setView={setView} />
      )}
      {view === 'SEEDING' && (
        <SeedingView logs={logs} text={seedPageText}/>
      )}
    </Layout>
  )
}
