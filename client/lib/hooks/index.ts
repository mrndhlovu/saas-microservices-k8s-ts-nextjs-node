import { AxiosPromise, AxiosResponse } from "axios"
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react"
import { IAxiosInterceptorError } from "../../api"

import { isBrowser } from "../../util"

export const useLocalStorage = <T extends string, Y>(
  key: T,
  defaultValue: Y
) => {
  const [storageValue, setStorageValue] = useState(() => {
    if (!isBrowser) return defaultValue

    const storedValue = localStorage.getItem(key)
    return storedValue === null ? defaultValue : JSON.parse(storedValue)
  })

  const handleStorage = (newValue: (newValue: any) => void | string) => {
    setStorageValue((prevState: any) => {
      const result =
        typeof newValue === "function" ? newValue(prevState) : newValue

      localStorage.setItem(key, JSON.stringify(result))

      return result
    })
  }

  useEffect(() => {
    const listener = ev => {
      const isLocalStorageEvent = ev?.storageArea === localStorage
      const keyFoundInLocalStorage = ev?.key === key

      if (isLocalStorageEvent && keyFoundInLocalStorage) {
        setStorageValue(JSON.parse(ev.newValue))
      }
    }

    window.addEventListener("storage", listener)

    return () => {
      window.removeEventListener("storage", listener)
    }
  }, [key])

  return [storageValue, handleStorage]
}

export const useFetch = () => {
  const requestHandler = useCallback(
    async <T extends AxiosPromise>(requestHandler: T) => {
      return await requestHandler
        .then((res: AxiosResponse) => {
          return [res.data]
        })
        .catch((err: IAxiosInterceptorError) => [, err.message])
    },
    []
  )

  return [requestHandler]
}

export interface IntersectionObserverOptions {
  rootMargin?: IntersectionObserver["rootMargin"]
  threshold?: number
  thresholds?: number[]
}

export const useOnScreen = (
  options: IntersectionObserverOptions
): [Dispatch<SetStateAction<HTMLDivElement>>, boolean] => {
  const [observableRef, setObservableRef] = useState<HTMLDivElement | null>(
    null
  )
  const [isVisible, setIsVisible] = useState<boolean>(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      options
    )

    if (observableRef) {
      observer.observe(observableRef)
    }

    return () => {
      if (observableRef) {
        observer.unobserve(observableRef)
      }
    }
  }, [options, observableRef])

  return [setObservableRef, isVisible]
}

export const usePrevious = <T>(value: T) => {
  const ref = useRef<T>()
  useEffect(() => {
    ref.current = value
  })
  return ref.current
}
