export type Tone = "purple" | "pink" | "blue" | "mint" | "yellow";

export interface Event {
  title: string;
  description?: string;
  color: Tone;
  date: Date;
  duration: number;
}
