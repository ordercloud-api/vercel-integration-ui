import cn from 'classnames'
import React, {
  forwardRef,
  ButtonHTMLAttributes,
  JSXElementConstructor,
  useRef,
  AnchorHTMLAttributes,
} from 'react'
import mergeRefs from 'react-merge-refs'
import Spinner from '../Spinner'
import s from './Button.module.css'

type EnhancedButton = ButtonHTMLAttributes<HTMLButtonElement> &
  AnchorHTMLAttributes<HTMLAnchorElement>
export interface ButtonProps extends EnhancedButton {
  href?: string
  active?: boolean
  loading?: boolean
  disabled?: boolean
  className?: string
  width?: string | number
  type?: 'submit' | 'reset' | 'button'
  Component?: string | JSXElementConstructor<any>
  variant?: 'primary' | 'plain' | 'basic' | 'destructive' | 'blue'
}

const Button: React.FC<ButtonProps> = forwardRef((props, buttonRef) => {
  const {
    className,
    children,
    active,
    width,
    style = {},
    loading = false,
    disabled = false,
    variant = 'basic',
    Component = 'button',
    ...rest
  } = props
  const ref = useRef<typeof Component>(null)

  const rootClassName = cn(
    s.root,
    {
      [s.blue]: variant === 'blue',
      [s.plain]: variant === 'plain',
      [s.primary]: variant === 'primary',
      [s.destructive]: variant === 'destructive',
      [s.loading]: loading,
      [s.disabled]: disabled,
    },
    className
  )

  return (
    <Component
      aria-pressed={active}
      data-variant={variant}
      ref={mergeRefs([ref, buttonRef])}
      className={rootClassName}
      disabled={disabled}
      style={{
        width,
        ...style,
      }}
      {...rest}
    >
      {loading ? <Spinner size="sm" /> : children}
    </Component>
  )
})

export default Button
