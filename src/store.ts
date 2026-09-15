import type { PublicEvent } from "./types.ts";

type Subscriber = (event: PublicEvent) => void;

export class EventStore {
  private readonly events = new Map<string, PublicEvent[]>();
  private readonly eventIds = new Set<string>();
  private readonly subscribers = new Map<string, Set<Subscriber>>();
  private readonly timers = new Set<NodeJS.Timeout>();

  append(event: PublicEvent, retentionSeconds: number): "accepted" | "duplicate" {
    const dedupeKey = `${event.channelId}:${event.eventId}`;
    if (this.eventIds.has(dedupeKey)) return "duplicate";
    this.eventIds.add(dedupeKey);

    const release = () => {
      const channelEvents = this.events.get(event.channelId) ?? [];
      channelEvents.push(event);
      const cutoff = Date.now() - retentionSeconds * 1000;
      while (channelEvents[0] && Date.parse(channelEvents[0].receivedAt) < cutoff) channelEvents.shift();
      this.events.set(event.channelId, channelEvents);
      for (const subscriber of this.subscribers.get(event.channelId) ?? []) subscriber(event);
    };

    const delayMs = Math.max(0, Date.parse(event.releaseAt) - Date.now());
    if (delayMs === 0) release();
    else {
      const timer = setTimeout(() => {
        this.timers.delete(timer);
        release();
      }, delayMs);
      this.timers.add(timer);
    }
    return "accepted";
  }

  has(channelId: string, eventId: string): boolean {
    return this.eventIds.has(`${channelId}:${eventId}`);
  }

  latest(channelId: string): PublicEvent | undefined {
    return this.events.get(channelId)?.at(-1);
  }

  list(channelId: string, afterSequence: number, limit: number): PublicEvent[] {
    return (this.events.get(channelId) ?? [])
      .filter((event) => event.sequence > afterSequence)
      .sort((left, right) => left.sequence - right.sequence)
      .slice(0, limit);
  }

  subscribe(channelId: string, subscriber: Subscriber): () => void {
    const channelSubscribers = this.subscribers.get(channelId) ?? new Set<Subscriber>();
    channelSubscribers.add(subscriber);
    this.subscribers.set(channelId, channelSubscribers);
    return () => channelSubscribers.delete(subscriber);
  }

  close(): void {
    for (const timer of this.timers) clearTimeout(timer);
    this.timers.clear();
    this.subscribers.clear();
  }
}
