import { useEffect, DependencyList } from "react"

// useDebounceEffect : custom React hook that debounces the execution of a given function
// (used for the CropImage component to ensure the completed crop is only executed every 
// `waitTime` ms)
export function useDebounceEffect(
  fn: () => void,
  waitTime: number,
  deps?: DependencyList,
) {
  useEffect(() => {
    const t = setTimeout(() => {
      fn.apply(deps)
    }, waitTime)

    return () => {
      clearTimeout(t)
    }
  }, [deps])
}
