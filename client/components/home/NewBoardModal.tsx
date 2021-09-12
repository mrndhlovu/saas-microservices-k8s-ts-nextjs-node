import { useRef, useState } from "react"
import router from "next/router"
import styled from "styled-components"
import { FormikValues } from "formik"
import Link from "next/link"
import { FiCheck, FiX } from "react-icons/fi"
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalOverlay,
} from "@chakra-ui/react"

import { BOARD_COLOR_OPTIONS, ROUTES } from "../../util/constants"
import { CREATE_BOARD_VALIDATION } from "../../util/formhelpers"
import { clientRequest } from "../../api"
import { UIForm, UIFormInput } from "../shared"

interface IStyledModalProps {
  image?: string
  color?: string
}

const StyledModal = styled(Modal)`
  background: #212529a3;
  height: 100%;
  width: 100%;

  .modal-dialog {
    height: 100%;
    width: 100%;
  }

  .modal-content {
    border: none;
    background-color: transparent;
    border-radius: 3px;
    z-index: 10000;
  }

  .modal-footer {
    justify-content: start;
    border-top: none;

    button {
      color: #fff;
      border: none;
      background-color: #dee2e6de;
    }
  }
`

const FormWrapper = styled.div<IStyledModalProps>`
  height: 105px;
  position: relative;
  ${props => props?.theme.mixins.flex("row", "space-between")};

  .board-bg-options {
    max-width: 120px;
    display: flex;

    .board-bg-colors {
      display: flex;
      flex-wrap: wrap;
      width: 126px;
    }
  }

  ul {
    padding-left: 10px;
  }

  li {
    list-style: none;
  }

  .form-wrap {
    position: relative;
    background-color: ${props => props?.color};
    background-image: url("${props => props?.image}");
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center center;
    padding: 10px;
    border-radius: 3px;
    min-width: 295px;
    position: relative;

    input {
      border: none !important;
      box-shadow: none;
      box-sizing: border-box;
      color: #fff;
      font-size: 16px;
      font-weight: 700;
      left: -8px;
      line-height: 24px;
      margin-bottom: 4px;
      padding: 2px 8px;
      position: relative;
      margin: 0 !important;
      background-color: #ffffff26;
    }

    form {
      width: 90%;
    }

    .icon-wrapper {
      position: absolute;
      right: 0px;
      top: 1px;
    }

    &::before {
      background: rgba(0, 0, 0, 0.15);
      position: absolute;
      bottom: 0;
      content: "";
      display: block;
      left: 0;
      right: 0;
      top: 0;
      background-color: rgba(0, 0, 0, 0.4);
      border-radius: 3px;
      z-index: 0;
    }

    svg {
      position: absolute;
      color: #fff;
      right: 5px;
      top: 5px;
      z-index: 100;
    }
  }
`

const BoardBgOption = styled.div<IStyledModalProps>`
  background-color: ${props => props?.color};
  background-image: url("${props => props?.image}");
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center center;
  width: 30px;
  height: 30px;
  border-radius: 3px;
  position: relative;
  margin: 3px;

  svg {
    ${props => props.theme.styles.absoluteCenter};
    color: #fff;
  }
`
interface FormValues {
  title: string
}

const initialState: FormValues = { title: "" }

const NewBoardModal = ({ toggleModal, openModal }) => {
  const [activeBgOption, setActiveBgOption] = useState(BOARD_COLOR_OPTIONS[0])
  const [disabled, setDisabled] = useState(true)
  const [loading, setLoading] = useState(false)
  const formRef = useRef<FormikValues>()

  const handleFormValidation = (data: FormValues) => {
    setDisabled(data?.title === undefined)
  }

  const handleCreateBoard = async () => {
    setLoading(true)
    const formData = formRef.current

    await clientRequest
      .createNewBoard({
        ...formData?.values,
        prefs: { image: activeBgOption.image, color: activeBgOption.color },
      })
      .then(res => {
        formData.isSubmitting! = false

        router.push(`/${ROUTES.board}/${res?.data?.id}`)
      })
      .catch(err => {
        formData.isSubmitting! = false
      })
  }

  const handleSelectedColor = (newOption: any) => setActiveBgOption(newOption)

  return (
    <StyledModal onClose={toggleModal} isOpen={openModal}>
      <ModalOverlay />
      <ModalContent className="modal-content">
        <ModalBody>
          <FormWrapper
            image={activeBgOption.image}
            color={activeBgOption.color}
            className="board-bg-wrapper d-flex justify-content-between"
          >
            <div className="form-wrap">
              <UIForm
                id="create-board"
                validationSchema={CREATE_BOARD_VALIDATION}
                initialState={initialState}
                validate={handleFormValidation}
                ref={formRef}
              >
                <UIFormInput
                  hideError
                  focus="true"
                  placeholder="Add board title"
                  name="title"
                  required
                />
              </UIForm>
              <div className="icon-wrapper">
                <FiX size={22} cursor="pointer" onClick={toggleModal} />
              </div>
            </div>
            <div className="board-bg-options flex-grow-1">
              <ul className="board-bg-colors gap">
                {BOARD_COLOR_OPTIONS.map(option => (
                  <li key={option.key}>
                    <Link href="/">
                      <a
                        id={option.image || option.color}
                        onClick={() => handleSelectedColor(option)}
                      >
                        <BoardBgOption
                          image={option.image}
                          color={option.color}
                        >
                          {activeBgOption.key === option.key && <FiCheck />}
                        </BoardBgOption>
                      </a>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </FormWrapper>
        </ModalBody>

        <ModalFooter className="modal-footer" justifyContent="end">
          <Button
            id="create-board"
            onClick={handleCreateBoard}
            disabled={loading && disabled}
            isLoading={loading}
            size="sm"
            colorScheme="blue"
          >
            Create board
          </Button>
        </ModalFooter>
      </ModalContent>
    </StyledModal>
  )
}

export default NewBoardModal
