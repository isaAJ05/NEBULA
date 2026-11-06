import { useCallback, useEffect, useState, type DependencyList } from 'react'

interface AsyncState<T> {
  data: T | null
  loading: boolean
  error: Error | null
}

/**
 * Hook genérico para hacer fetch con useEffect + async/await.
 * Maneja loading, error, cancelación (AbortController) y reintento.
 */
export function useAsync<T>(
  asyncFn: (signal: AbortSignal) => Promise<T>,
  deps: DependencyList,
) {
  const [state, setState] = useState<AsyncState<T>>({ data: null, loading: true, error: null })
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    const controller = new AbortController()

    async function run() {
      setState({ data: null, loading: true, error: null })
      try {
        const data = await asyncFn(controller.signal)
        if (!controller.signal.aborted) setState({ data, loading: false, error: null })
      } catch (error) {
        if (controller.signal.aborted) return
        const err =
          error instanceof TypeError
            ? new Error('We couldn’t connect to NASA. Check your internet connection.')
            : error instanceof Error
              ? error
              : new Error('An unexpected error occurred.')
        setState({ data: null, loading: false, error: err })
      }
    }

    run()
    return () => controller.abort()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, attempt])

  const retry = useCallback(() => setAttempt((n) => n + 1), [])

  return { ...state, retry }
}
