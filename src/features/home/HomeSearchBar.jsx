import { MagnifyingGlass } from '@phosphor-icons/react'
import InputBar from '../../components/ui/InputBar'

function HomeSearchBar({ placeholder = 'Search HYNT', className = '', fieldClassName = '', inputClassName = '' }) {
  return (
    <InputBar
      type="search"
      aria-label={placeholder}
      placeholder={placeholder}
      leadingIcon={MagnifyingGlass}
      className={className}
      fieldClassName={fieldClassName}
      inputClassName={inputClassName}
    />
  )
}

export default HomeSearchBar
