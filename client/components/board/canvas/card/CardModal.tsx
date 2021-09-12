import { Modal, ModalOverlay, ModalBody } from "@chakra-ui/react"
import { useCardContext } from "../../../../lib/providers"
import AddToCardOptions from "./AddToCardOptions"
import CardActivity from "./CardActivity"
import CardDescription from "./CardDescription"

import CardHeader from "./CardHeader"
import CardLabelModule from "./CardLabelModule"
import ModalCardActions from "./ModalCardActions"

import ModalStyles from "./ModalStyles"

interface IProps {
  isOpen: boolean
}

const CardModal = ({ isOpen }: IProps) => {
  const { closeCardModal } = useCardContext()
  return (
    <Modal
      scrollBehavior="outside"
      size="xl"
      isOpen={isOpen}
      onClose={closeCardModal}
    >
      <ModalOverlay zIndex="-moz-initial" />
      <ModalStyles>
        <CardHeader />
        <ModalBody className="card-modal-detail">
          <div className="card-content-column">
            <CardLabelModule />
            <CardDescription />
            <CardActivity />
          </div>
          <div className="card-sidebar">
            <AddToCardOptions />
            <ModalCardActions />
          </div>
        </ModalBody>
      </ModalStyles>
    </Modal>
  )
}

export default CardModal
