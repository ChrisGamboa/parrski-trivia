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

export { SyncedStateServer };

export type AppContext = {};

export default defineApp([
  setCommonHeaders(),
  ...syncedStateRoutes(() => env.SYNCED_STATE_SERVER),
  ({ ctx }) => {
    ctx;
  },
  render(Document, [route("/", Home), route("/room/:code", Room)]),
]);
