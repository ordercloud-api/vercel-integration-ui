import Layout from '../components/common/layout'
import { useRouter } from 'next/router'
import * as React from "react";
import { couldStartTrivia } from 'typescript';

// The URL of this page should be added as Configuration URL in your integration settings on Vercel
export default function Configure() {
  const router = useRouter()
  var cookie;

  React.useEffect(() => {
    cookie = document.cookie;
    console.log("cookie", document.cookie);
  });

  return (
    <Layout>
      <div className="space-y-2 text-center">
        <h1 className="text-lg font-medium">Example Integration</h1>
        <p className="max-w-lg">
          This page is used to show some configuration options for the configuration with the id{' '}
          {cookie}
          <code className="text-sm inline-block" style={{ color: '#F81CE5', minWidth: 245 }}>{router.query.configurationId}</code>
        </p>
      </div>
    </Layout>
  )
}