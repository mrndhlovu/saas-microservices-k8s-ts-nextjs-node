import { useRef } from "react"

import { FORM_VALIDATION } from "../../util/formhelpers"
import { ROUTES } from "../../util/constants"
import { UIFormInput } from "../shared"
import { useAuth } from "../../lib/hooks/context"
import AuthFormWrapper from "./AuthFormWrapper"

const validationInitialState = {
  code: "",
}

const VerificationPage = () => {
  const { verifyLogin } = useAuth()

  const formRef = useRef<any>()

  const handleSubmit = (ev: MouseEvent) => {
    ev.preventDefault()

    verifyLogin(formRef.current?.values)
  }

  return (
    <AuthFormWrapper
      buttonText="Submit"
      footerRedirectText="Go to login"
      formId="verification-form"
      handleSubmit={handleSubmit}
      heading="Login verification"
      initialState={validationInitialState}
      redirect={ROUTES.login}
      ref={formRef}
      validationSchema={FORM_VALIDATION.VERIFY_LOGIN}
      redirectTo={ROUTES.home}
    >
      <div className="mb-3">
        <UIFormInput
          required
          placeholder="Enter the six digit pin sent to your email here."
          name="code"
        />
      </div>
    </AuthFormWrapper>
  )
}

export default VerificationPage
