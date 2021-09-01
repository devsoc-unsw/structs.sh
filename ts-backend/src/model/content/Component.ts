import mongoose from 'mongoose';

/**
 * This is the model defining each component rendered in a question
 */
export interface Component extends mongoose.Document {
  /**
   * The data of this component. All of its props, and its name.
   */
  componentData: ComponentData;
}

export interface ComponentData {
  row: number;
  col: number;
  height: number;
  width: number;
  data:
    | TextComponentData
    | ImageComponentData
    | VideoComponentData
    | SpeechComponentData;
  componentName: string;
  id: string;
}

export interface TextComponentData {
  text: string;
  textAlign: 'left' | 'right' | 'center';
  color: string;
  fontSize: string;
}

export interface ImageComponentData {
  imageUrl: string;
  isCorrect: boolean;
}

export interface VideoComponentData {
  videoUrl: string;
}
export interface SpeechComponentData {
  audioText: string;
  audioUrl: string;
}
