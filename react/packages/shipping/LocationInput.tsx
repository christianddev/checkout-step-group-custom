import React, { useState, useEffect, useCallback, useRef } from 'react'
import { useAddressContext } from 'vtex.address-context/AddressContext'
import { IconSearch, Input, Button, ButtonPlain } from 'vtex.styleguide'
import { useLazyQuery } from 'react-apollo'
import {
  Address,
  Query,
  QueryGetAddressFromPostalCodeArgs,
} from 'vtex.places-graphql'

import GET_ADDRESS_FROM_POSTAL_CODE from '../../graphql/querys/getAddressFromPostalCode.graphql'
import { useCountry } from './useCountry'

interface Props {
  // onSuccess?: (address: Address) => void | Promise<void>
}

const LocationInput: React.FC<Props> = ({
  // onSuccess,
}) => {
  const { setAddress, rules } = useAddressContext()
  const [inputValue, setInputValue] = useState('')
  // the network-only fetch policy asserts that if an incorrect postal code
  // has been submitted twice in a row, it won't return the cached error,
  // re-triggering the effect hook and avoiding an infinite loop state
  const [executeGetAddressFromPostalCode, { error, data }] = useLazyQuery<
    Query,
    QueryGetAddressFromPostalCodeArgs
  >(GET_ADDRESS_FROM_POSTAL_CODE, { fetchPolicy: 'network-only' })

  const country = useCountry()
  // const countryRules = rules[country]

  // const prevCountryRulesRef = useRef(countryRules)

  // useEffect(() => {
  //   if (prevCountryRulesRef.current === countryRules) {
  //     return
  //   }

  //   prevCountryRulesRef.current = countryRules
  // }, [countryRules])

  // useEffect(() => {
  //   let cancelled = false

  //   if (data?.getAddressFromPostalCode) {
  //     // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
  //     ;(onSuccess?.(data.getAddressFromPostalCode) || Promise.resolve())
  //       .then(() => {
  //         setAddress((prevAddress) => ({
  //           ...prevAddress,
  //           ...data.getAddressFromPostalCode,
  //         }))

  //         if (cancelled) {
  //           return
  //         }
  //       })
  //       .catch(() => {
  //         if (cancelled) {
  //           return
  //         }
  //       })
  //   }

  //   if (error) {
  //     console.error(error.message)
  //   }

  //   return () => {
  //     cancelled = true
  //   }
  // }, [data, error, onSuccess, setAddress])

  const handleSubmit: React.EventHandler<
    React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>
  > = (event) => {
    event.preventDefault()
    const res = executeGetAddressFromPostalCode({
      variables: {
        postalCode: inputValue,
        countryCode: country,
      },
    })

    console.log('res', res)
  }

  const handleInputChange: React.ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    setInputValue(event.target.value)
  }

  // if (!countryRules) {
  //   return null
  // }

  return (
    <>
      <div className="w-100">
        <form onSubmit={handleSubmit}>
          <Input
            id="postal-code-input"
            label="Postal Code"
            size="large"
            value={inputValue}
            onChange={handleInputChange}
          />
          <Button
            id="submit-postal-code-button"
            type="submit"
            onClick={handleSubmit}
          >
            <IconSearch />
          </Button>
        </form>
        {/* {countryRules.fields.postalCode?.additionalData?.forgottenURL && (
          <ButtonPlain
            href={countryRules.fields.postalCode.additionalData.forgottenURL}
            target="_blank noreferrer"
          >
            I don't know my postal code
          </ButtonPlain>
        )} */}
      </div>
    </>

  )
}

export default LocationInput
