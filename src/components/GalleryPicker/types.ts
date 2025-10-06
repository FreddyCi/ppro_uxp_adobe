import type { ContentItem } from '../../types/content';

export interface GalleryPickerProps {
  target: string | null;
  onSelect: (item: ContentItem) => void;
  onCancel: () => void;
}
