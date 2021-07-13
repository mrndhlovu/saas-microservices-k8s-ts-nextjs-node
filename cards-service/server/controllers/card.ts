import { Request, Response } from "express"

import Card from "../models/Card"

class CardController {
  getCards = async (req: Request, res: Response) => {
    const _id = req.params.listId

    let cards = await Card.find({ listId: _id })

    res.send(cards)
  }

  getCardById = async (req: Request, res: Response) => {
    const { cardId, listId } = req.params

    const card = await Card.findOne({ _id: cardId, listId })
    if (!card) throw new Error("Card with that id was not found")

    res.send(card)
  }

  createCard = async (req: Request, res: Response) => {
    const _id = req.params.listId
    const { title } = req.body

    const card = new Card({ title, listId: _id })
    if (!card) throw new Error("Card with that id was not found")

    await card.save()

    res.status(201).send(card)
  }

  deleteCard = async (req: Request, res: Response) => {
    const { listId, cardId, listIds } = req.params
    const { all = "false" } = req.query

    const shouldDeleteAll = all === "true" && !cardId

    if (shouldDeleteAll && listId) {
      const ids = listIds.split("|")
      await Card.deleteMany(ids)
    } else {
      const card = await Card.findById(cardId)
      if (!card) throw new Error("Card with that id was not found")

      await card.delete()
    }

    res.status(200).send({ success: true })
  }

  updateCard = async (req: Request, res: Response) => {
    const { cardId } = req.params
    const { key, newValue } = req.body

    if (!cardId) throw new Error("Card id required.")

    switch (key) {
      case "description":
      case "shortDesc":
      case "title":
        await Card.updateOne({ _id: cardId }, { $set: { [key]: newValue } })
        break

      default:
        throw new Error("Field is not editable.")
    }

    const card = await Card.findById({ _id: cardId })

    res.status(200).send(card)
  }
}

export default new CardController()
