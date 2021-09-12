import { useRef } from "react"

import { FORM_VALIDATION } from "../../util/formhelpers"
import { ROUTES } from "../../util/constants"
import { UIFormInput } from "../shared"
import { useAuth } from "../../lib/hooks/context"
import AuthFormWrapper from "./AuthFormWrapper"

const initialState = {
  username: "",
  email: "",
  password: "",
}

const SignupPage = () => {
  const { signup } = useAuth()
  const formRef = useRef<any>()

  const handleSubmit = async (ev: MouseEvent) => {
    ev.preventDefault()
    signup(formRef.current.values)
  }

  return (
    <AuthFormWrapper
      buttonText="Submit"
      footerRedirectText="Already have an account?"
      formId="signup-form"
      handleSubmit={handleSubmit}
      heading="Signup for an account"
      initialState={initialState}
      redirect={ROUTES.login}
      redirectTo={ROUTES.login}
      ref={formRef}
      validationSchema={FORM_VALIDATION.REGISTER}
    >
      <div className="mb-3">
        <UIFormInput required placeholder="Username" name="username" />
        <UIFormInput required placeholder="Email" name="email" />
        <UIFormInput
          type="password"
          required
          placeholder="Password"
          name="password"
        />
      </div>
    </AuthFormWrapper>
  )
}

export default SignupPage
