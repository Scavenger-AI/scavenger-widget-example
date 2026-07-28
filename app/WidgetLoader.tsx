"use client";

type Props = {
  clientId: string;
  wsBaseUrl: string;
};

export function WidgetLoader({ clientId, wsBaseUrl }: Props) {
  return (
    <scavenger-chat-anonymous
      client-id={clientId}
      ws-base-url={wsBaseUrl}
      widget-title="EUIPO Assistant"
      accent-color="220 70% 45%"
      style={{ width: "100%", maxWidth: "520px", height: "640px", display: "block" }}
    />
  );
}
