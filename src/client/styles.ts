/** One scoped stylesheet; every selector is prefixed with dsh-chat-dock. */
export const CSS_TEXT = `
.dsh-chat-dock-root {
  position: fixed;
  inset: 0;
  z-index: 30;
  pointer-events: none;
  font-family: inherit;
  color: var(--dsw-alias-label-primary, #1f2329);
}
.dsh-chat-dock-root *,
.dsh-chat-dock-root *::before,
.dsh-chat-dock-root *::after {
  box-sizing: border-box;
}
.dsh-chat-dock-panel {
  position: absolute;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  pointer-events: auto;
  background: var(--dsw-alias-bg-overlay, #ffffff);
  border: 1px solid var(--dsw-alias-border-l1, rgba(0, 0, 0, 0.12));
  border-radius: 14px;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.18);
  font-size: 13px;
  line-height: 1.45;
}
.dsh-chat-dock-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 10px 10px 12px;
  border-bottom: 1px solid var(--dsw-alias-border-l1, rgba(0, 0, 0, 0.1));
  cursor: grab;
  user-select: none;
  touch-action: none;
}
.dsh-chat-dock-header:active {
  cursor: grabbing;
}
.dsh-chat-dock-dot {
  flex: none;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--dsw-alias-state-idle-primary, #8a8f98);
}
.dsh-chat-dock-dot[data-state="found"] { background: var(--dsw-alias-state-success-primary, #1a9f5b); }
.dsh-chat-dock-dot[data-state="empty"] { background: var(--dsw-alias-state-warn-primary, #c58a12); }
.dsh-chat-dock-dot[data-state="error"] { background: var(--dsw-alias-state-error-primary, #d33b3b); }
.dsh-chat-dock-title {
  font-weight: 600;
  font-size: 13px;
  white-space: nowrap;
}
.dsh-chat-dock-site-name {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--dsw-alias-label-secondary, #6b7280);
  font-size: 12px;
}
.dsh-chat-dock-icon-btn {
  flex: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  padding: 0;
  border: 0;
  border-radius: 7px;
  background: transparent;
  color: var(--dsw-alias-label-secondary, #6b7280);
  cursor: pointer;
}
.dsh-chat-dock-icon-btn:hover {
  background: var(--dsw-alias-bg-layer-2, rgba(0, 0, 0, 0.06));
  color: var(--dsw-alias-label-primary, #1f2329);
}
.dsh-chat-dock-icon-btn:focus-visible,
.dsh-chat-dock-btn:focus-visible,
.dsh-chat-dock-select:focus-visible,
.dsh-chat-dock-input:focus-visible,
.dsh-chat-dock-textarea:focus-visible,
.dsh-chat-dock-pill:focus-visible {
  outline: 2px solid var(--dsw-alias-brand-primary, #3b5bff);
  outline-offset: 2px;
}
.dsh-chat-dock-body {
  display: flex;
  flex: 1;
  min-height: 0;
  flex-direction: column;
  gap: 10px;
  overflow: auto;
  padding: 12px;
}
.dsh-chat-dock-row {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}
.dsh-chat-dock-select,
.dsh-chat-dock-input {
  height: 28px;
  min-width: 0;
  padding: 0 8px;
  border: 1px solid var(--dsw-alias-border-l1, rgba(0, 0, 0, 0.14));
  border-radius: 7px;
  background: var(--dsw-alias-bg-layer-1, #ffffff);
  color: var(--dsw-alias-label-primary, #1f2329);
  font: inherit;
  font-size: 12px;
}
.dsh-chat-dock-select {
  flex: 1;
  cursor: pointer;
}
.dsh-chat-dock-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  height: 28px;
  padding: 0 10px;
  border: 1px solid var(--dsw-alias-border-l1, rgba(0, 0, 0, 0.14));
  border-radius: 7px;
  background: transparent;
  color: var(--dsw-alias-label-primary, #1f2329);
  font: inherit;
  font-size: 12px;
  white-space: nowrap;
  cursor: pointer;
}
.dsh-chat-dock-btn:hover:not(:disabled) {
  background: var(--dsw-alias-bg-layer-2, rgba(0, 0, 0, 0.06));
}
.dsh-chat-dock-btn[data-variant="primary"] {
  border-color: transparent;
  background: var(--dsw-alias-brand-primary, #3b5bff);
  color: #ffffff;
}
.dsh-chat-dock-btn[data-variant="primary"]:hover:not(:disabled) {
  filter: brightness(1.06);
}
.dsh-chat-dock-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}
.dsh-chat-dock-mirror {
  display: flex;
  flex: 1;
  min-height: 120px;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid var(--dsw-alias-border-l1, rgba(0, 0, 0, 0.1));
  border-radius: 10px;
  background: var(--dsw-alias-bg-layer-1, #fafafa);
}
.dsh-chat-dock-mirror-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 7px 10px;
  border-bottom: 1px solid var(--dsw-alias-border-l1, rgba(0, 0, 0, 0.08));
  color: var(--dsw-alias-label-secondary, #6b7280);
  font-size: 11px;
}
.dsh-chat-dock-mirror-body {
  flex: 1;
  min-height: 0;
  overflow: auto;
  padding: 8px 10px 10px;
}
.dsh-chat-dock-mirror pre {
  margin: 0;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
  font-family: inherit;
  font-size: 12px;
  line-height: 1.55;
  color: var(--dsw-alias-label-primary, #1f2329);
}
.dsh-chat-dock-hint {
  color: var(--dsw-alias-label-secondary, #6b7280);
  font-size: 12px;
  line-height: 1.55;
}
.dsh-chat-dock-actions {
  display: flex;
  gap: 6px;
}
.dsh-chat-dock-actions .dsh-chat-dock-btn {
  flex: 1;
}
.dsh-chat-dock-status {
  min-height: 15px;
  color: var(--dsw-alias-label-secondary, #6b7280);
  font-size: 11px;
  line-height: 1.4;
}
.dsh-chat-dock-status[data-kind="success"] { color: var(--dsw-alias-state-success-primary, #1a9f5b); }
.dsh-chat-dock-status[data-kind="warn"] { color: var(--dsw-alias-state-warn-primary, #a8730a); }
.dsh-chat-dock-status[data-kind="error"] { color: var(--dsw-alias-state-error-primary, #d33b3b); }
.dsh-chat-dock-side {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
  padding-top: 8px;
  border-top: 1px solid var(--dsw-alias-border-l1, rgba(0, 0, 0, 0.08));
}
.dsh-chat-dock-side-label {
  color: var(--dsw-alias-label-secondary, #6b7280);
  font-size: 11px;
}
.dsh-chat-dock-foot {
  color: var(--dsw-alias-label-secondary, #6b7280);
  font-size: 10px;
  line-height: 1.5;
}
.dsh-chat-dock-resize {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 16px;
  height: 16px;
  cursor: nwse-resize;
  touch-action: none;
}
.dsh-chat-dock-resize::after {
  content: "";
  position: absolute;
  right: 4px;
  bottom: 4px;
  width: 7px;
  height: 7px;
  border-right: 2px solid var(--dsw-alias-border-l2, rgba(0, 0, 0, 0.25));
  border-bottom: 2px solid var(--dsw-alias-border-l2, rgba(0, 0, 0, 0.25));
}
.dsh-chat-dock-pill {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 0;
  border-radius: 50%;
  background: var(--dsw-alias-brand-primary, #3b5bff);
  color: #ffffff;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.22);
  cursor: pointer;
  pointer-events: auto;
}
.dsh-chat-dock-pill:hover {
  filter: brightness(1.07);
}
.dsh-chat-dock-pill-dot {
  position: absolute;
  top: 5px;
  right: 5px;
  width: 8px;
  height: 8px;
  border: 2px solid var(--dsw-alias-bg-overlay, #ffffff);
  border-radius: 50%;
  background: var(--dsw-alias-state-idle-primary, #8a8f98);
}
.dsh-chat-dock-pill-dot[data-state="found"] { background: var(--dsw-alias-state-success-primary, #1a9f5b); }
.dsh-chat-dock-pill-dot[data-state="empty"] { background: var(--dsw-alias-state-warn-primary, #c58a12); }
.dsh-chat-dock-pill-dot[data-state="error"] { background: var(--dsw-alias-state-error-primary, #d33b3b); }
.dsh-chat-dock-settings {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.dsh-chat-dock-field {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.dsh-chat-dock-field > label,
.dsh-chat-dock-field-label {
  color: var(--dsw-alias-label-secondary, #6b7280);
  font-size: 11px;
}
.dsh-chat-dock-check {
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 12px;
  cursor: pointer;
}
.dsh-chat-dock-check input {
  margin: 0;
  accent-color: var(--dsw-alias-brand-primary, #3b5bff);
}
.dsh-chat-dock-sites {
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.dsh-chat-dock-site-row {
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 12px;
}
.dsh-chat-dock-tag {
  padding: 1px 5px;
  border-radius: 4px;
  background: var(--dsw-alias-bg-layer-2, rgba(0, 0, 0, 0.07));
  color: var(--dsw-alias-label-secondary, #6b7280);
  font-size: 10px;
}
.dsh-chat-dock-textarea {
  width: 100%;
  min-height: 96px;
  resize: vertical;
  padding: 8px;
  border: 1px solid var(--dsw-alias-border-l1, rgba(0, 0, 0, 0.14));
  border-radius: 7px;
  background: var(--dsw-alias-bg-layer-1, #ffffff);
  color: var(--dsw-alias-label-primary, #1f2329);
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 11px;
  line-height: 1.5;
}
.dsh-chat-dock-settings-note {
  color: var(--dsw-alias-label-secondary, #6b7280);
  font-size: 11px;
  line-height: 1.55;
}
.dsh-chat-dock-settings-actions {
  display: flex;
  justify-content: space-between;
  gap: 6px;
  padding-top: 8px;
  border-top: 1px solid var(--dsw-alias-border-l1, rgba(0, 0, 0, 0.08));
}
.dsh-chat-dock-about {
  color: var(--dsw-alias-label-secondary, #6b7280);
  font-size: 10px;
  text-align: center;
}
@media (prefers-reduced-motion: reduce) {
  .dsh-chat-dock-btn,
  .dsh-chat-dock-icon-btn,
  .dsh-chat-dock-pill {
    transition: none !important;
  }
}
`
