import { useState } from "react"
import {
  CardNumberElement,
  CardCvcElement,
  CardExpiryElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js"
import styled from "styled-components"
import Confetti from "react-dom-confetti"

import {
  Button,
  Container,
  FormControl,
  FormHelperText,
} from "@chakra-ui/react"

import {
  useAuth,
  useGlobalState,
  useStripeContext,
} from "../../../lib/hooks/context"
import { getActivePlans, getFilteredPlans, getPendingPlan } from "../../../util"
import BillingPlans, { IPlan } from "./BillingPlans"
import FormFeedback from "../../shared/lib/FormFeedback"
import BillingHistory from "./BillingHistory"
import ActiveAccount from "./ActiveAccount"
import PendingOrderSummary from "./PendingOrderSummary"

const StyledContainer = styled(Container)`
  padding: 0;

  .group {
    ${props => props.theme.mixins.flex("row", "space-between")};
    gap: 4px;
    flex-wrap: wrap;
    position: relative;
    margin-bottom: 30px;

    .card-number {
      width: 100%;
      position: relative;
    }

    .card-detail {
      ${props => props.theme.mixins.flex("row", "space-between")};
      width: 100%;
      gap: 4px;

      div {
        width: 100%;
      }
    }

    .input-feedback {
      color: ${props => props.theme.colors.error};
      position: absolute;
      bottom: -10px;
      left: 0;
      font-size: 13px;
      font-weight: 600;
    }
  }

  .alert-billing {
    justify-content: space-between;
    border-radius: 3px;

    span:first-child {
      color: ${props => props.theme.colors.border};
      font-size: 15px;
      font-weight: 600;
    }
  }

  .card-input {
    background-color: transparent;
    border: none;
    border-radius: 3px;
    box-shadow: inset 0 0 0 2px #dfe1e6;
    box-sizing: border-box;
    color: #172b4d;
    font-size: 16px;
    height: 48px;
    line-height: 20px;
    margin-bottom: 12px;
    position: relative;
    transition-property: background-color, border-color, box-shadow;
    transition-duration: 85ms;
    transition-timing-function: ease;
    width: 100%;
    padding: 15px;
  }

  h3 {
    color: #172b4d;
    font-size: 16px;
    font-weight: 600;
    letter-spacing: -0.006em;
    line-height: 20px;
    margin-top: 24px;
    margin: 30px 0 20px;
    display: flex;
  }
`

const Checkout = () => {
  const { createSubscription, products } = useStripeContext()
  const { user } = useAuth()
  const { notify } = useGlobalState()
  const stripe = useStripe()
  const elements = useElements()

  const [billingMethod, setBillingMethod] = useState<string>("month")
  const [changePlan, setChangePlan] = useState<boolean>(false)
  const [checkedPlan, setCheckedPlan] = useState<string>("gold")
  const [formFeedBack, setFormFormFeedBack] = useState<string | undefined>()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [completed, setCompleted] = useState<boolean>(false)

  const filteredPlans = getFilteredPlans(products as IPlan[])
  const [annualPlan, monthlyPlan] = getActivePlans(filteredPlans, checkedPlan)
  const isFreeAccount = user?.account?.plan === "free"

  const pendingPlan = getPendingPlan(filteredPlans, {
    checkedPlan,
    billingMethod,
  })

  const switchBillingMethod = () => {
    setBillingMethod(prev => (prev === "month" ? "year" : "month"))
  }

  const handleCheck = () => {
    setCheckedPlan(prev => (prev === "gold" ? "basic" : "gold"))
  }
  const toggleBillingForm = () => setChangePlan(prev => !prev)

  const handleSubmit = async (event: any) => {
    event.preventDefault()
    setIsLoading(true)
    if (!stripe || !elements) return

    const cardElement = elements.getElement(CardNumberElement)

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      billing_details: { email: user.email },
      card: cardElement,
    })

    if (error) {
      setIsLoading(false)

      return setFormFormFeedBack(error.message)
    }

    const response = await createSubscription({
      paymentMethodId: paymentMethod.id,
      customerId: user.account.customerId,
      priceId: pendingPlan.id,
      plan: checkedPlan,
    })

    if (response) setCompleted(true)

    notify({
      title: "Transaction complete,",
      description: "You can download your invoice.",
      placement: "bottom",
      status: "success",
    })

    setIsLoading(false)

    return {}
  }

  return (
    <StyledContainer>
      <ActiveAccount toggleBillingForm={toggleBillingForm} />
      {(isFreeAccount || changePlan) && !completed && (
        <>
          <BillingPlans
            checkedPlan={checkedPlan}
            billingMethod={billingMethod}
            handleCheck={handleCheck}
            switchBillingMethod={switchBillingMethod}
            annualPlan={annualPlan}
            monthlyPlan={monthlyPlan}
          />
          <h3>Pay with credit card</h3>
          <FormControl>
            <form id="subscription-form" onSubmit={handleSubmit}>
              <div className="group">
                <div className="card-number">
                  <FormHelperText>CardNumber</FormHelperText>
                  <CardNumberElement
                    options={{ showIcon: true }}
                    className="card-input"
                  />
                </div>
                <div className="card-detail">
                  <div>
                    <FormHelperText>Expiration Date</FormHelperText>
                    <CardExpiryElement className="card-input" />
                  </div>
                  <div>
                    <FormHelperText>CVV</FormHelperText>
                    <CardCvcElement
                      options={{ placeholder: "3 digits" }}
                      className="card-input"
                    />
                  </div>
                </div>
                {formFeedBack && <FormFeedback errorMsg={formFeedBack} />}
              </div>

              <Button
                isFullWidth
                colorScheme="blue"
                id="subscription-form"
                type="submit"
                disabled={!stripe}
                isLoading={isLoading}
              >
                Upgrade me
              </Button>
            </form>
          </FormControl>

          <PendingOrderSummary plan={pendingPlan} />
        </>
      )}

      <BillingHistory userPlan={user?.account?.plan} />
      <Confetti active={completed} />
    </StyledContainer>
  )
}

export default Checkout
