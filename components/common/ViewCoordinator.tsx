import { useEffect, useState } from 'react'
import * as React from "react";
import { VercelProject } from '../../types/VercelProject';
import { PortalAuthentication } from '@ordercloud/portal-javascript-sdk/dist/models/PortalAuthentication';
import { IntegrationConfiguration } from '../../types/IntegrationConfiguration';
import { ENV_VARIABLES, NEW_PROJECT_CODE } from '../../services/constants';
import { CreateOrUpdateEnvVariables, DeleteEnvVariables } from '../../services/vercel-api';
import { useRouter } from 'next/router';
import Layout from './layout';
import SplashView from './SplashView';
import LoginView from './LoginView';
import RegisterView from './RegisterView';
import ForgotPasswordView from './ForgotPasswordView';
import { seed, SeedArgs } from '@ordercloud/seeding';
import ProjectSelectView from './ProjectSelectView';
import SeedingView from './SeedingView';

export type View = 'SPLASH_PAGE' | 'REGISTER' | 'LOGIN' | 'FORGOT_PASS' | 'PROJECT_SELECT' | 'SEEDING';

export interface ConnectedProject extends OrderCloudMarketplace {
  project: VercelProject;
}

export interface OrderCloudMarketplace {
  ID: string,
  Name: string,
  ApiClientID: string
}

export interface ViewCoordinatorProps {
  configuration: IntegrationConfiguration;
  initialView: View;
}

export default function ViewCoordinator(props: ViewCoordinatorProps) {
  const { configuration, initialView } = props; 
  const router = useRouter();
  const [connectedProjects, setConnectedProjects] = useState<ConnectedProject[]>([]);
  const [ocToken, setOCToken] = useState<PortalAuthentication>(null)
  const [vercelProjects, setVercelProjects] = useState<VercelProject[]>(null)
  const [logs, setLogs] = useState<string[]>([]);
  const [seedPageText, setSeedPageText] = useState<string>("We are seeding your marketplace!");
  const [view, setView] = useState<View>(initialView)

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
        console.log("projects", json.projects);
        setConnectedProjects(connectProjects(json.projects));
      }
    }
    if (props.configuration && !vercelProjects) {
        const { vercelAccessToken, teamId } = props.configuration;
        fetchProjects(vercelAccessToken, teamId)
    }
  })

  const connectProjects = (projects: VercelProject[]): ConnectedProject[] => {
    var marketplaces: ConnectedProject[] = [];
    for (var project of projects) {
      var ID = getEnvVariable(project, ENV_VARIABLES.MRKT_ID);
      var Name = getEnvVariable(project, ENV_VARIABLES.MRKT_NAME);
      var ApiClientID = getEnvVariable(project, ENV_VARIABLES.MRKT_API_CLIENT);
      if (ID && Name && ApiClientID) {
        marketplaces.push({ ID, Name, ApiClientID, project });
      }
    }
    return marketplaces;
  }

  const getEnvVariable = (project: VercelProject, key: string) : string | void => { 
    return project?.env?.find(env => env.key === key && env.value)?.value;
  }


  const onAuthenticate = async (auth: PortalAuthentication) => {
    setOCToken(auth);
    setView('PROJECT_SELECT');
  }

  const onSelectProjects = async (newConnections: ConnectedProject[]) => {
      console.log("result of selection", newConnections);
      var newMarketplace;
      if (newConnections.some(m => m.ID === NEW_PROJECT_CODE)) {
        newMarketplace = await seedNewMarketplace();
      }

      for (var selection of newConnections) {
        var oldMrktID = getEnvVariable(selection.project, ENV_VARIABLES.MRKT_ID);

        if (selection.ID === NEW_PROJECT_CODE) {
          // Connect to the new marketplace
          await CreateOrUpdateEnvVariables(selection.project, newMarketplace, configuration.vercelAccessToken)
        } else if (oldMrktID !== selection.ID) {
          // Connect to a different, existing marketplace
          var oldMarketplace = connectedProjects.find(m => m.ID === selection.ID);
          await CreateOrUpdateEnvVariables(selection.project, oldMarketplace, configuration.vercelAccessToken)
        } 
      }

      for (var project of connectedProjects) {
        if (!newConnections.some(s => s.project.id === project.project.id)) {
          // Project is no longer connected to any OC marketplace
          await DeleteEnvVariables(project.project, configuration.vercelAccessToken);
        }
      }
     
      backToVercel();
  }

  const seedNewMarketplace = async (): Promise<OrderCloudMarketplace> => {
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
      setSeedPageText("Done seeding. Connecting to project Env Variables.")
      return {
        ID: result.marketplaceID,
        Name: result.marketplaceName,
        ApiClientID: result.apiClients.find(x => x.AppName === "Storefront App").ID
      }
    } catch (err) {
      console.log(err)
      setSeedPageText("Sorry, something failed during setup. Close the window and try again.")
    }
  }

  const addLog = (message: string) => {
    setLogs(oldLogs => [message, ...oldLogs]);
  }

  const backToVercel = () => {
    if (router?.query?.next) {
        router.push(router.query.next as any)
    } else if (process.browser) {
        window.close();
    }
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
        <ProjectSelectView allProjects={vercelProjects} savedConnections={connectedProjects} saveAndContinue={onSelectProjects} />
      )}
      {view === 'SEEDING' && (
        <SeedingView logs={logs} text={seedPageText}/>
      )}
    </Layout>
  )
}
