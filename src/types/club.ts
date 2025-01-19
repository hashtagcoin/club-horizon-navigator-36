export interface ChatMessage {
  sender: string;
  text: string;
  timestamp: number;
  clubId: number | string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
}
