export const EVENT_TYPES = {
  PRODUCT_SELECTED: 'PRODUCT_SELECTED',
  ADD_TO_CART: 'ADD_TO_CART',
  CART_UPDATED: 'CART_UPDATED',
  SEARCH_INITIATED: 'SEARCH_INITIATED',
  NAVIGATE_TO_PRODUCTS: 'NAVIGATE_TO_PRODUCTS',
  NAVIGATE_TO_CART: 'NAVIGATE_TO_CART',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGOUT: 'LOGOUT',
  LOGIN_MODAL_SHOW: 'LOGIN_MODAL_SHOW',
  LOGIN_MODAL_HIDE: 'LOGIN_MODAL_HIDE',
  ROLE_BASED_REDIRECT: 'ROLE_BASED_REDIRECT',
   NAVIGATE_TO_SUPPLIER_DASHBOARD: 'NAVIGATE_TO_SUPPLIER_DASHBOARD'
} as const;

type EventPayload = {
  [EVENT_TYPES.PRODUCT_SELECTED]: { productId: string };
  [EVENT_TYPES.ADD_TO_CART]: { productId: string; quantity: number };
  [EVENT_TYPES.CART_UPDATED]: { itemCount: number };
  [EVENT_TYPES.SEARCH_INITIATED]: { query: string };
  [EVENT_TYPES.NAVIGATE_TO_PRODUCTS]: { categoryId?: string };
  [EVENT_TYPES.NAVIGATE_TO_CART]: {};
  [EVENT_TYPES.LOGIN_SUCCESS]: { user: { id: string; email: string; username?: string; firstName?: string; lastName?: string } };
  [EVENT_TYPES.LOGOUT]: { user?: { id: string; email: string; username?: string } };
  [EVENT_TYPES.LOGIN_MODAL_SHOW]: { source: string; reason: string; pendingItem?: { productId: string; quantity: number } | null };
  [EVENT_TYPES.LOGIN_MODAL_HIDE]: { source: string; success: boolean; message?: string; error?: string };
  [EVENT_TYPES.ROLE_BASED_REDIRECT]: { 
    role: 'customer' | 'supplier' | 'steward'; 
    user: any 
  };
  [EVENT_TYPES.NAVIGATE_TO_SUPPLIER_DASHBOARD]: {};
};

export class MicroFrontendEvent<T extends keyof EventPayload> {
  constructor(
    public type: T,
    public payload: EventPayload[T],
    public source: string
  ) {}
}

export const eventBus = {
  emit<T extends keyof EventPayload>(
    eventType: T,
    payload: EventPayload[T],
    source: string
  ) {
    const event = new CustomEvent('mfe-event', {
      detail: new MicroFrontendEvent(eventType, payload, source)
    });
    window.dispatchEvent(event);
  },

  on<T extends keyof EventPayload>(
    eventType: T,
    handler: (event: MicroFrontendEvent<T>) => void
  ) {
    const listener = ((e: CustomEvent) => {
      const mfeEvent = e.detail as MicroFrontendEvent<T>;
      if (mfeEvent.type === eventType) {
        handler(mfeEvent);
      }
    }) as EventListener;

    window.addEventListener('mfe-event', listener);
    return () => window.removeEventListener('mfe-event', listener);
  },

  navigate(path: string) {
    window.history.pushState({}, '', path);
    window.dispatchEvent(new PopStateEvent('popstate', { state: {} }));
  }
};