import { forwardRef, ReactNode } from "react"
import { Formik } from "formik"

import { FormControl } from "@chakra-ui/react"

import FormInput from "./FormInput"
import FormTextArea from "./FormTextArea"

interface IProps {
  dataTestId?: string
  id: string
  initialState: { [key: string]: any }
  submitHandler?: () => void
  validate?: (data: { [key: string]: any }) => void
  validationSchema: { [key: string]: any }
  children: ReactNode
}

const UIForm = forwardRef<any, IProps>(
  (
    {
      children,
      dataTestId,
      id,
      initialState,
      submitHandler,
      validate,
      validationSchema,
    },
    ref
  ) => {
    return (
      <Formik
        initialValues={initialState}
        validationSchema={validationSchema}
        onSubmit={submitHandler}
        innerRef={ref}
        validate={validate}
      >
        <FormControl as="fieldset" id={id} data-testid={dataTestId}>
          {children}
        </FormControl>
      </Formik>
    )
  }
)

export const UIFormInput = FormInput
export const UIFormTextArea = FormTextArea

export { UIForm }
