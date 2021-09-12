import {
  useState,
  useEffect,
  ChangeEvent,
  MouseEvent,
  KeyboardEvent,
  Fragment,
} from "react"
import styled from "styled-components"
import { Divider, Input, usePrevious } from "@chakra-ui/react"
import { useInfiniteQuery, useQueryClient } from "react-query"

import { clientRequest } from "../../../api"
import { useOnScreen } from "../../../lib/hooks"

export const ImageTile = styled.div<{ bgImage: string }>`
  background-image: url("${props => props.bgImage}");
  border-radius: 8px;
  height: 96px;
  margin-bottom: 8px;
  width: 100%;
  background-color: #dfe1e6;
  background-size: cover;
  position: relative;
  cursor: pointer;

  span {
    position: absolute;
    bottom: 3px;
    left: 10px;
    color: #fff;

    &::before {
      content: "";
      position: absolute;
      bottom: 0%;
      right: 0;
      left: 0;
      height: 20px;
    }
  }
`

interface IProps {
  handleSelectedImage: (ev: MouseEvent) => void
  showSearchInput?: boolean
  perPage?: number
  infiniteScroll?: boolean
}

interface IUnSplashImage {
  [key: string]: any
  color: string
  urls: {
    full: string
    thumb: string
  }
  user: {
    first_name?: string
    last_name?: string
    profile_url: string
  }
}

interface UnSplashFetchProps {
  images: IUnSplashImage[]
  pageTotal: number
  nextPage: number | null
}

const DEFAULT_QUERY = "nature"

const UnSplashImages = ({
  handleSelectedImage,
  showSearchInput = true,
  perPage = 20,
  infiniteScroll = true,
}: IProps) => {
  const [loadMoreObservableRef, isVisible] = useOnScreen({
    rootMargin: "20px 0px 0px",
  })

  const clientQuery = useQueryClient()

  const [query, setQuery] = useState<string>(DEFAULT_QUERY)
  const fetchIMages = ({ pageParam = 1 }) =>
    clientRequest.getUnsplashImages({ query, pageParam, perPage })

  const previous = usePrevious({ isVisible, query })
  const stillVisibleAfterUpdate = isVisible === previous?.isVisible

  const { data, isFetching, fetchNextPage, hasNextPage } = useInfiniteQuery(
    "images",
    fetchIMages,
    {
      getNextPageParam: (lastPage, pages) => {
        return previous?.query !== query ? 1 : lastPage.page + 1
      },
    }
  )

  const handleSearch = (ev: KeyboardEvent<HTMLInputElement>) => {
    if (ev.key !== "Enter") return
    clientQuery.clear()
    fetchNextPage()
  }

  const handleChange = (ev: ChangeEvent<HTMLInputElement>) => {
    setQuery(ev.target.value)
  }

  useEffect(() => {
    if (
      isFetching ||
      !hasNextPage ||
      !isVisible ||
      stillVisibleAfterUpdate ||
      !infiniteScroll
    )
      return

    fetchNextPage()
  }, [
    fetchNextPage,
    hasNextPage,
    infiniteScroll,
    isFetching,
    isVisible,
    stillVisibleAfterUpdate,
  ])

  useEffect(() => {
    return () => {
      clientQuery.clear()
    }
  }, [])

  return (
    <>
      {showSearchInput ? (
        <>
          <div>
            <Input
              size="md"
              placeholder="Search photo"
              onChange={handleChange}
              onKeyDown={handleSearch}
            />
          </div>
          <Divider className="divider" />
        </>
      ) : (
        <h4>Unsplash</h4>
      )}
      <div className="tiles-wrapper images">
        <div className="tile-content">
          {data?.pages.map((page: UnSplashFetchProps, i) => (
            <Fragment key={i}>
              {page?.images?.map((option: IUnSplashImage, index: number) => (
                <ImageTile
                  onClick={handleSelectedImage}
                  id={`${option?.urls.full}|${option?.color}|${option.urls.thumb}`}
                  key={index}
                  bgImage={option?.urls?.thumb}
                  ref={
                    page?.images?.length === index + 1
                      ? loadMoreObservableRef
                      : undefined
                  }
                  className={
                    page?.images?.length === index + 1
                      ? "tile-img observable"
                      : "tile-img"
                  }
                >
                  <span>{option?.user?.first_name}</span>
                </ImageTile>
              ))}
            </Fragment>
          ))}
        </div>
        <Divider className="divider" />
      </div>
    </>
  )
}

export default UnSplashImages
