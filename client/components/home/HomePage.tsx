import SidebarLayout from "../layout/sidebar/SidebarLayout"

import BoardList from "./BoardList"
import HomeStyles from "./HomeStyles"

const HomePage = () => {
  return (
    <SidebarLayout>
      <HomeStyles>
        <BoardList />
      </HomeStyles>
    </SidebarLayout>
  )
}

export default HomePage
