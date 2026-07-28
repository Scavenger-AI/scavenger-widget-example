import { WidgetLoader } from "./WidgetLoader";

export default function Home() {
  return (
    <main style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#f8fafc",
      padding: 24,
    }}>
      <WidgetLoader
        clientId={process.env.NEXT_PUBLIC_WIDGET_CLIENT_ID ?? "euipo-dev-001"}
        wsBaseUrl={process.env.NEXT_PUBLIC_WS_BASE_URL ?? "ws://localhost:8001"}
      />
    </main>
  );
}
