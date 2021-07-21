import s from './LoadingDots.module.css'
import cn from 'classnames'

const LoadingDots: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <span className={cn(s.root, className)}>
      <span className={s.dot} key={`dot_1`} />
      <span className={s.dot} key={`dot_2`} />
      <span className={s.dot} key={`dot_3`} />
    </span>
  )
}

export default LoadingDots
