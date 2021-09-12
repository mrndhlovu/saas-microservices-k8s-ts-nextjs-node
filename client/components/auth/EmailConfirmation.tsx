import { Button } from "@chakra-ui/react"
import { useRef } from "react"

import { EMAIL_ONLY_VALIDATION } from "../../util/formhelpers"
import { UIForm, UIFormInput } from "../shared"

const initialState = {
  email: "",
}

const EmailConfirmation = ({ handleClick, buttonText }) => {
  const formRef = useRef<any>()

  const handleOnClick = () => {
    handleClick(formRef.current.values)
  }

  return (
    <div>
      <UIForm
        validationSchema={EMAIL_ONLY_VALIDATION}
        initialState={initialState}
        id="email"
        ref={formRef}
      >
        <div className="auth-form-wrapper">
          <UIFormInput
            required
            label="Your account email"
            name="email"
            type="email"
            placeholder="email@mail.com"
          />

          <Button
            variant="outline"
            size="sm"
            onClick={handleOnClick}
            colorScheme="blue"
          >
            {buttonText}
          </Button>
        </div>
      </UIForm>
    </div>
  )
}

export default EmailConfirmation
