import { AUTHENTICATOR_OPTIONS } from "../../../util/constants"

const MfaStep2 = ({ nextStep }) => {
  return (
    <div>
      <h5>Choose a verification app</h5>
      <p>
        Download an app from your smartphone's app store. Alternatively, visit
        this page on your Android or iOS device for download links.
      </p>
      <ul>
        {AUTHENTICATOR_OPTIONS.map(option => (
          <li key={option.key}>{option.title}</li>
        ))}
      </ul>
    </div>
  )
}

export default MfaStep2
