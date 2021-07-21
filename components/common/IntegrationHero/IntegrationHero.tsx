import React, { FC } from 'react'
import s from './IntegrationHero.module.css'
import cn from 'classnames'
import { LoadingDots } from '../../vercel-ui'
import Plus from '../../icons/Plus'
import VercelLogo from '../../icons/VercelLogo'
import OrderCloudLogo from '../../icons/OrderCloudLogo'

const IntegrationHero: FC<{
  className?: string
  loading?: boolean
}> = ({ className = '', loading = false }) => {
  return (
    <div className={cn(s.fixedHeader, className)}>
      <div className="flex flex-row items-center justify-center">
        <div className={s.logo}>
          <OrderCloudLogo width={35} />
        </div>
        <div className="px-4 ">{loading ? <LoadingDots /> : <Plus />}</div>
        <div className={s.logo} style={{ backgroundColor: 'black' }}>
          <VercelLogo width={25} />
        </div>
      </div>
    </div>
  )
}

export default IntegrationHero
