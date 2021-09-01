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
        <footer className="pt-6 pb-10 sticky">
          <ul className="flex flex-row font-medium text-accent-4 text-sm space-x-5 items-center justify-center">
            <li>
              <a
                className="hover:text-accent-6"
                href="https://vercel.com/legal/privacy-policy"
                target="_blank"
                rel="noreferrer"
              >
                Privacy Policy
              </a>
            </li>
            <li>
              <a
                className="hover:text-accent-6"
                href="https://vercel.com/legal/terms"
                target="_blank"
                rel="noreferrer"
              >
                Terms of Service
              </a>
            </li>
            <li>Copyright © 2021 Vercel Inc. All rights reserved.</li>
          </ul>
        </footer>
      </div>
    </>
  )
}

export default Layout