import { useState } from "react"
import { Button } from "@chakra-ui/react"

import {
  INewMfaData,
  connectMultiFactorAuth,
  generateQrCode,
} from "../../../api"
import { UIForm, UIFormInput } from "../../shared"
import { useRef } from "react"
import { FORM_VALIDATION } from "../../../util/formhelpers"

const mfaInitialState = {
  email: false,
  sms: false,
  code: true,
}

const codeFormInitialState = {
  code: true,
}

const MfaStep3 = ({ nextStep, setRecoveryData }) => {
  const [isChecked, setIsChecked] = useState<string>("code")
  const [qrCodeImage, setQrCodeImage] = useState<string | null>()
  const [mfaMethod, setMfaMethod] = useState<string | null>()
  const codeInputRef = useRef<any>()

  const handleConnectMfa = async (ev: any) => {
    const body: INewMfaData = {
      // preference: {
      //   sms: isChecked === "sms",
      //   email: isChecked === "email",
      //   authenticator: isChecked === "code",
      // },
      code: `${codeInputRef.current.values.code}`,
    }
    await connectMultiFactorAuth(body)
      .then(res => {
        setRecoveryData(res.data.twoStepRecovery)
        nextStep()
      })
      .catch(err => {
        console.log(
          "🚀 ~ file: MultiFactorAuth.tsx ~ line 34 ~ awaitsetUpMultiFactorAuth ~ err",
          err
        )
      })
  }

  const handleScanQrCode = async (ev: any) => {
    await generateQrCode()
      .then(res => setQrCodeImage(res.data.qrCodeImage))
      .catch(err => {
        console.log(
          "🚀 ~ file: MultiFactorAuth.tsx ~ line 34 ~ awaitsetUpMultiFactorAuth ~ err",
          err
        )
      })
  }

  const handleChange = (ev: any) => {
    setIsChecked(ev.target.id)
  }

  return (
    <div>
      <p>Receive a verification code via:</p>
      <div className="auth-form-wrapper">
        <div>
          <input
            type="checkbox"
            id="email"
            name="email"
            onChange={handleChange}
            checked={isChecked === "email"}
          />
          <label htmlFor="email">Email</label>
        </div>
        <div>
          <input
            type="checkbox"
            id="sms"
            name="sms"
            onChange={handleChange}
            checked={isChecked === "sms"}
          />
          <label htmlFor="sms">SMS</label>
        </div>

        <div>
          <input
            type="checkbox"
            id="qrcode"
            name="qrcode"
            onChange={handleChange}
            checked={isChecked === "qrcode"}
          />
          <label htmlFor="qrcode">Scan QR Code</label>
          {qrCodeImage && (
            <>
              <div>
                <p>1. Scan this QR code with your verification app</p>
                <img src={qrCodeImage} alt="qr code" />
              </div>
              <div>
                <p>2. Enter the 6-digit code here</p>
                <p>
                  Enter the code from the app below. Once connected, we'll
                  remember your phone so you can use it each time you log in.
                </p>

                <UIForm
                  validationSchema={FORM_VALIDATION.VERIFY_LOGIN}
                  initialState={codeFormInitialState}
                  id="code"
                  ref={codeInputRef}
                >
                  <div>
                    <UIFormInput
                      required
                      label="6-digit code"
                      name="code"
                      type="number"
                    />

                    <Button
                      size="md"
                      onClick={handleConnectMfa}
                      colorScheme="blue"
                    >
                      Connect phone
                    </Button>
                  </div>
                </UIForm>
              </div>
            </>
          )}

          {isChecked === "qrcode" && !qrCodeImage && (
            <p>
              <Button
                size="md"
                onClick={handleScanQrCode}
                colorScheme="facebook"
              >
                Read to scan code
              </Button>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default MfaStep3
