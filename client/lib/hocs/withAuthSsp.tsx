import { GetServerSidePropsContext } from "next"
import { serverRequest } from "../../api"
import { ROUTES } from "../../util/constants"
import { IUser } from "../providers"

interface IOptions {
  protected: boolean
}

export const withAuthSsp = (
  getServerSideProps?: (
    context: GetServerSidePropsContext,
    user?: IUser
  ) => Promise<any>,
  options?: IOptions
) => {
  return async (ctx: GetServerSidePropsContext) => {
    const from = ctx.req.headers.referer
    const ssRequest = serverRequest(ctx.req.headers)
    const referredFromAuthRoute = Boolean(from) && from?.indexOf("auth") !== -1

    const cookie = ctx.req.cookies?.["express:sess"]
    const api = serverRequest(ctx.req.headers)

    let currentUser: IUser | null

    const getTokenSilently = async () => {
      const response = await ssRequest
        .refreshAuthToken()
        .then(res => res)
        .catch(() => null)

      if (response?.status === 200) {
        currentUser = response.data
        return {
          redirect: {
            destination: referredFromAuthRoute ? ROUTES.home : from,
            permanent: false,
          },
        }
      }

      currentUser = null
    }

    await api
      .getCurrentUser()
      .then(res => {
        return (currentUser = res?.data || null)
      })
      .catch(err => {
        if (err.message?.includes("jwt expired") && cookie) {
          return getTokenSilently()
        }
        return (currentUser = null)
      })

    if (currentUser?.id && !currentUser?.account.isVerified) {
      return {
        redirect: {
          destination: `/${ROUTES.verify}`,
          permanent: false,
        },
      }
    }

    if (!currentUser && options?.protected) {
      return {
        redirect: {
          destination: `/${ROUTES.login}`,
          permanent: false,
        },
      }
    }

    if (getServerSideProps && getServerSideProps instanceof Function) {
      const response = await getServerSideProps(ctx, currentUser)

      if (response?.redirect) {
        return response
      }

      return { props: { currentUser, data: response } }
    }

    return { props: { currentUser } }
  }
}
