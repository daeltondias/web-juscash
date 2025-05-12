import { DependencyList, EffectCallback, useEffect, useRef } from 'react'

export const useEffectWithoutInitial = (effect: EffectCallback, deps?: DependencyList) => {
  const inited = useRef(false)

  useEffect(() => {
    if (inited.current) {
      return effect()
    } else {
      inited.current = true
    }
  }, deps)
}
