import { GetServerSidePropsContext } from "next"

import { withAuthSsp } from "../../lib/hocs"
import VerificationPage from "../../components/auth/VerificationPage"
import ApiRequest from "../../api"

const index = () => {
  return <VerificationPage />
}

export const getServerSideProps = withAuthSsp(
  async (context: GetServerSidePropsContext) => {
    const ssrRequest = new ApiRequest(context?.req?.headers)

    const token = context.query.token as string

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
