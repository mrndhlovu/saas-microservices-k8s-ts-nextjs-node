import { FormHelperText } from "@chakra-ui/react"

interface IProps {
  errorMsg: string
}

const FormFeedback = ({ errorMsg }: IProps) => {
  return (
    <FormHelperText type="invalid" className="input-feedback">
      {errorMsg}
    </FormHelperText>
  )
}

export default FormFeedback
