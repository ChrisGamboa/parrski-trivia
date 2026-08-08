import { render, route } from "rwsdk/router";
import { defineApp } from "rwsdk/worker";
import { env } from "cloudflare:workers";
import {
  SyncedStateServer,
  syncedStateRoutes,
} from "rwsdk/use-synced-state/worker";

import { Document } from "@/app/document";
import { setCommonHeaders } from "@/app/headers";
import { Home } from "@/app/pages/home";
import { Room } from "@/app/pages/room";
import { GameRoom } from "@/game/room";

export { SyncedStateServer, GameRoom };

export type AppContext = {};

const ROOM_CODE = /^[A-Z]{4}$/;

/** Guards against arbitrary strings spinning up Durable Objects. */
function getRoom(code: unknown) {
  if (typeof code !== "string" || !ROOM_CODE.test(code)) return null;
  const id = env.GAME_ROOM.idFromName(code);
  return { code, stub: env.GAME_ROOM.get(id) };
}

async function readJson(request: Request): Promise<Record<string, unknown>> {
  try {
    const body = await request.json();
    return typeof body === "object" && body !== null
      ? (body as Record<string, unknown>)
      : {};
  } catch {
    return {};
  }
}

function str(value: unknown, maxLength: number): string {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

const badRoom = () =>
  Response.json({ error: "Invalid room code." }, { status: 400 });

export default defineApp([
  setCommonHeaders(),
  ...syncedStateRoutes(() => env.SYNCED_STATE_SERVER),
  ({ ctx }) => {
    ctx;
  },

  route("/api/room/:code/state", {
    get: async ({ params }) => {
      const room = getRoom(params.code);
      if (!room) return badRoom();
      return Response.json(await room.stub.getPublicState(room.code));
    },
  }),

  route("/api/room/:code/join", {
    post: async ({ params, request }) => {
      const room = getRoom(params.code);
      if (!room) return badRoom();
      const body = await readJson(request);
      const playerId = str(body.playerId, 64);
      const name = str(body.name, 20);
      if (!playerId || !name) {
        return Response.json({ error: "Enter your name!" }, { status: 400 });
      }
      const result = await room.stub.join(playerId, name, room.code);
      return result.ok
        ? Response.json(result.state)
        : Response.json({ error: result.error }, { status: 409 });
    },
  }),

  route("/api/room/:code/start", {
    post: async ({ params, request }) => {
      const room = getRoom(params.code);
      if (!room) return badRoom();
      const playerId = str((await readJson(request)).playerId, 64);
      const result = await room.stub.start(playerId);
      return result.ok
        ? Response.json(result.state)
        : Response.json({ error: result.error }, { status: 409 });
    },
  }),

  route("/api/room/:code/answer", {
    post: async ({ params, request }) => {
      const room = getRoom(params.code);
      if (!room) return badRoom();
      const body = await readJson(request);
      return Response.json(
        await room.stub.answer(
          str(body.playerId, 64),
          Number(body.questionNumber),
          Number(body.choiceIndex),
        ),
      );
    },
  }),

  route("/api/room/:code/leave", {
    post: async ({ params, request }) => {
      const room = getRoom(params.code);
      if (!room) return badRoom();
      const playerId = str((await readJson(request)).playerId, 64);
      return Response.json(await room.stub.leave(playerId));
    },
  }),

  render(Document, [route("/", Home), route("/room/:code", Room)]),
]);
