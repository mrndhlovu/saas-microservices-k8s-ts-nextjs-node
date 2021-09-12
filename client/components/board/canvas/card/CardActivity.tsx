import { Button } from "@chakra-ui/button"
import { GrUnorderedList } from "react-icons/gr"

import CardModule from "./CardModule"

const CardActivity = () => {
  return (
    <div className="card-activity module">
      <CardModule
        title="Activity"
        className="activity"
        icon={<GrUnorderedList size={24} />}
        option={
          <Button size="sm" colorScheme="gray">
            Show details
          </Button>
        }
      />
    </div>
  )
}

export default CardActivity
