import s from './Spinner.module.css'
import cn from 'classnames'
import React from 'react'

type Size = 'sm' | 'md' | 'lg'

const sizeTable = {
  sm: 20,
  md: 44,
  lg: 66,
}

const Spinner: React.FC<{
  className?: string
  size?: Size
  fill?: boolean
}> = ({ className, size = 'md', fill }) => {
  return (
    <span className={cn(s.root, className)}>
      <svg
        width={`${sizeTable[size]}px`}
        height={`${sizeTable[size]}px`}
        viewBox={`0 0 20 20`}
        xmlns="http://www.w3.org/2000/svg"
        fill={fill ? '#449DA7' : 'currentColor'}
      >
        <path d="M7.229 1.173a9.25 9.25 0 1011.655 11.412 1.25 1.25 0 10-2.4-.698 6.75 6.75 0 11-8.506-8.329 1.25 1.25 0 10-.75-2.385z" />
      </svg>
    </span>
  )
}

export default React.memo(Spinner)
