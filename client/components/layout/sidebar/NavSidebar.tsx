import Link from "next/link"
import { useState } from "react"

import {
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
} from "@chakra-ui/react"
import { BsChevronDown, BsChevronUp } from "react-icons/bs"

import { DiTrello } from "react-icons/di"
import { FiTrello, FiActivity } from "react-icons/fi"
import { CgViewList } from "react-icons/cg"
import { HiOutlineUsers } from "react-icons/hi"
import { RiSettings5Line } from "react-icons/ri"
import { AiOutlineRight } from "react-icons/ai"

import { useGlobalState } from "../../../lib/hooks/context"
import {
  HOME_SIDEBAR_PRIMARY,
  HOME_SIDEBAR_WORKSPACE_MENU,
} from "../../../util/constants"
import SideBarStyles from "./SideBarStyles"

const NavSidebar = () => {
  const { darkMode } = useGlobalState()
  const [active, setActive] = useState("boards")
  const [activeKey, setActiveKey] = useState("0")

  const handleClick = () => {
    setActiveKey(prev => (prev === "open" ? "" : "open"))
  }

  const Icon = ({ icon }) => {
    switch (icon) {
      case "boards":
      case "workspace-boards":
        return <DiTrello />
      case "templates":
        return <FiTrello />
      case "workspace-table":
        return <CgViewList />
      case "workspace-members":
        return <HiOutlineUsers />

      case "workspace-account":
        return <RiSettings5Line />
      default:
        return <FiActivity />
    }
  }

  return (
    <SideBarStyles>
      <nav className={`sb ${darkMode ? "sb-dark" : ""}`}>
        <div className="sb-primary">
          <ul>
            {HOME_SIDEBAR_PRIMARY.map(option => (
              <li
                className={`sb-link-item  ${
                  active === option.key ? "active" : ""
                }`}
                key={option.key}
              >
                <Link href={option?.link}>
                  <a>
                    <span className="sb-link-item-icon">
                      <Icon icon={option.key} />
                    </span>
                    <span>{option.title}</span>
                  </a>
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="sb-secondary">
          <Accordion allowToggle>
            <AccordionItem>
              <AccordionButton
                onClick={handleClick}
                className="toggle"
                variant="link"
              >
                <div className="toggle-content d-flex justify-content-between">
                  <div className="d-flex">
                    <div className="toggle-button-icon">
                      <span>T</span>
                    </div>
                    <div>Workspaces</div>
                  </div>
                  {activeKey === "open" ? <BsChevronDown /> : <BsChevronUp />}
                </div>
              </AccordionButton>
              <AccordionPanel>
                <ul>
                  {HOME_SIDEBAR_WORKSPACE_MENU.map(option => (
                    <li
                      className={`sb-link-item  ${
                        active === option.link ? "active" : ""
                      }`}
                      key={option.key}
                    >
                      <Link href={option?.link}>
                        <a>
                          <div className="toggle-content d-flex justify-content-between">
                            <div className="button-text">
                              <span className="sb-link-item-icon">
                                <Icon icon={option.key} />
                              </span>
                              <span>{option.title}</span>
                            </div>
                            <div className="redirect-icon">
                              <AiOutlineRight />
                            </div>
                          </div>
                        </a>
                      </Link>
                    </li>
                  ))}
                </ul>
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
        </div>
      </nav>
    </SideBarStyles>
  )
}

export default NavSidebar
