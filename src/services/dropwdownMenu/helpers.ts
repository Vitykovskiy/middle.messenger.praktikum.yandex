export function isPointerEvent(event: unknown): event is PointerEvent {
  return event instanceof PointerEvent;
}
