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
import { SeedArgs, SeedResponse } from '@ordercloud/seeding';
import { CreateOrUpdateEnvVariables, DeleteEnvVariables } from '../services/vercel-api';
import ProjectSelect, { ProjectActions } from '../components/common/ProjectSelect';

export type View = 'SPLASH_PAGE' | 'REGISTER' | 'LOGIN' | 'FORGOT_PASS' | 'PROJECT_SELECT' | 'SEEDING';

export interface Marketplace {
  ID: string,
  ApiClient: string
}

export default function CallbackPage() {
  const router = useRouter()
  const [vercelToken, setVercelToken] = useState<VercelTokenContext>({})
  const [marketplace, setMarketplace] = useState<Marketplace>(null);
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
        var envVars = json.projects.flatMap(p => p.env);
        var marketplace = envVars.find(env => env.key === "NEXT_PUBLIC_ORDERCLOUD_MARKETPLACE_ID" && env.value);
        var apiClient = envVars.find(env => env.key === "NEXT_PUBLIC_ORDERCLOUD_CLIENT_ID" && env.value);
        if (marketplace && apiClient) {
          setMarketplace({ ID: marketplace.value, ApiClient: apiClient.value });
        }
      }
    }

    const { accessToken, teamId } = vercelToken
    fetchProjects(accessToken, teamId)
  }, [vercelToken])

  const onAuthenticate = async (auth: PortalAuthentication) => {
    console.log("projects", vercelProjects);
    console.log("marketpalce", marketplace);
    setOCToken(auth);
    setView('PROJECT_SELECT');
  }

  const selectProjects = async (projectActions: ProjectActions) => {
    console.log("project actions", projectActions);

    var apiClientID = marketplace?.ApiClient;
    var marketplaceID = marketplace?.ID;
    
      if (!marketplace) {
        // Create a new org
        try {
          setView('SEEDING');
          const result = await seed({
            marketplaceName: 'Vercel Commerce',
            dataUrl: 'Vercel-B2C',
            portalToken: ocToken.access_token,
            logger: (message, type) => {
              addLog(message);
            }
          } as SeedArgs);
          marketplaceID = result.marketplaceID;
          apiClientID = result.apiClients.find(x => x.AppName === "Storefront App").ID;
        } catch (err) {
          console.log(err)
          setSeedPageText("Sorry, something failed during setup. Close the window and try again.")
        }
      }
      for (var project of projectActions.toAdd) {
        await setEnvVariables(project, apiClientID, marketplaceID);
      }
      for (var project of projectActions.toRemove) {
        await DeleteEnvVariables(project, vercelToken.accessToken, ["NEXT_PUBLIC_ORDERCLOUD_CLIENT_ID", "NEXT_PUBLIC_ORDERCLOUD_MARKETPLACE_ID", "NEXT_PUBLIC_ORDERCLOUD_MARKETPLACE_ID"]);
      }
      backToVercel();
  }

  const setEnvVariables = async (project: VercelProject, apiClientID: string, marketplaceID: string): Promise<void> => {
      await CreateOrUpdateEnvVariables(project, vercelToken.accessToken, [
        {
          key: "NEXT_PUBLIC_ORDERCLOUD_CLIENT_ID",
          value: apiClientID
        },
        {
          key: "NEXT_PUBLIC_ORDERCLOUD_MARKETPLACE_ID",
          value: marketplaceID
        },
        {
          key: "COMMERCE_PROVIDER",
          value: "ordercloud"
        },
      ]);      
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
      {view === 'PROJECT_SELECT' && (
        <ProjectSelect allProjects={vercelProjects} marketplaceID={marketplace.ID} selectProjects={selectProjects} />
      )}
      {view === 'SEEDING' && (
        <SeedingView logs={logs} text={seedPageText}/>
      )}
    </Layout>
  )
}
