export interface NewDesign {
  html: string;
  react: string;
  dataElements?: {
    improvement: string;
    element: string;
  }[];
}

export interface UiHighlights {
  improvements: {
    improvement: string;
    element: string;
  }[];
}
