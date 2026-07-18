import { MagnifyingGlass } from '@phosphor-icons/react'
import InputBar from '../../components/ui/InputBar'

function HomeSearchBar({ placeholder = 'Search HYNT', className = '' }) {
  return (
    <InputBar
      type="search"
      aria-label={placeholder}
      placeholder={placeholder}
      leadingIcon={MagnifyingGlass}
      className={className}
    />
  )
}

export default HomeSearchBar
