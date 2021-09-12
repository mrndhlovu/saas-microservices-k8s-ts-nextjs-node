interface IWorkspaceLink {
  key: string
  title: string
  link: string
}

export const ROUTES = {
  billing: "billing",
  board: "board",
  home: "/",
  login: "auth/login",
  mfa: "auth/mfa",
  settings: "settings",
  signup: "auth/signup",
  verify: "auth/verify",
}

export const APP_NAME = "Trello Clone"

export const HOME_SIDEBAR_PRIMARY = [
  { key: "boards", title: "Boards", link: "/" },
  { key: "templates", title: "Templates", link: "/templates" },
  { key: "home", title: "Home", link: "/" },
]

export const HOME_SIDEBAR_WORKSPACE_MENU: IWorkspaceLink[] = [
  {
    key: "workspace-boards",
    title: "Boards",
    link: "/userworkspace-boards",
  },
  {
    key: "workspace-table",
    title: "Workspace table",
    link: "/userworkspace-table",
  },
  {
    key: "workspace-members",
    title: "Members",
    link: "/userworkspace-members",
  },
  {
    key: "workspace-account",
    title: "Settings",
    link: "/userworkspace-account",
  },
]

export const BOARD_COLOR_OPTIONS = [
  {
    key: 0,
    image:
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
  },
  {
    key: 1,
    image:
      "https://images.unsplash.com/photo-1593642532871-8b12e02d091c?ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
  },
  {
    key: 2,
    image:
      "https://images.unsplash.com/photo-1627598359861-f83052a1248f?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
  },
  {
    key: 3,
    image:
      "https://images.unsplash.com/photo-1627635174707-a629d585e1e7?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1489&q=80",
  },
  { key: 4, color: "rgb(0, 121, 191)" },
  { key: 5, color: "rgb(210, 144, 52)" },
  { key: 6, color: "rgb(81, 152, 57)" },
  { key: 7, color: "rgb(176, 70, 50)" },
]

export const PROFILE_TAB_OPTIONS = [
  { key: "profile", title: "Profile and visibility", id: 0 },
  { key: "activity", title: "Activity", id: 1 },
  { key: "cards", title: "Cards", id: 2 },
  { key: "settings", title: "Settings", id: 3 },
  { key: "billing", title: "Upgrade Plans", id: 4 },
]

export const PROFILE_SETTINGS_OPTIONS = [
  { key: "two-step-auth", title: "Two-step verification" },
  { key: "power-up", title: "Power ups" },
  { key: "delete-account", title: "Delete account" },
]

export const MFA_TAB_OPTIONS = [
  { key: "verify", title: "Verify Password", id: 0 },
  { key: "install", title: "Install", id: 1 },
  { key: "connect", title: "Connect phone", id: 2 },
  { key: "setup", title: "Setup recovery", id: 3 },
]

export const AUTHENTICATOR_OPTIONS = [
  { key: "google", title: "Google Authenticator" },
  { key: "authy", title: "Authy" },
  { key: "duo", title: "Duo Mobile" },
]

export enum DRAG_TYPES {
  CARD = "CARD",
  LIST = "LIST",
  FOREIGN_CARD = "FOREIGN_CARD",
}

export const LABEL_DEFAULT_OPTIONS = [
  { color: "#61bd4f", name: "" },
  { color: "#f2d600", name: "" },
  { color: "#ff9f1a", name: "" },
  { color: "#eb5a46", name: "" },
  { color: "#c377e0", name: "" },

  { color: "#0079bf", name: "" },
  { color: "#00c2e0", name: "" },
  { color: "#51e898", name: "" },
  { color: "#ff78cb", name: "" },
  { color: "#344563", name: "" },

  { color: "#838c91", name: "" },
]

export const COLORS_IMAGE =
  "https://res.cloudinary.com/drxavrtbi/image/upload/c_fit,w_1000/v1630793219/trello-clone/robert-katzki-jbtfM0XBeRc-unsplash_cfgosx.jpg"

export const PHOTOS_IMAGE =
  "https://res.cloudinary.com/drxavrtbi/image/upload/c_scale,w_1000/v1630793751/trello-clone/pexels-pineapple-supply-co-191429_xvc8hc.jpg"

export const SPOTIFY_SCOPES =
  "user-read-email playlist-modify-private playlist-read-private user-read-playback-state"

export const SPOTIFY_LOGO =
  "https://res.cloudinary.com/drxavrtbi/image/upload/c_scale,w_40/v1631265632/trello-clone/assets/Spotify_Icon_CMYK_Green_gwzjmc.png"
