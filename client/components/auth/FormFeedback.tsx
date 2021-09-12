interface IProps {
  feedback: string[]
}

const FormFeedback = ({ feedback }: IProps) => {
  const isString = typeof feedback === "string"

  return (
    <div className="auth-form-feedback">
      <ul>
        {isString ? (
          <li>{feedback}</li>
        ) : (
          feedback?.map((message, index) => {
            return <li key={index}>{message}</li>
          })
        )}
      </ul>
    </div>
  )
}

export default FormFeedback
