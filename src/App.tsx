import { useEffect, useState } from "react";
import {
  AdamoProvider,
  useRobots,
  useRobotOnline,
  Stream,
  resolveNearestRouter,
  type VideoStatus,
} from "adamo-react";

const API_KEY = import.meta.env.VITE_ADAMO_API_KEY as string | undefined;
const API_URL = (import.meta.env.VITE_API_URL as string | undefined) ?? "https://api.adamohq.com";

// Fixed to the interview's demo robot — a simulated feed, not a real robot.
const ROBOT_ID = "interview-sim";

type Connection = { url: string; org: string; orgId?: string; authToken: string };

/**
 * Resolves an org + relay from the API key, same as passing `apiKey` straight
 * to `AdamoProvider` — except forced onto plain authenticated WSS instead of
 * native WebTransport.
 *
 * Why: `apiKey`-only connection always negotiates WebTransport first, and the
 * hosted API only mints WT tickets for allowlisted origins. Bare `localhost`
 * (any port) is not on that list, so it 403s. WSS goes through the same
 * remote_api auth and isn't origin-gated, so this is the transport a scaffold
 * running on a plain local dev server should use. Swap back to passing
 * `apiKey` directly to <AdamoProvider> once this app is served from an
 * allowlisted / production origin, where native WT is the faster default.
 */
function useAdamoConnection(apiKey: string, apiUrl: string): Connection | null {
  const [connection, setConnection] = useState<Connection | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [configRes, tokenRes] = await Promise.all([
        fetch(`${apiUrl}/api/keys/config`, { headers: { "X-API-Key": apiKey } }),
        fetch(`${apiUrl}/api/keys/token`, { method: "POST", headers: { "X-API-Key": apiKey } }),
      ]);
      const config = await configRes.json();
      const body = await tokenRes.json();
      const org = body.org_slug ?? config.org;
      const orgId = body.org_id ?? config.org_id;
      const url = await resolveNearestRouter({
        apiUrl,
        token: body.token,
        org,
        orgId,
        fallbackUrl: config.adamo_url,
        endpointKind: "wss",
      });
      if (cancelled) return;
      setConnection({ url, org, orgId, authToken: body.token });
    })().catch((err) => console.error("[interview-vr] failed to resolve connection:", err));
    return () => {
      cancelled = true;
    };
  }, [apiKey, apiUrl]);

  return connection;
}

function TeleopView() {
  const robots = useRobots();
  const online = useRobotOnline(ROBOT_ID);
  const [status, setStatus] = useState<VideoStatus>("connecting");

  return (
    <div style={{ fontFamily: "monospace", padding: 16, color: "white", background: "#111", minHeight: "100vh" }}>
      <p>org key: {API_KEY ? "set" : "MISSING (set VITE_ADAMO_API_KEY)"}</p>
      <p>robots seen: {robots.map((r) => r.id).join(", ") || "(none yet)"}</p>
      <p>selected robot: {ROBOT_ID}</p>
      <p>robot online: {String(online)}</p>
      <p>video status: {status}</p>
      <div style={{ width: 960, height: 540, background: "black" }}>
        <Stream
          robot={ROBOT_ID}
          track="main"
          robotOnline={online}
          style={{ width: "100%", height: "100%" }}
          onStatusChange={setStatus}
          onPlaying={() => console.log("[interview-vr] first frame decoded")}
        />
      </div>
    </div>
  );
}

export default function App() {
  const connection = useAdamoConnection(API_KEY ?? "", API_URL);

  if (!API_KEY) {
    return <p style={{ color: "red", fontFamily: "monospace" }}>Set VITE_ADAMO_API_KEY in .env.local and reload.</p>;
  }
  if (!connection) {
    return <p style={{ color: "white", fontFamily: "monospace", background: "#111" }}>Resolving relay…</p>;
  }
  return (
    <AdamoProvider
      url={connection.url}
      org={connection.org}
      orgId={connection.orgId}
      authToken={connection.authToken}
      apiUrl={API_URL}
    >
      <TeleopView />
    </AdamoProvider>
  );
}
