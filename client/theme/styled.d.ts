import "styled-components"

declare module "styled-components" {
  export interface DefaultTheme {
    colors: {
      amazon: string
      bgBody: string
      bgDark: string
      error: string
      bgLight: string
      body: string
      border: string
      borderLight: string
      heading: string
      lightBgBody: string
      lightBoxShadowBorder: string
      darkBoxShadowBorder: string
      lightBgDark: string
      lightBorder: string
      lightHeading: string
      primary: string
      secondary: string
      spotify: string
      trello: string
      twitter: string
      whatsapp: string
    }
    fonts: {
      primary: string
      secondary: string
    }
    styles: {
      darkMode: FlattenInterpolation<ThemeProps<DefaultTheme>>
      reset: FlattenInterpolation<ThemeProps<DefaultTheme>>
      typography: FlattenInterpolation<ThemeProps<DefaultTheme>>
      utilities: FlattenInterpolation<ThemeProps<DefaultTheme>>
      absoluteCenter: FlattenInterpolation<ThemeProps<DefaultTheme>>
      cardBoxShadow: FlattenInterpolation<ThemeProps<DefaultTheme>>
    }
    keyframes: {
      fadeInDown: Interpolation<ThemeProps<DefaultTheme>>
      fadeInLeft: Interpolation<ThemeProps<DefaultTheme>>
      fadeInRight: Interpolation<ThemeProps<DefaultTheme>>
      fadeInUp: Interpolation<ThemeProps<DefaultTheme>>
      slideInStar: Interpolation<ThemeProps<DefaultTheme>>
      fadeIn: Interpolation<ThemeProps<DefaultTheme>>
    }
    device: {
      desktop: string
      desktopXs: string
      laptop: string
      mobileLg: string
      mobileSm: string
      mobileXs: string
      notebook: string
      tablet: string
    }
    variables: {
      body: string
      transition: string
    }
    mixins: {
      clearFix: () => Interpolation<ThemeProps<DefaultTheme>>
      flex: (
        direction?: string,
        justify?: string,
        align?: string
      ) => Interpolation<ThemeProps<DefaultTheme>>
      flexGap: (gap: string) => Interpolation<ThemeProps<DefaultTheme>>
      gradientBg: (
        value: string,
        deg: number
      ) => Interpolation<ThemeProps<DefaultTheme>>
      gradientColor: (
        value: string,
        deg: number
      ) => Interpolation<ThemeProps<DefaultTheme>>
      grid: (
        placement?: string,
        align?: string
      ) => Interpolation<ThemeProps<DefaultTheme>>
      lineClamp: (
        numberOfLines: number
      ) => Interpolation<ThemeProps<DefaultTheme>>
      placeholderColor: (
        placeholderColor: string
      ) => Interpolation<ThemeProps<DefaultTheme>>
      textHoverEffect: (
        color?: string
      ) => Interpolation<ThemeProps<DefaultTheme>>
      transitionEffect: (
        property?: string
      ) => Interpolation<ThemeProps<DefaultTheme>>
    }
  }
}
