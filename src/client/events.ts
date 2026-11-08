/** In-process event channel shared by the console and its small entry buttons. */

export interface ConsoleNotice {
  kind: 'info' | 'success' | 'warn' | 'error'
  text: string
}

export type ConsoleEvent = { type: 'toggle' } | { type: 'show'; notice?: ConsoleNotice }

type Listener = (event: ConsoleEvent) => void

const listeners = new Set<Listener>()

export const consoleEvents = {
  subscribe(listener: Listener): () => void {
    listeners.add(listener)
    return () => {
      listeners.delete(listener)
    }
  },
  toggle(): void {
    for (const listener of [...listeners]) listener({ type: 'toggle' })
  },
  show(notice?: ConsoleNotice): void {
    for (const listener of [...listeners]) listener({ type: 'show', notice })
  },
}
