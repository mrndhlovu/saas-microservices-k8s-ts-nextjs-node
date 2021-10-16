import { BadRequestError } from "@tusksui/shared"
import algoliasearch from "algoliasearch"

export interface IAlgoliaAddObject {
  objectID: number | string
  type:
    | "board"
    | "list"
    | "card"
    | "workspace"
    | "task"
    | "attachment"
    | "task"
    | "checklist"
  userId: string

  board?: {
    title: string
    description?: string
    categories?: string[]
    cover?: string
    bgColor?: string
  }

  card?: {
    title: string
    description?: string
    cover?: string
    bgColor?: string
    boardId?: string
  }

  list?: {
    title: string
  }
  workspace?: {
    title: string
    category?: string
    description?: string
  }

  attachment?: {
    title: string
    resourceType: string
    boardId: string
    imageUrl?: string
  }

  checklist?: {
    title: string
    cardId: string
  }
  task?: {
    title: string
    checklistId: string
  }
}

interface IAlgoliaUpdateObject {
  objectID: number | string
  [key: string]: any
}

class SearchService {
  private algoliaSearch = algoliasearch(
    process.env.ALGOLIA_APPLICATION_ID!,
    process.env.ALGOLIA_ADMIN_API_KEY_ID!
  )

  private index = this.algoliaSearch.initIndex("dev_tusks")

  search(queries: string) {
    return this.index.search(queries)
  }

  addObjects(objects: IAlgoliaAddObject[]) {
    return this.index
      .saveObjects(objects)
      .then(({ objectIDs }) => objectIDs)
      .catch(err => {
        throw new BadRequestError(err)
      })
  }

  updateObject(object: IAlgoliaUpdateObject) {
    console.log(object)

    return this.index
      .partialUpdateObject(object)
      .then(({ objectID }) => objectID)
      .catch(err => {
        throw new BadRequestError(err)
      })
  }

  removeObjects(objectIds: string[]) {
    const response = objectIds.map(
      async id =>
        await this.index
          .deleteObject(id)
          .then(res => res)
          .catch(err => {
            throw new BadRequestError(err)
          })
    )

    return response
  }
}

const algoliaClient = new SearchService()

export { algoliaClient }
