import { Fragment } from "react"
import { Divider } from "@chakra-ui/react"
import styled from "styled-components"

import { PROFILE_SETTINGS_OPTIONS } from "../../util/constants"
import DeleteUser from "./DeleteUser"
import MultiFactorAuth from "./mfa/MultiFactorAuth"
import PowerUps from "./powerups/PowerUps"

const Container = styled.div`
  .option-container {
    margin: 10px 0 20px;

    .connected-spotify {
      display: flex;
      flex-direction: column;
      gap: 3px;
      width: max-content;
    }

    p:first-child {
      padding-bottom: 10px;
    }
  }
`

const UserProfileSettings = () => {
  const ProfileSettingOption = ({ id }) => {
    switch (id) {
      case "two-step-auth":
        return <MultiFactorAuth />

      case "delete-account":
        return <DeleteUser />

      case "power-up":
        return <PowerUps />

      default:
        return null
    }
  }

  return (
    <Container>
      {PROFILE_SETTINGS_OPTIONS.map((option, index) => (
        <Fragment key={option.key}>
          <ProfileSettingOption id={option.key} />
          {index !== PROFILE_SETTINGS_OPTIONS.length - 1 && <Divider />}
        </Fragment>
      ))}
    </Container>
  )
}

export default UserProfileSettings
