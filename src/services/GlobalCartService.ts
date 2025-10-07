/**
 * GlobalCartService - Event coordinator for cart operations across MFEs
 * This service only handles event forwarding between MFEs, not business logic
 * Cart management and authentication are handled by cart-checkout-mfe
 */

import { eventBus, EVENT_TYPES } from '../utils/eventBus';

export class GlobalCartService {
  
  /**
   * Forwards ADD_TO_CART events to cart-checkout-mfe
   * cart-checkout-mfe will handle authentication check and cart management
   */
  static addToCart(productId: string, quantity: number = 1): void {
    eventBus.emit(EVENT_TYPES.ADD_TO_CART, { productId, quantity }, 'root-mfe');
  }

  /**
   * Initialize the service to listen for cart-related navigation events
   */
  static init(): void {
    // Listen for cart navigation requests
    eventBus.on(EVENT_TYPES.NAVIGATE_TO_CART, () => {
      window.history.pushState({}, '', '/cart');
      window.dispatchEvent(new PopStateEvent('popstate'));
    });

    // Listen for login success events from cart-checkout-mfe
    eventBus.on(EVENT_TYPES.LOGIN_SUCCESS, (event) => {
      const user = event.payload?.user;
      if (user && user.email) {
        console.log('User logged in successfully:', user.email);
      } else {
        console.warn('GlobalCartService: Invalid user data received in LOGIN_SUCCESS event', event);
      }
    });
  }
}