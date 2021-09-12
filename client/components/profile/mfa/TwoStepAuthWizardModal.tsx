import { useState } from "react"

import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react"

import { MFA_TAB_OPTIONS } from "../../../util/constants"
import MfaStep1 from "./MfaStep1"
import MfaStep2 from "./MfaStep2"
import MfaStep3 from "./MfaStep3"
import MfaStep4 from "./MfaStep4"

const TwoStepAuthWizardModal = ({ isOpen, onClose }) => {
  const [activeIndex, setActiveIndex] = useState<number>(0)
  const [recoveryData, setRecoveryData] = useState<string | null>()

  const nextStep = () => setActiveIndex(prev => prev + 1)
  const prevStep = () => setActiveIndex(prev => prev - 1)

  const handleTabChange = (index: number) => setActiveIndex(index)

  return (
    <Modal
      size="full"
      closeOnOverlayClick={false}
      isOpen={isOpen}
      onClose={onClose}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Two step authentication guide</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <Tabs variant="line" index={activeIndex} onChange={handleTabChange}>
            <TabList>
              {MFA_TAB_OPTIONS.map((option, index) => (
                <Tab isDisabled={index !== activeIndex} key={option.id}>
                  {option.title}
                </Tab>
              ))}
            </TabList>
            <TabPanels>
              <TabPanel>
                <MfaStep1 nextStep={nextStep} />
              </TabPanel>
              <TabPanel>
                <MfaStep2 nextStep={nextStep} />
              </TabPanel>
              <TabPanel>
                <MfaStep3
                  nextStep={nextStep}
                  setRecoveryData={setRecoveryData}
                />
              </TabPanel>
              <TabPanel>
                <MfaStep4 recoveryData={recoveryData} />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </ModalBody>

        <ModalFooter>
          <Button onClick={prevStep} mr={3}>
            Back
          </Button>
          <Button colorScheme="blue" onClick={nextStep}>
            Next
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default TwoStepAuthWizardModal
