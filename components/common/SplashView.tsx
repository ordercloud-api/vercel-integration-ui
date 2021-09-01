import React, { FC } from 'react'
import { Button, Card, Text } from '../vercel-ui'
import { View } from '../../pages/callback'
import IntegrationHero from './IntegrationHero'

const SplashView: FC<{
  setView: React.Dispatch<React.SetStateAction<View>>
  loading?: boolean
}> = ({ setView, loading }) => {
  return (
    <div>
      <style>{`
        a{
          color:blue;
          :hover {
            text-decoration: underline;
          }
        }
      `}</style>
      <IntegrationHero className="pt-28 pb-12" />
      <div style={{ marginBottom: "1.75rem"}}>
        <p style={{ color: 'red', textAlign: "center", paddingBottom: "1rem" }}>To connect OrderCloud to your NextJS storefront, make sure you've completed steps 1 and 2!</p>
        <h4><b>Step 1</b> - Create a fork of the github project <a href="https://github.com/vercel/commerce" target="_blank">Vercel Commerce</a>, a NextJS storefront.</h4>
        <h4><b>Step 2</b> - Create a <a href="https://vercel.com/new" target="_blank">new vercel project</a>, choosing your fork as the git source.</h4>
      </div>
      <div className="grid grid-cols-2 gap-8 text-center">
        <Card>
          <Text variant="sectionHeading">New to OrderCloud?</Text>
          <Text className="px-1">
            Try OrderCloud for <strong>free</strong>, and get started with a powerful commerce engine. 
          </Text>
          <Button className="mt-5" onClick={() => setView('REGISTER')}>
            Create an Account
          </Button>
        </Card>
        <Card>
          <Text variant="sectionHeading">Already using OrderCloud?</Text>
          <Text className="px-1">
            Sign in now and we'll set up everything your storefront needs.
          </Text>
          <Button
            variant="primary"
            className="mt-5"
            onClick={() => (loading ? {} : setView('LOGIN'))}
            disabled={loading}
          >
            Login to an Existing Account
          </Button>
        </Card>
      </div>
    </div>
  )
}

export default SplashView
