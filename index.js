/**
 * Host half entry for dsh-chat-dock.
 *
 * v0.1 is client-only: the plugin registers no Host service, tool, route or
 * session event. This entry exists so the bundle is installable and so a later
 * version can add the plan-mode Host route without changing the manifest shape.
 */

export function apply() {}
