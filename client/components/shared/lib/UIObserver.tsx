import React, {
  useRef,
  useEffect,
  cloneElement,
  Children,
  ReactElement,
} from "react"
import styled from "styled-components"

import { IntersectionObserverOptions, useOnScreen } from "../../../lib/hooks"

const RootContainer = styled.div<{ minHeight: string }>`
  min-height: ${props => props.minHeight};
`

interface IProps {
  children: ReactElement
  options: IntersectionObserverOptions
  watchChange: boolean
  minHeight: string
}

const UIObserver = ({ children, options, watchChange, minHeight }: IProps) => {
  const hasBeenVisibleRef = useRef<boolean>(false)

  const [ref, elementVisible] = useOnScreen(options)

  const rootRef = ref as any

  const isVisible = watchChange
    ? elementVisible
    : elementVisible || hasBeenVisibleRef.current

  useEffect(() => {
    if (hasBeenVisibleRef.current) return undefined

    hasBeenVisibleRef.current =
      elementVisible !== null && elementVisible !== undefined
  }, [elementVisible])

  useEffect(() => {
    if (hasBeenVisibleRef.current) return undefined

    hasBeenVisibleRef.current =
      elementVisible !== null && elementVisible !== undefined
  }, [elementVisible])

  return (
    <div className="observer-root" ref={rootRef}>
      {Array.isArray(children)
        ? Children.map(children, child => {
            return cloneElement(child, { isVisible }, null)
          })
        : cloneElement(children, { isVisible })}
    </div>
  )
}

export { UIObserver }
