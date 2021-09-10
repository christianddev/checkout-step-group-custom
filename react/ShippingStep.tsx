import React from 'react'
import { FormattedMessage } from 'react-intl'
import { ButtonPlain, IconEdit } from 'vtex.styleguide'
import { Router, ContainerContext, routes } from 'vtex.checkout-container'
import ShippingForm from '../react/packages/shipping/ShippingForm' // TODO: change repo
import ShippingSummary from '../react/packages/shipping/ShippingSummary' // TODO: change repo

import Step from './Step'

const { useHistory, useRouteMatch } = Router
const { useCheckoutContainer } = ContainerContext

const ShippingStep: React.FC = () => {
  const history = useHistory()
  const match = useRouteMatch(routes.SHIPPING)
  const { isShippingEditable } = useCheckoutContainer()
  console.log('ShippingStep\nmatch:', match, '\nisShippingEditable:', isShippingEditable )

  return (
    <Step
      title={<FormattedMessage id="store/checkout-shipping-step-title" />}
      data-testid="edit-shipping-step"
      actionButton={
        !match &&
        isShippingEditable && (
          <ButtonPlain onClick={() => history.push(routes.SHIPPING)}>
            <IconEdit solid />
          </ButtonPlain>
        )
      }
      active={!!match}

    >
      <Router.Switch>
        <Router.Route path={routes.SHIPPING}>
          <ShippingForm />
        </Router.Route>
        <Router.Route path="*">
          <ShippingSummary />
        </Router.Route>
      </Router.Switch>
    </Step>
  )
}

export default ShippingStep
