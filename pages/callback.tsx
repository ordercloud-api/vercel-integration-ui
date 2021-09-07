import { useEffect, useState } from 'react'
import * as React from "react";
import { useRouter } from 'next/router'
import { IntegrationConfiguration } from '../types/IntegrationConfiguration';
import ViewCoordinator from '../components/common/ViewCoordinator';

export default function CallbackPage() {
  const router = useRouter();
  const [configuration, setConfiguration] = useState<IntegrationConfiguration>(null)

  useEffect(() => {
    const fetchAccessToken = async (code, configurationId) => {
      const res = await fetch(`/api/auth-with-code?code=${code}&configurationId=${configurationId}`)
      const json: IntegrationConfiguration = await res.json()
      setConfiguration(json)
      console.log("Get Access token response", json);
    }

    if (router.isReady && !configuration) {
      const { code, configurationId } = router.query
      fetchAccessToken(code, configurationId)
    }
  }, [router])

  return (
    <ViewCoordinator 
      initialView="SPLASH_PAGE" 
      configuration={configuration}
    ></ViewCoordinator>
  )
}
