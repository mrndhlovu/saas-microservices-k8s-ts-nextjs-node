import { ROUTES } from "../../util/constants"
import { withAuthSsp } from "../../lib/hocs"
import SignupPage from "../../components/auth/SignupPage"

const index = () => <SignupPage />

export const getServerSideProps = withAuthSsp(
  async (ctx, currentUser) => {
    if (currentUser?.id && !currentUser.account.isVerified) {
      return {
        redirect: {
          destination: `/${ROUTES.verify}`,
          permanent: false,
        },
      }
    }

    if (currentUser?.account?.isVerified) {
      return {
        redirect: {
          destination: ROUTES.home,
          permanent: false,
        },
      }
    }

    return null
  },
  {
    protected: false,
  }
)

export default index
