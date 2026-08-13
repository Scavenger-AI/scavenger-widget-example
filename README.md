# Scavenger Chat Widget — Integration Example

This repository is a **minimal, working Next.js app** that embeds the Scavenger anonymous chat widget. Every file referenced below exists in this repo and is ready to copy into your own project.

---

## What you get

- A Web Component loaded from CDN — no npm install, no bundler config
- Shadow DOM isolation — zero style leakage into your app
- Automatic session persistence — conversation survives page reloads
- Server-side token proxy — backend URL and secrets never reach the browser

---

## Integration checklist

```
□ 1. Load the widget script          app/layout.tsx
□ 2. Add TypeScript types             types/custom-elements.d.ts
□ 3. Add the two token proxy routes   app/api/widget/token/
□ 4. Set environment variables        .env.local
□ 5. Render the widget                app/WidgetLoader.tsx
```

---

## Step 1 — Load the widget script

Copy this into your root `app/layout.tsx`. The `<Script strategy="afterInteractive">` tag bypasses the Next.js bundler, which is required for IIFE bundles.

```tsx
// app/layout.tsx
import Script from "next/script";

const WIDGET_SRC =
  process.env.NEXT_PUBLIC_WIDGET_SRC ??
  "https://d2ti5h8dzkdk09.cloudfront.net/scavenger-chat-anonymous.js";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Script src={WIDGET_SRC} strategy="afterInteractive" />
      </body>
    </html>
  );
}
```

> **Do not** `import` the script through the bundler — it must be a plain `<script>` tag.

---

## Step 2 — Add TypeScript types

Create `types/custom-elements.d.ts`:

```ts
import "react";

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "scavenger-chat-anonymous": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        "client-id"?: string;
        "ws-base-url"?: string;
        "token-proxy-url"?: string;
        "widget-title"?: string;
        "accent-color"?: string;
        "border-radius"?: string;
        "font-family"?: string;
        "max-width"?: string;
      };
    }
  }
}
```

If your `tsconfig.json` does not already include a `types` directory, add it:

```json
{
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", "types/**/*.d.ts"]
}
```

---

## Step 3 — Add the token proxy routes

The widget fetches tokens through your Next.js API routes so the backend URL and origin allowlist check stay server-side.

Copy both files from this repo as-is:

```
app/api/widget/token/route.ts          ← issues a new token
app/api/widget/token/refresh/route.ts  ← refreshes an existing token
```

No changes needed — they read `SCAVENGER_API_URL` and `WIDGET_ORIGIN` from env automatically.

---

## Step 4 — Set environment variables

Create `.env.local` in the project root and fill in your values:

```ini
# Server-side only — never sent to the browser
SCAVENGER_API_URL=https://api.your-scavenger-instance.com
WIDGET_ORIGIN=https://your-app.com   # use http://localhost:3001 for local dev

# Browser-safe — passed to the widget element
NEXT_PUBLIC_WIDGET_CLIENT_ID=your-client-id
NEXT_PUBLIC_WS_BASE_URL=wss://api.your-scavenger-instance.com
```

For Vercel: add all four in **Project → Settings → Environment Variables**.

> **Note:** Restart the development server after editing `.env.local`.

| Variable | Where it's used | Exposed to browser? |
|---|---|---|
| `SCAVENGER_API_URL` | Token proxy routes | No |
| `WIDGET_ORIGIN` | Origin header sent to backend allowlist | No |
| `NEXT_PUBLIC_WIDGET_CLIENT_ID` | `client-id` prop on the element | Yes |
| `NEXT_PUBLIC_WS_BASE_URL` | `ws-base-url` prop on the element | Yes |

---

## Step 5 — Render the widget

The widget is a custom element — it needs a `"use client"` boundary. See `app/WidgetLoader.tsx` for the complete working example:

```tsx
"use client";

export function WidgetLoader({ clientId, wsBaseUrl }: { clientId: string; wsBaseUrl: string }) {
  return (
    <scavenger-chat-anonymous
      client-id={clientId}
      ws-base-url={wsBaseUrl}
      widget-title="Assistant"
      accent-color="220 70% 45%"
      style={{ display: "block", width: "100%", height: "640px" }}
    />
  );
}
```

Use it from a server component by passing the env vars as props:

```tsx
// app/page.tsx
import { WidgetLoader } from "./WidgetLoader";

export default function Page() {
  return (
    <WidgetLoader
      clientId={process.env.NEXT_PUBLIC_WIDGET_CLIENT_ID ?? ""}
      wsBaseUrl={process.env.NEXT_PUBLIC_WS_BASE_URL ?? ""}
    />
  );
}
```

---

## Props reference

| Attribute | Required | Default | Description |
|---|---|---|---|
| `client-id` | Yes | — | Widget client ID registered in Scavenger |
| `ws-base-url` | Yes | — | WebSocket base URL (`wss://...`) |
| `token-proxy-url` | No | `/api/widget/token` | Path to your token issue proxy route |
| `widget-title` | No | `"Assistant"` | Header title text |
| `accent-color` | No | `"220 70% 45%"` | HSL values for header and user bubble colour |
| `border-radius` | No | `"8px"` | Widget container border radius |
| `font-family` | No | system-ui | Font override |
| `max-width` | No | none | Constrain width, e.g. `"520px"` |

---

## Sizing

The widget fills 100% of its container by default. Use inline `style` and optionally `max-width` to control it:

```tsx
{/* Floating side panel */}
<scavenger-chat-anonymous
  ...
  max-width="420px"
  style={{ display: "block", height: "600px" }}
/>

{/* Full-page embed */}
<scavenger-chat-anonymous
  ...
  style={{ display: "block", width: "100%", height: "100vh" }}
/>
```

---

## Session persistence

Each visitor's session is stored in `sessionStorage` keyed by their client ID. On reload, the same backend project and full conversation history are restored automatically. Sessions older than 24 hours are discarded and a fresh session starts. Closing the browser tab clears the session — this is intentional to reduce token exposure window.

---

## Run this example locally

```bash
cp .env.local.example .env.local
# edit .env.local with your values
npm install
npm run dev
# open http://localhost:3001
```

Requires a running Scavenger backend and a registered `client-id` with your app's origin in its allowlist.

---

## Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| Token request returns `403` | App origin not in client's allowlist | Add `WIDGET_ORIGIN` value in Scavenger admin for this client ID |
| Widget shows "Initialising…" forever | `NEXT_PUBLIC_WIDGET_CLIENT_ID` missing | Check env vars; restart dev server or redeploy |
| `Uncaught SyntaxError: Unexpected token 'export'` | Script imported via bundler | Use `next/script` with `strategy="afterInteractive"` |
| WebSocket closes immediately | Wrong `ws-base-url` scheme | Value must start with `wss://` (or `ws://` for local) |
| "Connection error. Please try again." banner appears briefly | Transient WebSocket reconnect during streaming | Expected; the response is still delivered and the banner clears automatically |
| Conversation lost after closing tab | `sessionStorage` cleared on tab close | Expected — sessions are tab-scoped for security |
| `401` on token refresh | Token from old backend version in localStorage | Clear localStorage and reload for a fresh session |
