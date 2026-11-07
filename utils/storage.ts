import { DesignTemplate, Order, OrderStatus, CustomerProject } from '@/types/wedding-card';
import { SAMPLE_TEMPLATES } from '@/data/sample-templates';
import { INITIAL_ORDERS } from '@/data/initial-orders';

const TEMPLATES_KEY = 'card_assist_templates_v1';
const ORDERS_KEY = 'card_assist_orders_v1';
const CURRENT_PROJECT_KEY = 'card_assist_current_project_v1';

export function getTemplates(): DesignTemplate[] {
  if (typeof window === 'undefined') return SAMPLE_TEMPLATES;
  try {
    const raw = localStorage.getItem(TEMPLATES_KEY);
    if (!raw) {
      localStorage.setItem(TEMPLATES_KEY, JSON.stringify(SAMPLE_TEMPLATES));
      return SAMPLE_TEMPLATES;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : SAMPLE_TEMPLATES;
  } catch (e) {
    console.error('Error reading templates from localStorage', e);
    return SAMPLE_TEMPLATES;
  }
}

export function getTemplateById(id: string): DesignTemplate | undefined {
  const templates = getTemplates();
  return templates.find((t) => t.id === id);
}

export function saveTemplate(template: DesignTemplate): void {
  if (typeof window === 'undefined') return;
  const current = getTemplates();
  const index = current.findIndex((t) => t.id === template.id);
  if (index >= 0) {
    current[index] = template;
  } else {
    current.unshift(template);
  }
  localStorage.setItem(TEMPLATES_KEY, JSON.stringify(current));
}

export function getOrders(): Order[] {
  if (typeof window === 'undefined') return INITIAL_ORDERS;
  try {
    const raw = localStorage.getItem(ORDERS_KEY);
    if (!raw) {
      localStorage.setItem(ORDERS_KEY, JSON.stringify(INITIAL_ORDERS));
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
  const orders = getOrders();
  orders.unshift(order);
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
}

export function updateOrderStatus(
  orderId: string,
  newStatus: OrderStatus,
  note: string = ''
): Order | null {
  if (typeof window === 'undefined') return null;
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
}

export function saveCurrentProject(project: CustomerProject): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(CURRENT_PROJECT_KEY, JSON.stringify(project));
}

export function loadCurrentProject(): CustomerProject | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(CURRENT_PROJECT_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

