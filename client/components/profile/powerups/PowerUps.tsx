import { useEffect, useState } from "react"
import { clientRequest } from "../../../api"
import Spotify from "./Spotify"

export interface IPowerUp {
  status: string
  name: string
  id: string
  createdAt: string
}

const PowerUps = () => {
  const [powerUps, setPowerUps] = useState<IPowerUp[]>([])

  useEffect(() => {
    const getData = () => {
      clientRequest
        .getPowerUps()
        .then(res => setPowerUps(res.data))
        .catch(() => {})
    }
    getData()
  }, [])

  return (
    <div className="option-container power-ups">
      <p>Power ups</p>
      <div className="options">
        <Spotify
          powerUp={powerUps.find(powerUp => powerUp.name === "spotify")}
        />
      </div>
    </div>
  )
}

export default PowerUps
