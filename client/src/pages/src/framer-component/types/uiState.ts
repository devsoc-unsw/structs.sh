export type UiState = {
  showHover: boolean;
  showClick: boolean;
  canDrag: boolean;
  debug: boolean;
  clickedEntity: string | null;
}

export const DEFAULT_UISTATE: UiState = {
  showHover: false,
  showClick: true,
  canDrag: false,
  debug: false,
  clickedEntity: null
}