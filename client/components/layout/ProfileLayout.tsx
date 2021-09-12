import { useEffect } from "react"
import { TabList, Container, Tab, Tabs } from "@chakra-ui/react"
import Link from "next/link"
import { useRouter } from "next/router"
import styled from "styled-components"

import { PROFILE_TAB_OPTIONS } from "../../util/constants"
import { useAuth } from "../../lib/hooks/context"
import UserAvatar from "../shared/lib/UserAvatar"

const StyledContainer = styled(Container)`
  max-width: 76ch;

  .profile-content-wrapper {
    border-top: 0.1px solid #bbbbc266;
    width: 100%;
  }
`

const LayoutHeader = styled(Container)`
  max-width: 100%;
  background-color: #f4f5f7;
  height: 190px;
  padding: 32px;
  position: relative;

  p {
    ${props => props.theme.styles.absoluteCenter};
    ${props => props.theme.mixins.flex()};
    gap: 15px;
    flex-wrap: wrap;

    span {
      font-size: 12px;
      font-weight: 700;
    }
  }
`

const StyledTabList = styled(TabList)`
  ${props => props.theme.mixins.flex()};
  background-color: transparent;
  transform: translateY(-40px);

  a {
    font-size: 13px;
    font-weight: 700;
    white-space: nowrap;
    background-color: #ddd;
    color: ${props => props.theme.colors.border};
    min-height: 40px;
    border-radius: 2px;
  }

  & > li a[aria-selected="true"] {
    background-color: #fff;
    color: ${props => props.theme.colors.border} !important;
  }

  li {
    list-style: none;
    padding: 0 2px;
  }
`

const ProfileLayout = ({ children }) => {
  const { user } = useAuth()

  const router = useRouter()

  const activeTab = PROFILE_TAB_OPTIONS.find(
    option => option.key === router?.query?.path
  )

  useEffect(() => {
    if (activeTab) return
    router.push("/")
  }, [])

  return (
    <>
      <LayoutHeader>
        <p>
          <UserAvatar />
          {user?.fullName || user?.email}
          <span>@{user?.username}</span>
        </p>
      </LayoutHeader>

      <StyledContainer>
        <Tabs
          className="profile-content"
          index={activeTab?.id}
          isFitted
          variant="enclosed"
          size="sm"
        >
          <StyledTabList as="ul">
            {PROFILE_TAB_OPTIONS.map(option => (
              <li key={option.key}>
                <Link href={`/${user?.username}/${option?.key}`}>
                  <Tab as="a">{option.title}</Tab>
                </Link>
              </li>
            ))}
          </StyledTabList>
          {children}
        </Tabs>
      </StyledContainer>
    </>
  )
}

export default ProfileLayout
