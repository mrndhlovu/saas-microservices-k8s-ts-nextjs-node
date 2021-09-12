import { ReactElement } from "react"

import { Button } from "@chakra-ui/react"

interface IProps {
  buttonText: string
  className?: string
  formId?: string
  loading: boolean
  onClick: (data: any) => void
  rest?: { [key: string]: string }
  variant?: string
  disabled?: boolean
}

const AuthFormButton = ({
  buttonText,
  formId,
  onClick,
  className,
  variant,
  loading = false,
  disabled,
}: IProps): ReactElement => (
  <Button
    className={`auth-form-button ${className || ""}`}
    form={formId}
    onClick={onClick}
    colorScheme={variant}
    isLoading={loading}
    disabled={disabled}
  >
    {buttonText}
  </Button>
)

export default AuthFormButton
