export function generateRoomCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let code = "";
  for (let i = 0; i < 4; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

export function getPlayerId(): string {
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem("parrski-player-id");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("parrski-player-id", id);
  }
  return id;
}

export function getSavedPlayerName(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("parrski-player-name") || "";
}

export function savePlayerName(name: string): void {
  localStorage.setItem("parrski-player-name", name);
}
