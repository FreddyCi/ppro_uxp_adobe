declare global {
  namespace JSX {
    interface IntrinsicElements {
      "sp-button": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          variant?: "cta" | "primary" | "secondary" | "warning" | "over-background";
          size?: "s" | "m" | "l" | "xl";
          quiet?: boolean;
          disabled?: boolean;
          pending?: boolean;
          selected?: boolean;
          emphasized?: boolean;
          treatment?: "fill" | "outline";
        },
        HTMLElement
      >;
      "uxp-panel": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & { 
          panelid?: string;
        },
        HTMLElement
      >;
    }
  }
}