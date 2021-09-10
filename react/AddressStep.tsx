import React from 'react'
import { FormattedMessage } from 'react-intl'
import { ButtonPlain, IconEdit } from 'vtex.styleguide'
import { Router, ContainerContext, routes } from 'vtex.checkout-container'
import { AddressSummary, ShippingAddress } from 'vtex.checkout-shipping' // TODO: change repo
import { OrderForm } from 'vtex.order-manager'
import { OrderShipping } from 'vtex.order-shipping'

import Step from './Step'

const { useOrderForm } = OrderForm
const { useOrderShipping } = OrderShipping
const { useHistory, useRouteMatch } = Router
const { useCheckoutContainer } = ContainerContext

const AddressStep: React.FC = () => {
  console.log('AddressStep')
  const history = useHistory()
  const match = useRouteMatch(routes.ADDRESS)
  const { requestLogin, isAddressEditable } = useCheckoutContainer()
  const { orderForm } = useOrderForm()
  const { selectedAddress } = useOrderShipping()

  const handleAddressEdit = () => {
    if (orderForm.canEditData || selectedAddress?.isDisposable) {
      history.push(routes.ADDRESS)
    } else {
      requestLogin()
    }
  }

  return (
    <Step
      title={<FormattedMessage id="store/checkout-address-step-title" />}
      data-testid="edit-address-step"
      actionButton={
        !match &&
        isAddressEditable && (
          <ButtonPlain onClick={handleAddressEdit}>
            <IconEdit solid />
          </ButtonPlain>
        )
      }
      active={!!match}
    >
      <Router.Switch>
        <Router.Route path={routes.ADDRESS}>
          <ShippingAddress />
        </Router.Route>
        <Router.Route path="*">
          <AddressSummary />
        </Router.Route>
      </Router.Switch>
    </Step>
  )
}

export default AddressStep
