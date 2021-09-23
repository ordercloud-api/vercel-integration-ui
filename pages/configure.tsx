import { useRouter } from 'next/router'
import * as React from "react";
import ViewCoordinator from '../components/common/ViewCoordinator';
import { VercelConfiguration } from '../types/VercelConfiguration';

// The URL of this page should be added as Configuration URL in your integration settings on Vercel
export default function Configure() {
  const router = useRouter();
  const [configuration, setConfiguration] = React.useState<VercelConfiguration>(null)

  React.useEffect(() => {
    const fetchAccessToken = async (configurationId, currentProjectId) => {
      const res = await fetch(`/api/get-configuration?configurationId=${configurationId}`)
      const json: VercelConfiguration = await res.json()
      json.currentProjectId = currentProjectId;
      setConfiguration(json)
      console.log("Get Access token response", json);
    }

    if (router.isReady && !configuration) {
      const { configurationId, currentProjectId } = router.query
      fetchAccessToken(configurationId, currentProjectId)
    }
  }, [router])

  return (
    <ViewCoordinator 
      initialView="LOGIN" 
      configuration={configuration}
    ></ViewCoordinator>
  )
}