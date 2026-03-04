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
import { questions } from "@/app/data/questions";
import { pickRandomIndices } from "@/app/shared/utils";
import { QUESTIONS_PER_GAME } from "@/app/data/types";

export { SyncedStateServer };

export type AppContext = {};

export default defineApp([
  setCommonHeaders(),
  ...syncedStateRoutes(() => env.SYNCED_STATE_SERVER),
  ({ ctx }) => {
    ctx;
  },
  route("/api/questions", function () {
    const count = QUESTIONS_PER_GAME;
    const indices = pickRandomIndices(questions.length, count);
    const selected = indices.map((i) => questions[i]);
    return new Response(JSON.stringify(selected), {
      headers: { "Content-Type": "application/json" },
    });
  }),
  render(Document, [route("/", Home), route("/room/:code", Room)]),
]);
