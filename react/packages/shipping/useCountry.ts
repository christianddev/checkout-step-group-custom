import { useRuntime } from 'vtex.render-runtime'
import { useAddressContext } from 'vtex.address-context/AddressContext'

export const useCountry = () => {
  const { culture } = useRuntime()
  const { address } = useAddressContext()

  // TODO: should also try to get country from:
  // - addresses in account
  // - IP
  return address?.country ?? culture.country
}
