import { Alert, Badge, Button } from "@chakra-ui/react"

import { useAuth } from "../../../lib/hooks/context"

const ActiveAccount = ({ toggleBillingForm }) => {
  const { user } = useAuth()
  const isFreeAccount = user?.account?.plan === "free"

  return (
    <Alert className="alert-billing" status="info">
      <div>
        <span>Active Plan:</span>{" "}
        <Badge colorScheme={isFreeAccount ? "teal" : "orange"}>
          {user?.account.plan}
        </Badge>
      </div>
      {!isFreeAccount && (
        <Button
          variant="outline"
          onClick={toggleBillingForm}
          size="sm"
          colorScheme="blue"
        >
          Change Plan
        </Button>
      )}
    </Alert>
  )
}

export default ActiveAccount
