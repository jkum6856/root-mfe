import { eventBus, EVENT_TYPES } from '../utils/eventBus';

export interface ToastMessage {
  message: string;
  type?: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}

/**
 * Global Toast Service for cross-MFE toast notifications
 * This service allows any microfrontend to trigger toast messages
 * by emitting events through the global event bus
 */
export class GlobalToastService {
  private static initialized = false;

  /**
   * Initialize the global toast service
   * This should be called once in the root config
   */
  static init(): void {
    if (this.initialized) return;

    // Add TOAST event types to the event bus
    const TOAST_EVENTS = {
      SHOW_TOAST: 'SHOW_TOAST',
      HIDE_TOAST: 'HIDE_TOAST',
      CLEAR_ALL_TOASTS: 'CLEAR_ALL_TOASTS'
    };

    // Extend the event bus with toast functionality
    (eventBus as any).showToast = (toast: ToastMessage, source: string) => {
      eventBus.emit('SHOW_TOAST' as any, toast, source);
    };

    (eventBus as any).hideToast = (toastId: string, source: string) => {
      eventBus.emit('HIDE_TOAST' as any, { id: toastId }, source);
    };

    (eventBus as any).clearAllToasts = (source: string) => {
      eventBus.emit('CLEAR_ALL_TOASTS' as any, {}, source);
    };

    this.initialized = true;
    console.log('GlobalToastService initialized');
  }

  /**
   * Show a success toast message
   */
  static showSuccess(message: string, duration?: number): void {
    this.showToast({
      message,
      type: 'success',
      duration: duration || 4000
    });
  }

  /**
   * Show an error toast message
   */
  static showError(message: string, duration?: number): void {
    this.showToast({
      message,
      type: 'error',
      duration: duration || 5000
    });
  }

  /**
   * Show an info toast message
   */
  static showInfo(message: string, duration?: number): void {
    this.showToast({
      message,
      type: 'info',
      duration: duration || 4000
    });
  }

  /**
   * Show a warning toast message
   */
  static showWarning(message: string, duration?: number): void {
    this.showToast({
      message,
      type: 'warning',
      duration: duration || 4500
    });
  }

  /**
   * Show a toast message with custom parameters
   */
  static showToast(toast: ToastMessage): void {
    try {
      const rootModule = (window as any).root;
      if (rootModule?.eventBus?.showToast) {
        rootModule.eventBus.showToast(toast, 'global-toast-service');
      } else {
        console.warn('GlobalToastService: Event bus not available for toast message');
      }
    } catch (error) {
      console.error('GlobalToastService: Failed to show toast:', error);
    }
  }

  /**
   * Clear all active toasts
   */
  static clearAll(): void {
    try {
      const rootModule = (window as any).root;
      if (rootModule?.eventBus?.clearAllToasts) {
        rootModule.eventBus.clearAllToasts('global-toast-service');
      }
    } catch (error) {
      console.error('GlobalToastService: Failed to clear toasts:', error);
    }
  }
}