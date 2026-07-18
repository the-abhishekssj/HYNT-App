import React, { useId } from 'react'

const sizeStyles = {
  default: {
    field: 'h-12 rounded-[16px] px-4',
    input: 'typo-body',
    icon: 20,
    helper: 'typo-meta',
  },
  small: {
    field: 'h-10 rounded-[14px] px-3',
    input: 'typo-meta',
    icon: 18,
    helper: 'typo-caption',
  },
  compact: {
    field: 'h-9 rounded-[12px] px-3',
    input: 'typo-meta',
    icon: 16,
    helper: 'typo-caption',
  },
}

const stateStyles = {
  default: 'bg-[#FBFBFB] text-[#102418] ring-1 ring-inset ring-[#9E9E9E] focus-within:ring-2 focus-within:ring-[#26C485]',
  error: 'bg-[#fffafa] text-[#d14343] ring-1 ring-inset ring-[#d14343] focus-within:ring-2 focus-within:ring-[#d14343]',
  inactive: 'bg-[#f4f4f4] text-[#8a8a8a] ring-1 ring-inset ring-[#d7d7d7]',
  disabled: 'cursor-not-allowed bg-[#eeeeee] text-[#8a8a8a] ring-1 ring-inset ring-[#d7d7d7]',
}

const helperStyles = {
  default: 'text-[#6f8178]',
  error: 'text-[#d14343]',
  inactive: 'text-[#8a8a8a]',
  disabled: 'text-[#8a8a8a]',
}

function renderIcon(iconProp, iconSize, state) {
  if (!iconProp) return null
  const iconClassName = state === 'error' ? 'text-[#d14343]' : state === 'disabled' || state === 'inactive' ? 'text-[#8a8a8a]' : 'text-[#26C485]'

  if (React.isValidElement(iconProp)) {
    return React.cloneElement(iconProp, {
      size: iconProp.props.size || iconSize,
      weight: iconProp.props.weight || 'regular',
      className: `shrink-0 ${iconClassName} ${iconProp.props.className || ''}`,
    })
  }

  const IconComponent = iconProp
  return <IconComponent size={iconSize} weight="regular" className={`shrink-0 ${iconClassName}`} />
}

const InputBar = React.forwardRef(({
  label,
  helperText,
  errorText,
  leadingIcon = null,
  trailingIcon = null,
  prefix = null,
  suffix = null,
  size = 'default',
  state = 'default',
  inactive = false,
  disabled = false,
  className = '',
  fieldClassName = '',
  inputClassName = '',
  helperClassName = '',
  id,
  type = 'text',
  ...props
}, ref) => {
  const generatedId = useId()
  const inputId = id || `input-bar-${generatedId}`
  const activeSize = sizeStyles[size] || sizeStyles.default
  const resolvedState = disabled ? 'disabled' : inactive ? 'inactive' : errorText || state === 'error' ? 'error' : state
  const helperId = helperText || errorText ? `${inputId}-helper` : undefined
  const isReadOnly = inactive || props.readOnly
  const inputTextClassName = resolvedState === 'error' ? 'text-[#d14343] placeholder:text-[#d14343]/60' : 'text-[#102418] placeholder:text-[#6f8178]'

  return (
    <div className={`min-w-0 ${className}`}>
      {label ? (
        <label htmlFor={inputId} className="typo-label mb-2 block text-[#102418]">
          {label}
        </label>
      ) : null}
      <label
        htmlFor={inputId}
        className={`flex min-w-0 items-center transition-[box-shadow,background-color] duration-200 ${activeSize.field} ${stateStyles[resolvedState] || stateStyles.default} ${fieldClassName}`}
      >
        {leadingIcon ? (
          <span className="mr-1 flex shrink-0 items-center">
            {renderIcon(leadingIcon, activeSize.icon, resolvedState)}
          </span>
        ) : null}
        {prefix ? (
          <span className={`typo-meta mr-2 shrink-0 ${resolvedState === 'error' ? 'text-[#d14343]' : 'text-[#6f8178]'}`}>
            {prefix}
          </span>
        ) : null}
        <input
          ref={ref}
          id={inputId}
          type={type}
          disabled={disabled}
          readOnly={isReadOnly}
          aria-invalid={resolvedState === 'error' ? 'true' : undefined}
          aria-describedby={helperId}
          className={`min-w-0 flex-1 bg-transparent outline-none disabled:cursor-not-allowed disabled:text-[#8a8a8a] ${inputTextClassName} ${activeSize.input} ${inputClassName}`}
          {...props}
        />
        {suffix ? (
          <span className={`typo-meta ml-2 shrink-0 ${resolvedState === 'error' ? 'text-[#d14343]' : 'text-[#6f8178]'}`}>
            {suffix}
          </span>
        ) : null}
        {trailingIcon ? (
          <span className="ml-2 flex shrink-0 items-center">
            {renderIcon(trailingIcon, activeSize.icon, resolvedState)}
          </span>
        ) : null}
      </label>
      {helperText || errorText ? (
        <p id={helperId} className={`${activeSize.helper} mt-2 pl-4 ${helperStyles[resolvedState] || helperStyles.default} ${helperClassName}`}>
          {errorText || helperText}
        </p>
      ) : null}
    </div>
  )
})

InputBar.displayName = 'InputBar'

export default InputBar
