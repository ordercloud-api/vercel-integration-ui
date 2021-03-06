import { useEffect, useState } from 'react'
import * as React from "react";
import { useRouter } from 'next/router'
import { VercelConfiguration } from '../types/VercelConfiguration';
import ViewCoordinator from '../components/common/ViewCoordinator';

export default function CallbackPage() {
  const router = useRouter();
  const [configuration, setConfiguration] = useState<VercelConfiguration>(null)

  useEffect(() => {
    const fetchAccessToken = async (code, configurationId, currentProjectId) => {
      const res = await fetch(`/api/auth-with-code?code=${code}&configurationId=${configurationId}`)
      const json: VercelConfiguration = await res.json()
      json.currentProjectId = currentProjectId;
      setConfiguration(json)
      console.log("Get Access token response", json);
    }

    if (router.isReady && !configuration) {
      const { code, configurationId, currentProjectId } = router.query
      fetchAccessToken(code, configurationId, currentProjectId)
    }
  }, [router])

  return (
    <ViewCoordinator 
      initialView="SPLASH_PAGE" 
      configuration={configuration}
    ></ViewCoordinator>
  )
}
