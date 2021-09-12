import Link from "next/link"

import { ImTrello } from "react-icons/im"

import { ROUTES, APP_NAME } from "../../../util/constants"

const Logo = () => {
  return (
    <div className="header-logo-content">
      <Link href={ROUTES.home}>
        <a className="header-logo-text">
          <div className="logo">
            <div>
              <ImTrello />
            </div>
            <span>{APP_NAME}</span>
          </div>
        </a>
      </Link>
    </div>
  )
}

export default Logo
