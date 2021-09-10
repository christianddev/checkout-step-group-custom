import React, {
  useState,
  useCallback,
  useRef,
} from 'react'
import { OrderForm } from 'vtex.order-manager'
import { Input, Checkbox, Button, ButtonPlain, IconEdit } from 'vtex.styleguide'
import { useRuntime } from 'vtex.render-runtime'
import { Router } from 'vtex.checkout-container'
import { useMutation } from 'react-apollo'
import { ClientPreferencesDataInput, UserProfileInput } from 'vtex.checkout-graphql'

import updateOrderFormProfileMutation from './MutationUpdateOrderFormProfile'
import updateClientPreferencesDataMutation from './MutationUpdateClientPreferencesData'

const ProfileForm: React.FC = () => {
  const [setProfileData] =  useMutation(updateOrderFormProfileMutation)
  const [setClientPreferenceData] =  useMutation(updateClientPreferencesDataMutation)
  const { orderForm } = OrderForm.useOrderForm()
  const { navigate } = useRuntime()
  const history = Router.useHistory()

  const [firstName, setFirstName] = useState(orderForm.clientProfileData?.firstName ?? '')
  const [lastName, setLastName] = useState(orderForm.clientProfileData?.lastName ?? '')
  const [phone, setPhone] = useState(orderForm.clientProfileData?.phone ?? '')
  const [document, setDocument] = useState(orderForm.clientProfileData?.document ?? '')
  const [documentType, setDocumentType] = useState(orderForm.clientProfileData?.documentType ?? '')
  const [optInNewsletter, setOptInNewsletter] = useState(orderForm.clientPreferencesData?.optInNewsletter ?? false)

  const emailRef = useRef(orderForm.clientProfileData?.email)

  const handleFirstNameChange: React.ChangeEventHandler<HTMLInputElement> = evt => {
    setFirstName(evt.target.value)
  }

  const handleLastNameChange: React.ChangeEventHandler<HTMLInputElement> = evt => {
    setLastName(evt.target.value)
  }

  const handlePhoneChange: React.ChangeEventHandler<HTMLInputElement> = evt => {
    setPhone(evt.target.value)
  }

  const handleOptionNewsletterChange: React.ChangeEventHandler<HTMLInputElement> = evt => {
    setOptInNewsletter(evt.target.checked)
  }

  const handleDocumentChange: React.ChangeEventHandler<HTMLInputElement> = evt => {
    setDocument(evt.target.value)
  }

  const handleDocumentTypeChange: React.ChangeEventHandler<HTMLInputElement> = evt => {
    setDocumentType(evt.target.value)
  }

  const handleEditEmail = useCallback(() => {
  }, [navigate])

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async evt => {
    evt.preventDefault()

    const profile: UserProfileInput  = {
      firstName,
      lastName,
      phone,
      document,
      documentType,
      email: emailRef.current
    }
    const clientPreferences: ClientPreferencesDataInput  = {
      optInNewsletter
    }

    try {
      const [
        { data: profileDataUpdated },
        { data: clientPreferenceDataUpdated },
      ] = await Promise.all([
        setProfileData( { variables: { profile } }),
        setClientPreferenceData( { variables: { clientPreferences } })
      ])

      console.log('clientPreferenceDataUpdated', clientPreferenceDataUpdated)
      if (profileDataUpdated?.updateOrderFormProfile && clientPreferenceDataUpdated?.updateClientPreferencesData) {
        history.push('/shipping')
      }

    } catch (err) {
      console.error('error, handleSubmit: ', err)
    }
  }

  return (
    <>
      <div>
        <span className="t-body fw6 flex items-center">
          {'Email '}
          <div className="dib ml4">
            <ButtonPlain onClick={handleEditEmail}>
              <IconEdit solid />
            </ButtonPlain>
          </div>
        </span>
        <span className="dib mt3">{emailRef.current}</span>
      </div>
      <form className="mt6" onSubmit={handleSubmit}>
        <div className="flex flex-column flex-row-ns">
          <div
            className="w-100"
            data-testid="profile-first-name-wrapper">
            <Input
              label="firstName"
              name="firstName"
              value={firstName}
              onChange={handleFirstNameChange}
            />
          </div>
          <div
            className="w-100 mt6 mt0-ns ml0 ml5-ns"
            data-testid="profile-last-name-wrapper"
          >
            <Input
              label="lastName"
              name="lastName"
              value={lastName}
              onChange={handleLastNameChange}
            />
          </div>
        </div>
        <div className="flex flex-column flex-row-ns">
          <div
            className="w-100"
            data-testid="profile-document-wrapper">
            <Input
              label="document"
              name="document"
              value={document}
              onChange={handleDocumentChange}
            />
          </div>
          <div
            className="w-100 mt6 mt0-ns ml0 ml5-ns"
            data-testid="profile-document-type-wrapper">
            <Input
              label="documentType"
              name="documentType"
              value={documentType}
              onChange={handleDocumentTypeChange}
            />
          </div>
        </div>
        <div className="flex flex-column flex-row-ns">
          <div
            className="w-100"
            data-testid="profile-phone-wrapper"
          >
             <Input
              label="Phone"
              name="Phone"
              value={phone}
              onChange={handlePhoneChange}
            />
          </div>
        </div>
        <div className="mv7">
          <div className="mt6">
            <Checkbox
              id="optin-newsletter"
              label="Newsletter"
              checked={optInNewsletter}
              onChange={handleOptionNewsletterChange}
            />
          </div>
        </div>
        <div data-testid="profile-continue-wrapper">
          <Button
            size="large"
            type="submit"
            block
          >
            <span className="f5">Continue</span>
          </Button>
        </div>
      </form>
    </>
  )
}

export default ProfileForm
