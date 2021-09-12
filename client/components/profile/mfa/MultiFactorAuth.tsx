import { useState } from "react"
import { Badge, Button } from "@chakra-ui/react"

import TwoStepAuthWizardModal from "./TwoStepAuthWizardModal"
import { useAuth } from "../../../lib/hooks/context"

const MultiFactorAuth = () => {
  const [open, setOpen] = useState<boolean>(false)
  const { user } = useAuth()

  const toggleModal = () => setOpen((prev: boolean) => !prev)

  return (
    <div className="option-container">
      <p>
        Two-step verification{" "}
        {!user?.multiFactorAuth ? (
          <Badge>Off</Badge>
        ) : (
          <Badge colorScheme="green">Enabled</Badge>
        )}
      </p>
      {!user?.multiFactorAuth ? (
        <Button size="sm" onClick={toggleModal}>
          Set up two-step verification
        </Button>
      ) : (
        <>
          <p>
            You’ve kept your account extra secure with a second login step
            since:
          </p>
          {/* <p>{user?.twoStepRecovery?.setupDate}</p> */}
        </>
      )}

      {open && <TwoStepAuthWizardModal isOpen={open} onClose={toggleModal} />}
    </div>
  )
}

export default MultiFactorAuth
