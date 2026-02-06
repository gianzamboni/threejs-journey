export class CollisionSound {
  private hitSound: HTMLAudioElement;

  constructor() {
    this.hitSound = new Audio('https://i0hci4avyoqkwwp1.public.blob.vercel-storage.com/sounds/hit.mp3');
    this.setupErrorHandling();
  }

  private setupErrorHandling(): void {
    this.hitSound.onerror = () => {
      const message = document.createElement('span');
      message.textContent = 'Error loading sound';
      this.dispatchEvent(new CustomEvent('loading-error', {
        detail: {
          message: message,
          actionIcon: '🔄',
          action: () => window.location.reload()
        }
      }));
    };
  }

  public play(): void {
    this.hitSound.volume = Math.random();
    this.hitSound.currentTime = 0;
    this.hitSound.play().catch(error => {
      console.warn('Failed to play collision sound:', error);
    });
  }

  
  private dispatchEvent(event: CustomEvent): void {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(event);
    }
  }
}
