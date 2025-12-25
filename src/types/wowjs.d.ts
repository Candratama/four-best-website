declare module 'wowjs' {
  export class WOW {
    constructor(options?: {
      boxClass?: string;
      animateClass?: string;
      offset?: number;
      mobile?: boolean;
      live?: boolean;
      callback?: (box: HTMLElement) => void;
      scrollContainer?: string | null;
      resetAnimation?: boolean;
    });
    init(): void;
    sync(): void;
  }
}
