import { useEffect } from "react"
import { Progress } from "@chakra-ui/progress"

import { useSpotify } from "../../../lib/providers"
import { getPercentage, calculateMinutes } from "../../../util"

const ProgressTracker = ({ progress, setProgress }) => {
  const { currentTrack, isPlaying, canPlay } = useSpotify()

  const playbackDuration = calculateMinutes(currentTrack?.item?.duration_ms)
  const progressBarValue = +getPercentage(
    progress,
    currentTrack?.item?.duration_ms
  ).toFixed(2)

  const progressValue = calculateMinutes(progress)

  useEffect(() => {
    if (!canPlay) return

    setProgress(currentTrack?.progress_ms)
  }, [canPlay, currentTrack?.progress_ms])

  useEffect(() => {
    if (!isPlaying) return

    setTimeout(() => {
      setProgress(progress + 1000)
    }, 1000)
  }, [progress, isPlaying])

  return (
    <div className="progress-tracker">
      <div className="progress-time current">
        {progressValue.split("").map((value, index) => (
          <span key={index}>{value}</span>
        ))}
      </div>
      <Progress
        borderRadius="md"
        value={progressBarValue}
        size="xs"
        colorScheme="gray"
        isAnimated
      />
      <div className="progress-time">
        {playbackDuration.split("").map((value, index) => (
          <span key={index}>{value}</span>
        ))}
      </div>
    </div>
  )
}

export default ProgressTracker
