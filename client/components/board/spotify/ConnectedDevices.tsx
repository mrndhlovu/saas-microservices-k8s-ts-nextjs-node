import { Select } from "@chakra-ui/select"
import { ChangeEvent, useEffect, useState } from "react"
import { GiSpeaker } from "react-icons/gi"

import { clientRequest } from "../../../api"
import { useSpotify } from "../../../lib/providers"

export interface ISpotifyDevice {
  id: string
  is_active: boolean
  is_private_session: boolean
  is_restricted: boolean
  name: string
  type: string
  volume_percent: number
}

const ConnectedDevices = () => {
  const { setActiveDevice, activeDevice } = useSpotify()
  const [devices, setDevices] = useState<ISpotifyDevice[]>([])

  const handleSelectedDevice = (ev: ChangeEvent<HTMLSelectElement>) => {
    const selected = devices.find(device => device.id === ev.target.value)
    if (!selected) return
    setActiveDevice(selected)
    clientRequest
      .selectPlayer({ deviceId: selected.id, play: true })
      .catch(err => {})
  }

  useEffect(() => {
    const getData = () => {
      clientRequest
        .getSpotifyDevices()
        .then(res => {
          const data: ISpotifyDevice[] = res.data.devices

          const currentlyPlayingDevice = data.find(device => device.is_active)

          if (currentlyPlayingDevice) {
            setActiveDevice(currentlyPlayingDevice)
          }
          setDevices(data)
        })
        .catch(err => {})
    }
    getData()
  }, [])

  return (
    <Select
      onChange={handleSelectedDevice}
      size="xs"
      placeholder="Connected devices."
      defaultValue={activeDevice?.id || ""}
    >
      {devices?.map(device => (
        <option
          selected={activeDevice?.id === device.id}
          key={device.id}
          value={device.id}
        >
          {device.name}
          {activeDevice?.id === device.id && <GiSpeaker />}
        </option>
      ))}
    </Select>
  )
}

export default ConnectedDevices
