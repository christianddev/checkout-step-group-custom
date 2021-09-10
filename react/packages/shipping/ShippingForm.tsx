import React, { useCallback, useEffect, useState } from 'react'
import axios from 'axios'
import {
  Query,
  QueryGetAddressFromPostalCodeArgs,
} from 'vtex.places-graphql'
import { OrderForm } from 'vtex.order-manager'
import { OrderShipping } from 'vtex.order-shipping'
import { AddressContext } from 'vtex.address-context'
import { Loading } from 'vtex.render-runtime'
import { IconSearch, Input, Button} from 'vtex.styleguide'
import { useAddressContext } from 'vtex.address-context/AddressContext'
import { useLazyQuery, useQuery } from 'react-apollo'

import GET_ADDRESS_FROM_POSTAL_CODE from '../../graphql/querys/getAddressFromPostalCode.graphql'
import { useCountry } from './useCountry'

const { useOrderForm } = OrderForm
const { useOrderShipping } = OrderShipping



const ShippingForm: React.VFC = () => {
  const {
    orderForm,
    // :
    // {
    //   canEditData,
    //   shipping: { availableAddresses },
    //   userProfileId,
    // },
  } = useOrderForm()
  // console.log('orderForm', orderForm)

  // const { selectedAddress, deliveryOptions, pickupOptions } = useOrderShipping()
  // console.log('selectedAddress: ', selectedAddress,
  // '\ndeliveryOptions: ',deliveryOptions,
  // '\npickupOptions: ',pickupOptions)

  // Input postal code
  const { setAddress } = useAddressContext()
  const [inputValue, setInputValue] = useState('')
  const [executeGetAddressFromPostalCode, { error: errorAddress, data: addressData }] = useLazyQuery<
    Query,
    QueryGetAddressFromPostalCodeArgs
  >(GET_ADDRESS_FROM_POSTAL_CODE, { fetchPolicy: 'network-only' })

  const country = useCountry()

  useEffect(() => {
    async function fetchData() {
      console.log('fetchData')
      const { data } = await axios({
        url: `/_v/orderForm/${orderForm.id}`,
        method: 'GET',
      })
      console.log('data', data)
    }

    fetchData()
  })

  useEffect(() => {
    let cancelled = false
    if (addressData?.getAddressFromPostalCode) {
      console.log('addressData?.getAddressFromPostalCode', addressData?.getAddressFromPostalCode)
      setAddress((prevAddress: any) =>
        ({
          ...prevAddress,
          ...addressData.getAddressFromPostalCode,
        })
      )

      if (cancelled) {
        return
      }
    }

    if (errorAddress) {
      console.error('error - Address: ',errorAddress?.message)
    }

    return () => {
      cancelled = true
    }
  }, [addressData, errorAddress, setAddress])

  const handleSubmit: React.EventHandler<
    React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>
  > = (event) => {
    event.preventDefault()
    executeGetAddressFromPostalCode({
      variables: {
        postalCode: inputValue,
        countryCode: country,
      },
    })
  }

  const handleInputChange: React.ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    setInputValue(event.target.value)
  }

  // const { matches, send, state } = useShippingStateMachine({
  //   availableAddresses: (availableAddresses as Address[]) ?? [],
  //   canEditData,
  //   selectedAddress: selectedAddress ?? null,
  //   userProfileId,
  //   retryAddress: null,
  // })


  // const handleAddressCreated = useCallback(
  //   (address: Address) => {
  //     handleAddressCreated
  //     console.log('handleAddressCreated')
  //     send({
  //       type: 'SUBMIT_CREATE_ADDRESS',
  //       address: {
  //         ...address,
  //         addressType: address.addressType ?? 'residential',
  //       },
  //     })
  //   },
  //   [send]
  // )


  // const handleDeliveryOptionSelect = (deliveryOptionId: string) => {
  //   send({
  //     type: 'SUBMIT_SELECT_SHIPPING_OPTION',
  //     shippingOptionId: deliveryOptionId,
  //     deliveryChannel: 'delivery',
  //   })
  // }

  // const handlePickupOptionSelect = (pickupOptionId: string) => {
  //   send({
  //     type: 'SUBMIT_SELECT_SHIPPING_OPTION',
  //     shippingOptionId: pickupOptionId,
  //     deliveryChannel: 'pickup-in-point',
  //   })
  // }
  switch (true) {
    // case matches('selectShippingOption'): {
    //   return (
    //     <>
    //       <ShippingHeader onEditAddress={() => send('EDIT_ADDRESS')} />

    //       <ShippingOptionList
    //         deliveryOptions={deliveryOptions}
    //         pickupOptions={pickupOptions}
    //         onDeliveryOptionSelected={handleDeliveryOptionSelect}
    //         onPickupOptionSelected={handlePickupOptionSelect}
    //         onDeliveryOptionDeselected={() => send('DESELECT_SHIPPING_OPTION')}
    //         onPickupOptionDeselected={() => send('DESELECT_SHIPPING_OPTION')}
    //         showOnlySelectedShippingOption={matches({
    //           selectShippingOption: 'idle',
    //         })}
    //       />

    //       <div className="mt6">
    //         <Button
    //           block
    //           size="large"
    //           onClick={() => send('GO_TO_ADDRESS_STEP')}
    //           testId="continue-shipping-button"
    //         >
    //           <span className="f5">
    //             Go To Address
    //           </span>
    //         </Button>
    //       </div>
    //     </>
    //   )
    // }
    // // eslint-disable-next-line no-fallthrough
    default: {
      return (
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
      )
    }
  }
}

const ShippingFormWithAddress: React.FC = () => {
  const { selectedAddress, countries } = useOrderShipping()

  // const addressRules = useAddressRules()
  const addressRules = {}

  if (addressRules == null) {
    return <Loading />
  }

  return (
    <AddressContext.AddressContextProvider
      address={selectedAddress!}
      countries={countries}
      rules={addressRules}
    >
      <ShippingForm />
    </AddressContext.AddressContextProvider>
  )
}

export default ShippingFormWithAddress
