import { useCallback, useEffect, useRef, useState } from 'react'

export function useTimer() {
  const [finishedAt, setFinishedAt] = useState(0)
  const [secondsToEnd, setSecondsToEnd] = useState(0)
  const [isActiveTimer, setIsActiveTimer] = useState(false)
  const callbackAfterFinish = useRef<() => void>()
  const timer = useRef<ReturnType<typeof setTimeout>>()

  const timerTick = useCallback(() => {
    const left = Math.ceil((finishedAt - Date.now()) / 1000)
    if (left <= 0) {
      setSecondsToEnd(0)
      callbackAfterFinish.current?.()

      return
    }
    setSecondsToEnd(left)
    timer.current = setTimeout(timerTick, 1000)
  }, [finishedAt])

  // mustFinishAt - время окончания таймера в миллисекундах
  const startTimer = useCallback((mustFinishAt: number, callback?: () => void) => {
    clearTimeout(timer.current)
    if (callback) {
      callbackAfterFinish.current = callback
    }
    setFinishedAt(mustFinishAt)
    setIsActiveTimer(true)
  }, [])

  const clearTimer = useCallback(() => {
    clearTimeout(timer.current)
    setIsActiveTimer(false)
  }, [])

  useEffect(() => {
    if (isActiveTimer) {
      timerTick()
    } else {
      clearTimeout(timer.current)
    }
  }, [isActiveTimer, timerTick, clearTimer])

  useEffect(
    () => () => {
      clearTimeout(timer.current)
    },
    [],
  )

  return {
    startTimer,
    clearTimer,
    secondsToEnd,
  }
}
