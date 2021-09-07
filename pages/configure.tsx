import { useRouter } from 'next/router'
import * as React from "react";
import ViewCoordinator from '../components/common/ViewCoordinator';
import { IntegrationConfiguration } from '../types/IntegrationConfiguration';

// The URL of this page should be added as Configuration URL in your integration settings on Vercel
export default function Configure() {
  const router = useRouter();
  const [configuration, setConfiguration] = React.useState<IntegrationConfiguration>(null)

  React.useEffect(() => {
    const fetchAccessToken = async (configurationId) => {
      const res = await fetch(`/api/get-configuration?configurationId=${configurationId}`)
      const json: IntegrationConfiguration = await res.json()
      setConfiguration(json)
      console.log("Get Access token response", json);
    }

    if (router.isReady && !configuration) {
      const { configurationId } = router.query
      fetchAccessToken(configurationId)
    }
  }, [router])

  return (
    <ViewCoordinator 
      initialView="LOGIN" 
      configuration={configuration}
    ></ViewCoordinator>
  )
}