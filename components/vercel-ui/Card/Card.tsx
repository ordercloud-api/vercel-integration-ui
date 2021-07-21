import cn from 'classnames'
import s from './Card.module.css'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  className?: string
}

export default function Card({
  children,
  className = '',
  ...props
}: CardProps) {
  return (
    <div className={cn(s.root, className)} {...props}>
      {children}
    </div>
  )
}
