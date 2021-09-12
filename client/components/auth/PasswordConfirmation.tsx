import { Button } from "@chakra-ui/react"
import { useRef, useState } from "react"

import { PASSWORD_VALIDATION } from "../../util/formhelpers"
import { UIForm, UIFormInput } from "../shared"

const initialState = {
  password: "",
}

const PasswordConfirmation = ({ handleClick, buttonText }) => {
  const formRef = useRef<any>()

  const handleOnClick = () => {
    handleClick(formRef.current.values)
  }

  return (
    <div>
      <UIForm
        validationSchema={PASSWORD_VALIDATION}
        initialState={initialState}
        id="password"
        ref={formRef}
      >
        <div className="auth-form-wrapper">
          <UIFormInput
            required
            label="Your account password"
            name="password"
            type="password"
          />

          <Button size="sm" onClick={handleOnClick} colorScheme="red">
            {buttonText}
          </Button>
        </div>
      </UIForm>
    </div>
  )
}

export default PasswordConfirmation
