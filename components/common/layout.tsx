import Head from 'next/head'
import React, { FC } from 'react'
import { config, dom } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false;

interface Props {
  children: React.ReactNode | any
}

const Layout: FC<Props> = ({ children }) => {
  return (
    <>
      <Head>
        <title>OrderCloud Integration - Vercel.com</title>
        <link rel="icon" href="/favicon.ico" />
        <style>{dom.css()}</style>
      </Head>
      <div className="relative flex flex-col px-12 py-2 min-h-screen h-screen w-full max-w-3xl mx-auto">
        <div className="flex-1">{children}</div>
      </div>
    </>
  )
}

export default Layout