import { useRef, useState } from "react"

import { FORM_VALIDATION } from "../../util/formhelpers"
import { ROUTES } from "../../util/constants"
import { UIFormInput } from "../shared"
import { useAuth } from "../../lib/hooks/context"
import AuthFormWrapper from "./AuthFormWrapper"

const initialState = {
  identifier: "",
  password: "",
}

const LoginPage = () => {
  const { login } = useAuth()

  const formRef = useRef<any>()

  const handleSubmit = (ev: MouseEvent) => {
    ev.preventDefault()

    const formData = {
      identifier: formRef.current?.values?.identifier,
      password: formRef.current?.values?.password,
    }

    login(formData)
  }

  return (
    <AuthFormWrapper
      buttonText="Login"
      footerRedirectText="Sign up for an account"
      formId="login-form"
      handleSubmit={handleSubmit}
      heading="Login to your account"
      initialState={initialState}
      redirect={ROUTES.signup}
      ref={formRef}
      validationSchema={FORM_VALIDATION.LOGIN}
      redirectTo={ROUTES.home}
    >
      <div className="mb-3">
        <UIFormInput
          required
          placeholder="Username or Email"
          name="identifier"
        />
        <UIFormInput
          name="password"
          required
          placeholder="Password"
          type="password"
        />
      </div>
    </AuthFormWrapper>
  )
}

export default LoginPage
