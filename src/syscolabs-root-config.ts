import { registerApplication, start } from "single-spa";
import {
  constructApplications,
  constructRoutes,
  constructLayoutEngine,
} from "single-spa-layout";
import microfrontendLayout from "./microfrontend-layout.html";
import { eventBus, EVENT_TYPES } from "./utils/eventBus";
import { GlobalCartService } from "./services/GlobalCartService";
import { GlobalToastService } from "./services/GlobalToastService";

// Initialize services
GlobalCartService.init();
GlobalToastService.init();

// Role-based navigation handler
const handleRoleBasedNavigation = (event: any) => {
  console.log('LOGIN_SUCCESS event received:', event);
  const { user } = event.payload || {};
  
  // Validate that user object exists and has required properties
  if (!user || !user.role) {
    console.warn('Role-based navigation: Invalid user data received', event);
    return;
  }
  
  console.log('Role-based navigation for user:', user.email, 'with role:', user.role);
  
  switch (user.role.toLowerCase()) { // Convert to lowercase for case-insensitive comparison
    case 'supplier':
      console.log('Redirecting supplier to dashboard');
      window.history.pushState({}, '', '/supplier');
      window.dispatchEvent(new PopStateEvent('popstate'));
      break;
    case 'customer':
      console.log('Keeping customer on main site');
      // Stay on current page or redirect to home
      break;
    case 'steward':
      console.log('Redirecting steward to approval dashboard');
      window.history.pushState({}, '', '/approval');
      window.dispatchEvent(new PopStateEvent('popstate'));
      break;
    default:
      console.log('Unknown role:', user.role, 'defaulting to customer experience');
  }
};

eventBus.on(EVENT_TYPES.LOGIN_SUCCESS, handleRoleBasedNavigation);

// Expose eventBus globally
(window as any).root = { eventBus, EVENT_TYPES };

const routes = constructRoutes(microfrontendLayout);
const applications = constructApplications({
  routes,
  loadApp({ name }) {
    return import(/* webpackIgnore: true */ name);
  },
});
const layoutEngine = constructLayoutEngine({ routes, applications });

applications.forEach(registerApplication);
layoutEngine.activate();
start();
