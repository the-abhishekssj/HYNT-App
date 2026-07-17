import React from 'react'
import { CircleNotch } from '@phosphor-icons/react'

const Button = React.forwardRef(({
  children,
  variant = 'primary', // 'primary' | 'outline' | 'ghost' | 'inverted'
  size = 'default',    // 'default' | 'small'
  leadingIcon: LeadingIcon = null,
  trailingIcon: TrailingIcon = null,
  icon: Icon = null,   // convenience prop for icon-only button
  isLoading = false,
  fullWidth = false,
  className = '',
  disabled = false,
  type = 'button',
  as: Component = 'button',
  href,
  ...props
}, ref) => {
  // Determine if it is an icon-only button (no text children, but has an icon prop)
  const isIconOnly = !children && (Icon || LeadingIcon || TrailingIcon)

  const baseStyles = 'ui-button-base inline-flex items-center justify-center transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-offset-2'
  
  const sizeStyles = {
    default: isIconOnly
      ? 'ui-button-icon-default p-0'
      : 'ui-button-size-default typo-body-strong',
    small: isIconOnly
      ? 'ui-button-icon-small p-0'
      : 'ui-button-size-small typo-label',
  }

  const variantStyles = {
    primary: 'bg-black text-white hover:bg-neutral-800 active:scale-[0.98] focus-visible:ring-black',
    outline: 'bg-transparent border-[1.5px] border-[#dfdfdf] text-black hover:border-black hover:bg-neutral-50 active:scale-[0.98] focus-visible:ring-neutral-200',
    ghost: 'bg-transparent text-black hover:bg-neutral-100 active:scale-[0.98] focus-visible:ring-neutral-200',
    inverted: 'border-[1.5px] border-white bg-white text-black hover:bg-neutral-100 active:scale-[0.98] focus-visible:ring-white',
  }

  const disabledStyles = 'opacity-50 cursor-not-allowed active:scale-100 hover:bg-inherit hover:border-inherit hover:text-inherit'

  const widthStyles = (fullWidth && !isIconOnly) ? 'w-full flex' : 'w-fit'

  const iconSize = size === 'small' ? 16 : 20

  const isDisabledOrLoading = disabled || isLoading

  // Helper to render icons (supports both Phosphor component references or pre-rendered JSX elements)
  const renderIconContent = (iconProp) => {
    if (!iconProp) return null
    if (React.isValidElement(iconProp)) {
      return React.cloneElement(iconProp, {
        size: iconProp.props.size || iconSize,
        weight: iconProp.props.weight || 'regular',
        className: `shrink-0 ${iconProp.props.className || ''}`
      })
    }
    const IconComponent = iconProp
    return <IconComponent size={iconSize} weight="regular" className="shrink-0" />
  }

  const Element = href ? 'a' : Component

  return (
    <Element
      ref={ref}
      href={href}
      type={Element === 'button' ? type : undefined}
      disabled={Element === 'button' ? isDisabledOrLoading : undefined}
      className={`
        ${baseStyles}
        ${sizeStyles[size]}
        ${variantStyles[variant]}
        ${isDisabledOrLoading ? disabledStyles : ''}
        ${widthStyles}
        ${className}
      `}
      {...props}
    >
      {isLoading ? (
        <CircleNotch size={iconSize} className="animate-spin shrink-0" />
      ) : isIconOnly ? (
        renderIconContent(Icon || LeadingIcon || TrailingIcon)
      ) : (
        <>
          {renderIconContent(LeadingIcon)}
          <span>{children}</span>
          {renderIconContent(TrailingIcon)}
        </>
      )}
    </Element>
  )
})

Button.displayName = 'Button'

export default Button
