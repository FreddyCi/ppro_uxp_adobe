declare global {
  namespace JSX {
    interface IntrinsicElements {
      "sp-button": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          variant?: "cta" | "primary" | "secondary" | "warning" | "over-background" | "accent" | "outline";
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
      "sp-button-group": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
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
      "sp-label": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;
      "sp-textarea": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          placeholder?: string;
          disabled?: boolean;
          valid?: boolean;
          invalid?: boolean;
          multiline?: boolean;
          rows?: number;
          maxlength?: number;
          value?: string;
        },
        HTMLElement
      >;
      "sp-picker": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          placeholder?: string;
          disabled?: boolean;
          invalid?: boolean;
          quiet?: boolean;
        },
        HTMLElement
      >;
      "sp-menu": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          slot?: "options";
        },
        HTMLElement
      >;
      "sp-menu-item": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          value?: string;
          disabled?: boolean;
          selected?: boolean;
        },
        HTMLElement
      >;
      "sp-radio-group": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;
      "sp-radio": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          value?: string;
          checked?: boolean;
          disabled?: boolean;
        },
        HTMLElement
      >;
      "sp-slider": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          min?: number;
          max?: number;
          value?: number;
          step?: number;
          disabled?: boolean;
        },
        HTMLElement
      >;
      "sp-progressbar": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          value?: number;
          max?: number;
          indeterminate?: boolean;
        },
        HTMLElement
      >;
      "sp-checkbox": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          checked?: boolean;
          indeterminate?: boolean;
          disabled?: boolean;
        },
        HTMLElement
      >;
      "sp-dropdown": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          placeholder?: string;
          disabled?: boolean;
          invalid?: boolean;
        },
        HTMLElement
      >;
      "sp-link": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          href?: string;
          disabled?: boolean;
          quiet?: boolean;
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