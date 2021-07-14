import { Request, Response } from "express"
import List from "../models/List"

class ListController {
  getLists = async (req: Request, res: Response) => {
    const { boardId } = req.params

    const lists = await List.find({ boardId })

    res.status(200).send(lists)
  }

  getListById = async (req: Request, res: Response) => {
    const { userId, listId } = req.query

    const listIem = await List.findById({ _id: listId, owner: userId })

    if (!listIem) throw new Error("List with that id was not found")

    res.status(200).send(listIem)
  }

  createList = async (req: Request, res: Response) => {
    const { boardId, title } = req.body
    // Check duplicate board

    const list = new List({ title, boardId })

    await list.save()

    res.status(201).send(list)
  }

  deleteList = async (req: Request, res: Response) => {
    const { boardId, listId } = req.params
    const { deleteAll = "false" } = req.query

    const list = await List.findById({ _id: listId, owner: req.user._id })

    if (!list) throw new Error("List with that id was not found")

    const shouldDeleteAll = deleteAll === "true"

    if (!list && !shouldDeleteAll) throw new Error("A list id is required")

    await list.delete()

    res.status(200).send(list)
  }

  updateList = async (req: Request, res: Response) => {
    const { listId, key, newValue } = req.body

    if (!listId) throw new Error("List id required.")

    switch (key) {
      case "title":
        await List.updateOne({ _id: listId }, { $set: { [key]: newValue } })
        break

      case "cards":
        await List.updateOne({ _id: listId }, { $push: { [key]: newValue } })
        break
      default:
        throw new Error("Field is not editable.")
    }

    const list = await List.findById({ _id: listId })

    res.status(200).send(list)
  }
}

export default new ListController()
