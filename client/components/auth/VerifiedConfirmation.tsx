import Link from "next/link"

import {
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Button,
} from "@chakra-ui/react"

import { ROUTES } from "../../util/constants"

const VerifiedConfirmation = () => {
  return (
    <>
      <AlertIcon boxSize="40px" mr={0} />
      <AlertTitle className="title" mt={4} mb={1} fontSize="lg">
        Account verified! Thank you.
      </AlertTitle>
      <AlertDescription className="desc" maxWidth="sm">
        <Link href={`/${ROUTES.login}`}>
          <a>
            <Button variant="outline" size="sm" colorScheme="twitter">
              Go to login
            </Button>
          </a>
        </Link>
      </AlertDescription>
    </>
  )
}

export default VerifiedConfirmation
