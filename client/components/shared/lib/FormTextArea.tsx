import { FieldHookConfig, useField } from "formik"

import { FormControl, FormLabel, Textarea } from "@chakra-ui/react"

import FormFeedback from "./FormFeedback"

interface IProps {
  [key: string]: any
}

const FormTextArea = (props: IProps) => {
  const [field, meta] = useField(props as string | FieldHookConfig<any>)
  const hasError = meta?.touched && meta?.error !== undefined

  return (
    <FormControl>
      <FormLabel htmlFor={`contact-form-${field?.name}`}>
        <span> {props?.label}</span>
        {props?.required && <span>*</span>}
      </FormLabel>
      <Textarea
        data-testid={props?.dataTestId}
        required={props?.required}
        id={`form-${field?.name}`}
        {...field}
      />

      {hasError && <FormFeedback errorMsg={meta?.error || props?.message} />}
    </FormControl>
  )
}

export default FormTextArea
