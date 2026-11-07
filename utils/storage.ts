import { DesignTemplate, Order, OrderStatus, CustomerProject } from '@/types/wedding-card';
import { SAMPLE_TEMPLATES } from '@/data/sample-templates';
import { INITIAL_ORDERS } from '@/data/initial-orders';

const TEMPLATES_KEY = 'card_assist_templates_v1';
const ORDERS_KEY = 'card_assist_orders_v1';
const CURRENT_PROJECT_KEY = 'card_assist_current_project_v1';

// In-memory runtime cache to guarantee instantaneous retrieval and zero QuotaExceeded errors
const MEMORY_TEMPLATES = new Map<string, DesignTemplate>();

// Seed sample templates into memory cache
SAMPLE_TEMPLATES.forEach((t) => MEMORY_TEMPLATES.set(t.id, t));

let MEMORY_CURRENT_PROJECT: CustomerProject | null = null;

export function getTemplates(): DesignTemplate[] {
  if (typeof window === 'undefined') return SAMPLE_TEMPLATES;
  try {
    const raw = localStorage.getItem(TEMPLATES_KEY);
    if (!raw) {
      try {
        localStorage.setItem(TEMPLATES_KEY, JSON.stringify(SAMPLE_TEMPLATES));
      } catch (err) {
        console.warn('Could not prime localStorage with SAMPLE_TEMPLATES', err);
      }
      return Array.from(MEMORY_TEMPLATES.values());
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      // Sync into memory map
      parsed.forEach((t: DesignTemplate) => MEMORY_TEMPLATES.set(t.id, t));
      return Array.from(MEMORY_TEMPLATES.values());
    }
    return Array.from(MEMORY_TEMPLATES.values());
  } catch (e) {
    console.error('Error reading templates from localStorage', e);
    return Array.from(MEMORY_TEMPLATES.values());
  }
}

export function getTemplateById(id: string): DesignTemplate | undefined {
  // Check fast in-memory cache first
  if (MEMORY_TEMPLATES.has(id)) {
    return MEMORY_TEMPLATES.get(id);
  }

  // Check sessionStorage fallback
  if (typeof window !== 'undefined') {
    try {
      const sess = sessionStorage.getItem(`card_template_${id}`);
      if (sess) {
        const parsed = JSON.parse(sess);
        MEMORY_TEMPLATES.set(id, parsed);
        return parsed;
      }
    } catch {}
  }

  const templates = getTemplates();
  return templates.find((t) => t.id === id);
}

export function saveTemplate(template: DesignTemplate): void {
  // Always update in-memory cache first so navigation works instantly
  MEMORY_TEMPLATES.set(template.id, template);

  if (typeof window === 'undefined') return;

  // Save to sessionStorage as secondary resilient cache
  try {
    sessionStorage.setItem(`card_template_${template.id}`, JSON.stringify(template));
  } catch (sessErr) {
    console.warn('SessionStorage save failed:', sessErr);
  }

  // Attempt localStorage save, catching QuotaExceeded gracefully
  try {
    const current = getTemplates();
    const index = current.findIndex((t) => t.id === template.id);
    if (index >= 0) {
      current[index] = template;
    } else {
      current.unshift(template);
    }
    localStorage.setItem(TEMPLATES_KEY, JSON.stringify(current));
  } catch (e) {
    console.warn('localStorage quota reached or unavailable. Template preserved in memory & session.', e);
  }
}

export function getOrders(): Order[] {
  if (typeof window === 'undefined') return INITIAL_ORDERS;
  try {
    const raw = localStorage.getItem(ORDERS_KEY);
    if (!raw) {
      try {
        localStorage.setItem(ORDERS_KEY, JSON.stringify(INITIAL_ORDERS));
      } catch {}
      return INITIAL_ORDERS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_ORDERS;
  } catch (e) {
    console.error('Error reading orders from localStorage', e);
    return INITIAL_ORDERS;
  }
}

export function getOrderById(id: string): Order | undefined {
  const orders = getOrders();
  return orders.find((o) => o.id === id);
}

export function createOrder(order: Order): void {
  if (typeof window === 'undefined') return;
  try {
    const orders = getOrders();
    orders.unshift(order);
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  } catch (e) {
    console.warn('Could not save order to localStorage:', e);
  }
}

export function updateOrderStatus(
  orderId: string,
  newStatus: OrderStatus,
  note: string = ''
): Order | null {
  if (typeof window === 'undefined') return null;
  try {
    const orders = getOrders();
    const index = orders.findIndex((o) => o.id === orderId);
    if (index === -1) return null;

    const order = orders[index];
    order.status = newStatus;
    order.updatedAt = new Date().toISOString();
    order.statusHistory.unshift({
      status: newStatus,
      timestamp: new Date().toISOString(),
      note: note || `Order status updated to ${newStatus}`,
    });

    orders[index] = order;
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
    return order;
  } catch (e) {
    console.warn('Could not update order status in localStorage:', e);
    return null;
  }
}

export function saveCurrentProject(project: CustomerProject): void {
  MEMORY_CURRENT_PROJECT = project;
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.setItem(CURRENT_PROJECT_KEY, JSON.stringify(project));
    localStorage.setItem(CURRENT_PROJECT_KEY, JSON.stringify(project));
  } catch (e) {
    console.warn('Project saved in memory; storage quota notice:', e);
  }
}

export function loadCurrentProject(): CustomerProject | null {
  if (MEMORY_CURRENT_PROJECT) return MEMORY_CURRENT_PROJECT;
  if (typeof window === 'undefined') return null;
  try {
    const sess = sessionStorage.getItem(CURRENT_PROJECT_KEY);
    if (sess) return JSON.parse(sess);
    const raw = localStorage.getItem(CURRENT_PROJECT_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
