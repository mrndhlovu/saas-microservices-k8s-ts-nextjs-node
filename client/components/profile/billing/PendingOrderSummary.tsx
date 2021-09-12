import styled from "styled-components"

import { Table, Tbody, Td, Tfoot, Tr } from "@chakra-ui/react"

import { IPlan } from "./BillingPlans"

interface IProps {
  plan: IPlan
}

const Container = styled.div`
  td {
    strong,
    span {
      font-size: 14px;
    }

    strong {
      color: ${props => props.theme.colors.border};
    }
  }
`

const PendingOrderSummary = ({ plan }: IProps) => {
  return plan ? (
    <Container>
      <h3>Plan Summary</h3>

      <Table variant="simple">
        <Tbody>
          <Tr>
            <Td>
              <div>
                <span>1 {plan.metadata.planTitle}</span>
              </div>
            </Td>
            <Td isNumeric>
              <div>
                <strong>€{(plan.unit_amount / 100).toFixed(2)} EUR</strong>
              </div>
            </Td>
          </Tr>

          <Tr>
            <Td>
              <div>
                <strong>Sales Tax</strong>
              </div>
            </Td>
            <Td isNumeric>
              <div>
                <strong>€0.00 EUR</strong>
              </div>
            </Td>
          </Tr>

          <Tr>
            <Td>
              <div>
                <strong>Total</strong>
              </div>
            </Td>
            <Td isNumeric>
              <div>
                <strong>€{(plan.unit_amount / 100).toFixed(2)} EUR</strong>
              </div>
            </Td>
          </Tr>
        </Tbody>
      </Table>
    </Container>
  ) : null
}

export default PendingOrderSummary
