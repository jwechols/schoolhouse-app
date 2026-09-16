"use client";

// ── Teacher Station live channel ───────────────────────────────────────────────
// A single Supabase Realtime room the whole family shares. Kids' devices publish
// their live state via presence; the Teacher Station board subscribes and renders
// it. Commands (launch a lesson, broadcast a message, clear a raised hand) flow
// board → kid over the same channel. No database table needed, presence and
// broadcast are ephemeral by design, which is exactly what a live board wants.

import { supabase } from "./supabase";
import type { RealtimeChannel } from "@supabase/supabase-js";

export type KidStatus = "ready" | "working" | "help" | "done";

export interface MasteryChip { id: string; label: string; emoji: string; pct: number }

export interface KidPresence {
  kidId: string;
  name: string;
  avatar: string;
  status: KidStatus;
  activity: string;   // human label of what they're on right now
  minutes: number;    // minutes on the current task
  level: number;
  streak: number;
  mastery: MasteryChip[];
  onlineAt: number;   // ms timestamp of last update
}

export type StationCommand =
  | { type: "launch";    target: string; path: string; label: string }
  | { type: "broadcast"; target: "all" | string; message: string; emoji: string }
  | { type: "clearHelp"; target: string };

const ROOM = "schoolhouse-station";

// A raised (or lowered) hand, sent as a BROADCAST, not a presence update, so it
// reaches the board instantly and reliably (presence status-updates don't
// propagate cleanly; broadcasts do).
export interface HelpSignal {
  kidId: string;
  name: string;
  activity: string;
  raised: boolean;
}

// ── Kid side ───────────────────────────────────────────────────────────────────
export interface KidChannel {
  update: (patch: Partial<KidPresence>) => void;
  raiseHand: (raised: boolean) => void;
  /** Proactively track/untrack on tab visibility change, so "online" reflects
   *  the app actually being open, not just a WebSocket that hasn't timed out yet. */
  setVisible: (visible: boolean) => void;
  destroy: () => void;
}

export function joinAsKid(
  initial: KidPresence,
  onCommand: (cmd: StationCommand) => void,
): KidChannel {
  if (!supabase) {
    return { update: () => {}, raiseHand: () => {}, setVisible: () => {}, destroy: () => {} };
  }

  let current: KidPresence = { ...initial };
  const channel: RealtimeChannel = supabase.channel(ROOM, {
    config: { presence: { key: initial.kidId } },
  });

  channel.on("broadcast", { event: "command" }, ({ payload }) => {
    const cmd = payload as StationCommand;
    if (cmd.target === current.kidId || cmd.target === "all") onCommand(cmd);
  });

  channel.subscribe(async (status) => {
    if (status === "SUBSCRIBED") {
      await channel.track({ ...current, onlineAt: Date.now() });
    }
  });

  return {
    update: (patch) => {
      current = { ...current, ...patch, onlineAt: Date.now() };
      // track() replaces this key's presence payload
      channel.track(current).catch(() => {});
    },
    raiseHand: (raised) => {
      const signal: HelpSignal = {
        kidId: current.kidId, name: current.name, activity: current.activity, raised,
      };
      channel.send({ type: "broadcast", event: "help", payload: signal });
    },
    setVisible: (visible) => {
      if (visible) channel.track({ ...current, onlineAt: Date.now() }).catch(() => {});
      else channel.untrack().catch(() => {});
    },
    destroy: () => {
      channel.untrack().catch(() => {});
      supabase.removeChannel(channel);
    },
  };
}

// ── Board side ─────────────────────────────────────────────────────────────────
export interface BoardChannel {
  sendCommand: (cmd: StationCommand) => void;
  destroy: () => void;
}

export function joinAsBoard(
  onPresence: (kids: KidPresence[]) => void,
  onHelp?: (signal: HelpSignal) => void,
): BoardChannel {
  if (!supabase) {
    onPresence([]);
    return { sendCommand: () => {}, destroy: () => {} };
  }

  const channel: RealtimeChannel = supabase.channel(ROOM, {
    config: { presence: { key: "board" } },
  });

  channel.on("broadcast", { event: "help" }, ({ payload }) => {
    onHelp?.(payload as HelpSignal);
  });

  const emit = () => {
    const state = channel.presenceState<KidPresence & { role?: string }>();
    const kids: KidPresence[] = [];
    for (const key of Object.keys(state)) {
      if (key === "board") continue;
      const entry = state[key]?.[0];
      if (entry && entry.kidId) kids.push(entry as KidPresence);
    }
    onPresence(kids);
  };

  channel.on("presence", { event: "sync" }, emit);
  channel.on("presence", { event: "join" }, emit);
  channel.on("presence", { event: "leave" }, emit);

  channel.subscribe(async (status) => {
    if (status === "SUBSCRIBED") {
      await channel.track({ role: "board", onlineAt: Date.now() });
    }
  });

  return {
    sendCommand: (cmd) => {
      channel.send({ type: "broadcast", event: "command", payload: cmd });
    },
    destroy: () => {
      supabase.removeChannel(channel);
    },
  };
}
