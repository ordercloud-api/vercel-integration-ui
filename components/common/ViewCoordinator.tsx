import { useEffect, useState } from 'react'
import * as React from "react";
import { VercelProject } from '../../types/VercelProject';
import { PortalAuthentication } from '@ordercloud/portal-javascript-sdk/dist/models/PortalAuthentication';
import { VercelConfiguration } from '../../types/VercelConfiguration';
import { ENV_VARIABLES, LIMIT_ON_SANDBOX_MARKETPLACES, MIDDLEWARE_API_CLIENT_NAME, NEW_PROJECT_CODE, ORDERCLOUD_URLS, SANDBOX_ENV_CODE, STOREFRONT_API_CLIENT_NAME } from '../../services/constants';
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
import { OCEnvVariables } from '../../types/OCEnvVariables';
import { ApiClients as PortalClients, Organization, Organizations } from '@ordercloud/portal-javascript-sdk';
import { ApiClient, ApiClients, Configuration } from 'ordercloud-javascript-sdk';
import randomstring from 'randomstring';

import { ConnectedProject } from '../../types/ConnectedProject';
import { Alert } from '../ordercloud-ui/AlertContainer';

export type View = 'SPLASH_PAGE' | 'REGISTER' | 'LOGIN' | 'FORGOT_PASS' | 'PROJECT_SELECT' | 'SEEDING';

export interface ViewCoordinatorProps {
  configuration: VercelConfiguration;
  initialView: View;
}

export default function ViewCoordinator(props: ViewCoordinatorProps) {
  const { configuration, initialView } = props; 
  const router = useRouter();
  const [connectedProjects, setConnectedProjects] = useState<ConnectedProject[]>([]);
  const [ocToken, setOCToken] = useState<PortalAuthentication>(null)
  const [vercelProjects, setVercelProjects] = useState<VercelProject[]>(null)
  const [ocMarketplaces, setOcMarketplaces] = useState<Organization[]>(null)
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
      var Id = getEnvVariable(project, ENV_VARIABLES.MRKT_ID);
      var Name = getEnvVariable(project, ENV_VARIABLES.MRKT_NAME);
      if (Id && Name) {
        marketplaces.push({ project, marketplace: { Id, Name }});
      }
    }
    return marketplaces;
  }

  const getEnvVariable = (project: VercelProject, key: string) : string | void => { 
    return project?.env?.find(env => env.key === key && env.value)?.value;
  }


  const onAuthenticate = async (auth: PortalAuthentication) => {
    setOCToken(auth);
    var orgs = await Organizations.List({ pageSize: 100 }, { accessToken: auth.access_token });
    setOcMarketplaces(orgs.Items);
    setView('PROJECT_SELECT');
  }

  const onSelectProjects = async (newConnections: ConnectedProject[]) => {
      console.log("result of selection", newConnections);
      var newMarketplace;
      if (newConnections.some(m => m.marketplace.Id === NEW_PROJECT_CODE)) {
        const numExistingSandboxMarketplaces = ocMarketplaces.filter(x => x.Environment === SANDBOX_ENV_CODE).length;
        if (numExistingSandboxMarketplaces >= LIMIT_ON_SANDBOX_MARKETPLACES) {
          alert(`You cannot create a new sandbox marketplace because you are already the owner of ${LIMIT_ON_SANDBOX_MARKETPLACES} - OrderCloud's limit. Consider deleting one.`);
          return;
        }
        newMarketplace = await seedNewMarketplace();
      }
      console.log("newMarketplace", newMarketplace);

      try {
        for (var connection of newConnections) {
          var oldMrktID = getEnvVariable(connection.project, ENV_VARIABLES.MRKT_ID);

          if (connection.marketplace.Id === NEW_PROJECT_CODE) {
            // Connect to the new marketplace
            await CreateOrUpdateEnvVariables(connection.project, newMarketplace, configuration)
          } else if (oldMrktID !== connection.marketplace.Id) {
            // Connect to a different, existing marketplace
            Configuration.Set({ baseApiUrl: ORDERCLOUD_URLS[connection.marketplace.Environment] });
            var apiClients = await GetOrCreateApiClients(connection.marketplace.Id);
            var vars: OCEnvVariables  = { 
              MarketplaceID: connection.marketplace.Id,
              MarketplaceName: connection.marketplace.Name,
              MiddlewareClientID: apiClients.middleware.ID,
              MiddlewareClientSecret: apiClients.middleware.ClientSecret,
              StoreFrontClientID: apiClients.storefront.ID
            };
            await CreateOrUpdateEnvVariables(connection.project, vars, configuration)
          } 
        }

        for (var project of connectedProjects) {
          if (!newConnections.some(s => s.project.id === project.project.id)) {
            // Project is no longer connected to any OC marketplace
            await DeleteEnvVariables(project.project, configuration);
          }
        }
      } finally {
        backToVercel();
      } 
  }

  const GetOrCreateApiClients = async (marketplaceID: string): Promise<{storefront: ApiClient, middleware: ApiClient}> => {
    var token = await PortalClients.GetToken(marketplaceID, null, { accessToken: ocToken.access_token });
    var apiClients = await ApiClients.List({ pageSize: 100}, { accessToken: token.access_token });
    var middleware = apiClients.Items.find(x => x.AppName === MIDDLEWARE_API_CLIENT_NAME);
    var storefront = apiClients.Items.find(x => x.AppName === STOREFRONT_API_CLIENT_NAME);
    if (!middleware) {
      middleware = await ApiClients.Create({ 
        Active: true,
        AppName: MIDDLEWARE_API_CLIENT_NAME,
        ClientSecret: randomstring.generate(60),
        AllowSeller: true,
        AccessTokenDuration: 600,
        RefreshTokenDuration: 43200
      }, { accessToken: token.access_token });
    }

    if (!storefront) {
      storefront = await ApiClients.Create({ 
        Active: true,
        AppName: STOREFRONT_API_CLIENT_NAME,
        AllowAnyBuyer: true,
        IsAnonBuyer: true,
        AccessTokenDuration: 600,
        RefreshTokenDuration: 43200
      }, { accessToken: token.access_token });
    }

    return { storefront, middleware}
  }

  const seedNewMarketplace = async (): Promise<OCEnvVariables> => {
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
      console.log("seed result", result);

      var middleware  = result.apiClients.find(x => x.AppName === MIDDLEWARE_API_CLIENT_NAME);
      var storefront = result.apiClients.find(x => x.AppName === STOREFRONT_API_CLIENT_NAME);
      return {
        MarketplaceID: result.marketplaceID,
        MarketplaceName: result.marketplaceName,
        StoreFrontClientID: storefront.ID,
        MiddlewareClientID: middleware.ID,
        MiddlewareClientSecret: middleware.ClientSecret
      };
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
      {view === 'PROJECT_SELECT' && vercelProjects && (
        <ProjectSelectView 
          allProjects={vercelProjects}
          allMarketplaces={ocMarketplaces} 
          savedConnections={connectedProjects} 
          currentProjectId={configuration.currentProjectId} 
          onSelectProjects={onSelectProjects} 
        />
      )}
      {view === 'SEEDING' && (
        <SeedingView logs={logs} text={seedPageText}/>
      )}
    </Layout>
  )
}
