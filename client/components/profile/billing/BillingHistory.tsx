import { useEffect } from "react"
import styled from "styled-components"
import { isEmpty } from "lodash"

import {
  Badge,
  Button,
  Divider,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react"

import { useState } from "react"
import { IStripeInvoice } from "../../../lib/providers"
import { clientRequest } from "../../../api"

const Container = styled.div`
  min-height: 150px;

  td {
    font-size: 13px;
  }
`

interface IProps {
  userPlan?: string
}

const BillingHistory = ({ userPlan }: IProps) => {
  const [invoices, setInvoices] = useState<IStripeInvoice[] | []>([])

  const hasInvoices = !isEmpty(invoices)

  useEffect(() => {
    if (!userPlan) return
    const fetchInvoices = async () => {
      await clientRequest
        .getBillingHistory()
        .then(res => setInvoices(res.data))
        .catch(() => null)
    }

    fetchInvoices()
  }, [userPlan])

  return (
    <Container>
      <h3>Billing History</h3>
      <Divider />

      {hasInvoices && (
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Start Period</Th>
              <Th>End Period</Th>
              <Th>Billed Per</Th>
              <Th isNumeric>Amount</Th>
              <Th></Th>
            </Tr>
          </Thead>
          <Tbody>
            {invoices?.map((invoice, index) => (
              <Tr key={index}>
                <Td>{invoice.periodStart}</Td>
                <Td>{invoice.periodEnd}</Td>
                <Td>{invoice?.billingMethod}</Td>
                <Td>
                  <span>€ {invoice.amountPaid}</span>
                  <Badge colorScheme="green" size="sm">
                    {invoice.plan}
                  </Badge>
                </Td>
                <Td>
                  <Button
                    href={invoice.invoicePdf}
                    as="a"
                    download
                    variant="outline"
                    size="xs"
                  >
                    Invoice
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}
    </Container>
  )
}

export default BillingHistory
