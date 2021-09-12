import { useState } from "react"
import { IPasswordConfirmation } from "../../../api"
import { useAuth } from "../../../lib/hooks/context"
import PasswordConfirmation from "../../auth/PasswordConfirmation"

const initialState = {
  password: "",
}

const MfaStep1 = ({ nextStep }) => {
  const { verifyUserPassword } = useAuth()

  const handleVerifyUser = async (formData: IPasswordConfirmation) => {
    const response = await verifyUserPassword(formData)
    if (!response) return

    nextStep(1)
  }

  return (
    <div>
      <p>Start by entering your password so that we know it’s you.</p>
      <PasswordConfirmation handleClick={handleVerifyUser} buttonText="Setup" />
    </div>
  )
}

export default MfaStep1
