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
      "sp-action-button": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          quiet?: boolean;
          disabled?: boolean;
        },
        HTMLElement
      >;
      "sp-icon": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          name?: string;
          size?: "xxs" | "xs" | "s" | "m" | "l" | "xl" | "xxl";
          slot?: "icon";
        },
        HTMLElement
      >;
      "sp-divider": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          size?: "small" | "medium" | "large";
        },
        HTMLElement
      >;
      "sp-textfield": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          placeholder?: string;
          disabled?: boolean;
          valid?: boolean;
          invalid?: boolean;
          quiet?: boolean;
          type?: "text" | "number" | "search" | "password";
          value?: string;
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