import { GetServerSidePropsContext } from "next"

import ApiRequest from "../../api"
import Board from "../../components/board/Board"
import { withAuthComponent, withAuthSsp } from "../../lib/hocs"
import { BoardContextProvider, IBoard } from "../../lib/providers"
import { ROUTES } from "../../util/constants"

interface IProps {
  data: IBoard
}

const index = ({ data }: IProps) => {
  return data ? (
    <BoardContextProvider board={data}>
      <Board />
    </BoardContextProvider>
  ) : null
}

export const getServerSideProps = withAuthSsp(
  async (ctx: GetServerSidePropsContext) => {
    const ssrRequest = new ApiRequest(ctx.req?.headers)

    return await ssrRequest
      .getBoardById(ctx?.params?.id as string)
      .then(res => res?.data)
      .catch(err => {
        return {
          redirect: {
            destination: ROUTES.home,
            permanent: false,
          },
        }
      })
  },
  { protected: true }
)
export default withAuthComponent(index)
