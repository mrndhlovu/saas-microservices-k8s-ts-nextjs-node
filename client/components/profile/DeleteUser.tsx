import { useState } from "react"
import router from "next/router"

import { Button } from "@chakra-ui/react"

import { clientRequest, IPasswordConfirmation } from "../../api"
import { ROUTES } from "../../util/constants"
import { useAuth } from "../../lib/hooks/context"
import PasswordConfirmation from "../auth/PasswordConfirmation"

const DeleteUser = () => {
  const { verifyUserPassword } = useAuth()

  const [showPasswordConfirmation, setShowPasswordConfirmation] =
    useState<boolean>(false)

  const handleDelete = async (formData: IPasswordConfirmation) => {
    const response = await verifyUserPassword(formData)

    if (!response) return

    clientRequest
      .deleteUser()
      .then(() => router.push(`/${ROUTES.login}`))
      .catch(err => {})
  }

  const handleOnClick = () => setShowPasswordConfirmation(prev => !prev)

  return (
    <div className="option-container delete-account">
      <p>Delete Account</p>
      <p>You will not be able to recover your account.</p>
      {showPasswordConfirmation ? (
        <PasswordConfirmation
          handleClick={handleDelete}
          buttonText="Yes delete my account"
        />
      ) : (
        <div>
          <Button size="sm" onClick={handleOnClick}>
            Delete
          </Button>
        </div>
      )}
    </div>
  )
}

export default DeleteUser
