import { isEmpty } from "lodash"
import styled from "styled-components"

import {
  Badge,
  Divider,
  HStack,
  Radio,
  RadioGroup,
  Stack,
} from "@chakra-ui/react"

import { useStripeContext } from "../../../lib/hooks/context"
import { IStripeProduct } from "../../../lib/providers"
import { getPlanDiscount } from "../../../util"

export interface IPlan extends IStripeProduct {
  metadata: { plan: string; planTitle: string }
  id: string
}

interface IProps {
  switchBillingMethod: () => void
  handleCheck: () => void
  checkedPlan: string
  billingMethod: string
  monthlyPlan: IPlan
  annualPlan: IPlan
}

const Container = styled.div`
  .header-stack {
    justify-content: space-between;

    span {
      cursor: pointer;
    }
  }

  h3 {
    margin: 0;
  }
`

interface ICardProps {
  active: boolean
}

const StyledCard = styled.div<ICardProps>`
  background-color: inherit;
  color: inherit;
  cursor: pointer;
  flex: 1;
  margin: 0;
  position: relative;
  text-align: left;

  label {
    border-radius: 3px;
    cursor: pointer;
    width: 100%;
    height: 100%;
    font-weight: 700;
    padding-left: 20px;
    background: ${props => (props.active ? "#0079bf" : "#F4F5F7")};
    color: ${props => (props.active ? "#fff" : props.theme.colors.border)};
    padding-bottom: 10px;

    span.chakra-radio__label {
      width: 100%;
    }
  }

  .card-detail {
    h4 {
      font-size: 13px;
      color: ${props => (props.active ? "#fff" : props.theme.colors.border)};
    }

    .pricing {
      display: flex;
      flex-direction: column;
    }
    strong {
      font-size: 23px;
    }

    small {
      font-size: 12px;
      font-weight: 400;
    }

    .discount-badge {
      margin-left: 11px;
      font-size: 11px;
      font-weight: 200;
      text-transform: capitalize;
    }
  }
`

const BillingPlans = ({
  switchBillingMethod,
  handleCheck,
  checkedPlan,
  billingMethod,
  monthlyPlan,
  annualPlan,
}: IProps) => {
  const { products } = useStripeContext()
  if (isEmpty(products)) return null

  return (
    <Container>
      <RadioGroup
        onChange={handleCheck}
        defaultValue={checkedPlan}
        colorScheme="orange"
      >
        <HStack className="header-stack">
          <h3>Billing plan</h3>

          <Radio size="lg" colorScheme="orange" value="gold">
            Gold
          </Radio>

          <Radio size="lg" colorScheme="orange" value="basic">
            Basic
          </Radio>
        </HStack>
      </RadioGroup>
      <Divider />
      <RadioGroup onChange={switchBillingMethod} defaultValue={billingMethod}>
        <Stack spacing={5} direction="row">
          <StyledCard active={billingMethod === "year"}>
            <Radio size="lg" colorScheme="orange" value="year">
              <span className="card-detail">
                <h4>Billed Annually</h4>
                <div className="pricing">
                  <div>
                    <strong className="price">
                      € {(annualPlan.unit_amount / 100).toFixed(2)}
                    </strong>
                    <Badge
                      className="discount-badge"
                      size="md"
                      colorScheme="green"
                    >
                      {getPlanDiscount(
                        monthlyPlan.unit_amount,
                        annualPlan.unit_amount
                      )}
                    </Badge>
                  </div>
                  <small>per {billingMethod}</small>
                </div>
              </span>
            </Radio>
          </StyledCard>

          <StyledCard active={billingMethod === "month"}>
            <Radio size="lg" colorScheme="orange" value="month">
              <span className="card-detail">
                <h4>Billed monthly</h4>
                <div className="pricing">
                  <div>
                    <strong className="price">
                      € {(monthlyPlan.unit_amount / 100).toFixed(2)}
                    </strong>
                  </div>
                  <small>per {billingMethod}</small>
                </div>
              </span>
            </Radio>
          </StyledCard>
        </Stack>
      </RadioGroup>
    </Container>
  )
}

export default BillingPlans
