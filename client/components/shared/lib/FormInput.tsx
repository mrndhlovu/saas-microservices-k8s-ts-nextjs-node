import { forwardRef, useMemo } from "react"
import { useField } from "formik"

import { FormControl, FormLabel } from "@chakra-ui/react"

import FormFeedback from "./FormFeedback"

interface IProps {
  hideError: boolean
  [key: string]: any
}

const FormInput = forwardRef<HTMLInputElement, IProps>(
  ({ hideError, ...props }: IProps, ref) => {
    const [field, meta] = useField(props?.name)

    const hasError = meta.touched && meta.error && !hideError

    return useMemo(
      () => (
        <FormControl className="mb-3 input-container">
          {props?.label && <FormLabel> {props?.label}*</FormLabel>}
          <input ref={ref} {...props} {...field} />

          {hasError && <FormFeedback errorMsg={meta?.error} />}
        </FormControl>
      ),
      [props, field]
    )
  }
)

export default FormInput
