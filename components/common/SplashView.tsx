import React, { FC } from 'react'
import { Button, Card, Text } from '../vercel-ui'
import IntegrationHero from './IntegrationHero'
import { View } from './ViewCoordinator'

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
