import React from 'react'
import { OrderForm } from 'vtex.order-manager'

const ProfileSummary: React.FC = () => {
  const { orderForm: {clientProfileData} } = OrderForm.useOrderForm()
  const fullName = `${clientProfileData?.firstName} ${clientProfileData?.lastName}`

  return (
    <div className="flex flex-column c-muted-1">
      <div className="mb4 lh-title flex items-center">
        {fullName && <span>{fullName}</span>}{' '}
      </div>
      <span className="db lh-title">{clientProfileData?.email}</span>
    </div>
  )
}

export default ProfileSummary
