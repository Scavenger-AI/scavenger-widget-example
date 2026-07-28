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
      };
    }
  }
}
