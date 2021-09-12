import { GetServerSidePropsContext } from "next"
import styled from "styled-components"

import { Alert } from "@chakra-ui/react"

import { ROUTES } from "../../util/constants"
import { withAuthSsp } from "../../lib/hocs"
import ApiRequest from "../../api"
import VerifiedConfirmation from "../../components/auth/VerifiedConfirmation"
import VerifyAccount from "../../components/auth/VerifyAccount"

interface IProps {
  data: {
    isVerified?: boolean
  }
}

const Container = styled.div`
  width: 100vw;
  height: 100vh;

  ${props => props.theme.styles.absoluteCenter};

  .verification-alert {
    ${props => props.theme.mixins.flex("column", "space-evenly")};
    width: 95%;
    margin: 0 auto;
    border-radius: 3px;
    margin-top: 20px;
    color: ${props => props.theme.colors.border};
    .title {
      font-weight: 600;
      font-size: 23px;
    }

    .desc {
      font-size: 13px;
      margin-top: 20px;
    }

    label {
      margin: 0;
      font-size: 13px;
      font-weight: 600;
    }

    input {
      background-color: #e8f4f9;
      width: 260px;
    }
  }
`

const index = ({ data }: IProps) => {
  return (
    <Container>
      <Alert
        status="info"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        textAlign="center"
        height="350px"
        className="verification-alert"
      >
        {!data?.isVerified && <VerifyAccount />}
        {data?.isVerified && <VerifiedConfirmation />}
      </Alert>
    </Container>
  )
}

export const getServerSideProps = withAuthSsp(
  async (context: GetServerSidePropsContext, currentUser) => {
    const ssrRequest = new ApiRequest(context?.req?.headers)
    if (currentUser?.account?.isVerified) {
      return {
        redirect: {
          destination: ROUTES.home,
          permanent: false,
        },
      }
    }

    const token = context?.query?.token as string

    if (!token) return null

    return await ssrRequest
      .verifyAccount(token)
      .then(res => JSON.parse(JSON.stringify(res?.data)))
      .catch(() => null)
  },
  {
    protected: false,
  }
)

export default index
