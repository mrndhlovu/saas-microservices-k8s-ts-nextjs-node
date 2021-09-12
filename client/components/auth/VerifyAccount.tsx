import { useState } from "react"
import { useRouter } from "next/router"
import Link from "next/link"

import { AlertDescription, AlertTitle, Button } from "@chakra-ui/react"

import { ROUTES } from "../../util/constants"
import { useGlobalState } from "../../lib/hooks/context"
import EmailConfirmation from "./EmailConfirmation"
import { clientRequest } from "../../api"

const VerifyAccount = () => {
  const router = useRouter()
  const { notify } = useGlobalState()
  const [submitted, setSubmitted] = useState<boolean>(false)

  const isNew = Boolean(router.query?.isNew === "true")

  const handleClick = async (formData: { email: string }) => {
    await clientRequest
      .requestNewVerificationLink(formData)
      .then(() => notify({ description: "Verification link sent." }))
      .catch(() =>
        notify({ description: "Failed to send link to email provided." })
      )
  }

  return (
    <>
      <AlertTitle className="title" mt={4} mb={1} fontSize="lg">
        Please verify your account with link sent to your email.
      </AlertTitle>

      {!isNew && (
        <AlertDescription className="desc" maxWidth="sm">
          <strong>OR</strong>
          <div> Request a new verification link.</div>
          <EmailConfirmation
            buttonText="Request new link"
            handleClick={handleClick}
          />
        </AlertDescription>
      )}

      {submitted && (
        <Link href={`/${ROUTES.login}`}>
          <a>
            <Button variant="outline" size="sm" colorScheme="twitter">
              Go to login
            </Button>
          </a>
        </Link>
      )}
    </>
  )
}

export default VerifyAccount
