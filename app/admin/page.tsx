'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  Order,
  OrderStatus,
  DesignTemplate,
  WeddingCategory,
  SuitePageKey,
} from '@/types/wedding-card';
import {
  getOrders,
  updateOrderStatus,
  getTemplates,
  saveTemplate,
} from '@/utils/storage';
import { generatePrintReadyPdf, generateCustomerProofPdf } from '@/utils/pdf-generator';
import { SUITE_PAGE_LABELS } from '@/utils/suite-pages';
import { BorderFrame } from '@/components/BordersAndFrames';
import { MotifIcon } from '@/components/MotifIcons';
import {
  Layers,
  ShoppingBag,
  TrendingUp,
  Clock,
  Printer,
  Download,
  Search,
  Filter,
  CheckCircle2,
  Plus,
  Edit,
  Eye,
  X,
  Sliders,
  DollarSign,
  AlertCircle,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<'orders' | 'templates' | 'pricing' | 'analytics'>('orders');

  // State
  const [orders, setOrders] = useState<Order[]>([]);
  const [templates, setTemplates] = useState<DesignTemplate[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  // Selected Order for Inspection Modal
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [modalSuitePage, setModalSuitePage] = useState<SuitePageKey>('coverFront');
  const [newStatusInput, setNewStatusInput] = useState<OrderStatus>('New Order');
  const [statusNoteInput, setStatusNoteInput] = useState<string>('');

  // Create/Edit Template Modal
  const [showTemplateModal, setShowTemplateModal] = useState<boolean>(false);
  const [editingTemplate, setEditingTemplate] = useState<Partial<DesignTemplate>>({
    id: `CUSTOM-${Date.now().toString().slice(-4)}`,
    title: '',
    category: 'Royal',
    basePricePerCard: 65,
    description: '',
  });

  // Re-fetch data on mount
  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = () => {
    setOrders(getOrders());
    setTemplates(getTemplates());
  };

  // Filtered orders
  const filteredOrders = useMemo(() => {
    return orders.filter((ord) => {
      if (statusFilter !== 'All' && ord.status !== statusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchId = ord.id.toLowerCase().includes(q);
        const matchName = ord.customer.fullName.toLowerCase().includes(q);
        const matchPhone = ord.customer.phone.toLowerCase().includes(q);
        if (!matchId && !matchName && !matchPhone) return false;
      }
      return true;
    });
  }, [orders, statusFilter, searchQuery]);

  // Analytics Metrics
  const metrics = useMemo(() => {
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, o) => sum + (o.priceBreakdown?.grandTotal || 0), 0);
    const inProduction = orders.filter(
      (o) => o.status === 'Printing in Progress' || o.status === 'Approved for Printing'
    ).length;
    const completed = orders.filter((o) => o.status === 'Completed' || o.status === 'Dispatched').length;

    return { totalOrders, totalRevenue, inProduction, completed };
  }, [orders]);

  const handleUpdateStatus = (orderId: string) => {
    if (!newStatusInput) return;
    const updated = updateOrderStatus(orderId, newStatusInput, statusNoteInput);
    if (updated) {
      refreshData();
      setSelectedOrder(updated);
      setStatusNoteInput('');
    }
  };

  const handleDownloadPdf = async (order: Order) => {
    try {
      const doc = await generatePrintReadyPdf(order);
      doc.save(`${order.id}_PRODUCTION_READY_BLEED_CROPMARKS.pdf`);
    } catch (e) {
      console.error('Error exporting PDF', e);
      alert('Could not export PDF.');
    }
  };

  const handleSaveNewTemplate = () => {
    if (!editingTemplate.title || !editingTemplate.id) {
      alert('Please fill in Template Title and Unique ID');
      return;
    }

    const baseT = templates[0];
    const newT: DesignTemplate = {
      id: editingTemplate.id,
      title: editingTemplate.title,
      category: (editingTemplate.category as WeddingCategory) || 'Royal',
      description: editingTemplate.description || 'Bespoke custom stationery template',
      tags: ['Custom', 'Bespoke', editingTemplate.category || 'Royal'],
      dimensions: {
        widthMm: 127,
        heightMm: 178,
        label: '5" × 7" (127 × 178 mm)',
      },
      orientation: 'portrait',
      basePricePerCard: editingTemplate.basePricePerCard || 65,
      rating: 5.0,
      reviewCount: 1,
      themeColor: '#801222',
      frontDesign: baseT.frontDesign,
      backDesign: baseT.backDesign,
      sampleBrideName: 'Bride Name',
      sampleGroomName: 'Groom Name',
      sampleWeddingDate: 'Saturday, 12th December 2026',
    };

    saveTemplate(newT);
    refreshData();
    setShowTemplateModal(false);
  };

  const statuses: OrderStatus[] = [
    'New Order',
    'Under Review',
    'Awaiting Customer Approval',
    'Approved for Printing',
    'Printing in Progress',
    'Dispatched',
    'Completed',
    'Cancelled',
  ];

  return (
    <div className="bg-[#F7F5EE] min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-stone-200 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-gold-200 text-gold-900 uppercase">
                Enterprise Portal
              </span>
              <span className="text-xs text-stone-500">Card Assist Production v1.0</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
              Business Admin &amp; Print Operations
            </h1>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-stone-200 shadow-xs">
            <button
              type="button"
              onClick={() => setActiveTab('orders')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'orders' ? 'bg-gold-500 text-white shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Orders ({orders.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('templates')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'templates' ? 'bg-gold-500 text-white shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Templates ({templates.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('pricing')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'pricing' ? 'bg-gold-500 text-white shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Pricing Rules
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('analytics')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'analytics' ? 'bg-gold-500 text-white shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Analytics
            </button>
          </div>
        </div>

        {/* METRICS STRIP */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
            <div className="flex items-center justify-between text-stone-500 mb-1">
              <span className="text-xs font-medium uppercase font-mono">Total Revenue</span>
              <DollarSign className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="font-serif text-2xl font-bold text-stone-900">
              ₹{metrics.totalRevenue.toLocaleString('en-IN')}
            </div>
            <span className="text-[10px] text-emerald-700 font-medium">+18% vs last month</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
            <div className="flex items-center justify-between text-stone-500 mb-1">
              <span className="text-xs font-medium uppercase font-mono">Total Orders</span>
              <ShoppingBag className="w-4 h-4 text-gold-600" />
            </div>
            <div className="font-serif text-2xl font-bold text-stone-900">
              {metrics.totalOrders}
            </div>
            <span className="text-[10px] text-stone-500">Live in production system</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
            <div className="flex items-center justify-between text-stone-500 mb-1">
              <span className="text-xs font-medium uppercase font-mono">In Production</span>
              <Printer className="w-4 h-4 text-amber-600" />
            </div>
            <div className="font-serif text-2xl font-bold text-stone-900">
              {metrics.inProduction}
            </div>
            <span className="text-[10px] text-amber-700 font-medium">Plates &amp; foil mounted</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
            <div className="flex items-center justify-between text-stone-500 mb-1">
              <span className="text-xs font-medium uppercase font-mono">Dispatched &amp; Done</span>
              <CheckCircle2 className="w-4 h-4 text-blue-600" />
            </div>
            <div className="font-serif text-2xl font-bold text-stone-900">
              {metrics.completed}
            </div>
            <span className="text-[10px] text-blue-700 font-medium">100% on-time delivery</span>
          </div>
        </div>

        {/* TAB 1: ORDERS MANAGEMENT */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {/* Filter and Search Bar */}
            <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by Order ID, client name, phone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs border border-stone-200 rounded-lg focus:ring-1 focus:ring-gold-500"
                />
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
                {['All', ...statuses].map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setStatusFilter(st)}
                    className={`px-3 py-1 rounded-full text-[11px] font-medium whitespace-nowrap transition-all ${
                      statusFilter === st
                        ? 'bg-gold-500 text-white shadow-xs font-semibold'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-stone-50 border-b border-stone-200 text-stone-500 font-mono text-[11px] uppercase">
                      <th className="py-3.5 px-4 font-semibold">Order ID</th>
                      <th className="py-3.5 px-4 font-semibold">Customer</th>
                      <th className="py-3.5 px-4 font-semibold">Design &amp; Quantity</th>
                      <th className="py-3.5 px-4 font-semibold">Amount</th>
                      <th className="py-3.5 px-4 font-semibold">Status</th>
                      <th className="py-3.5 px-4 font-semibold">Created</th>
                      <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 text-stone-700">
                    {filteredOrders.map((ord) => (
                      <tr key={ord.id} className="hover:bg-stone-50/80 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-stone-900">
                          {ord.id}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-stone-900">{ord.customer.fullName}</div>
                          <div className="text-[11px] text-stone-400 font-mono">{ord.customer.phone}</div>
                        </td>
                        <td className="py-3.5 px-4">
                          <div>{ord.templateTitle}</div>
                          <div className="text-[11px] text-stone-500 font-mono">
                            {ord.specs.quantity} cards • {ord.specs.paperTypeId}
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-mono font-bold text-stone-900">
                            ₹{ord.priceBreakdown.grandTotal.toLocaleString('en-IN')}
                          </div>
                          <span className="text-[10px] text-emerald-700 font-medium">
                            {ord.paymentStatus}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gold-100 text-gold-900 border border-gold-200">
                            {ord.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-stone-500 text-[11px]">
                          {new Date(ord.createdAt).toLocaleDateString('en-IN')}
                        </td>
                        <td className="py-3.5 px-4 text-right space-x-2">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedOrder(ord);
                              setNewStatusInput(ord.status);
                            }}
                            className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-800 text-[11px] font-semibold rounded-md border border-stone-300 transition-colors"
                          >
                            Inspect
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDownloadPdf(ord)}
                            className="px-2.5 py-1 bg-gold-500 hover:bg-gold-600 text-white text-[11px] font-semibold rounded-md shadow-xs transition-colors"
                            title="Download Print-Ready PDF"
                          >
                            PDF
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: TEMPLATES MANAGEMENT */}
        {activeTab === 'templates' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif text-lg font-bold text-stone-900">
                  Manage Invitation Templates ({templates.length})
                </h3>
                <p className="text-xs text-stone-500">
                  Enable/disable templates, set base prices, or upload custom front/back artwork files.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowTemplateModal(true)}
                className="px-4 py-2 bg-gold-500 hover:bg-gold-600 text-white text-xs font-semibold rounded-xl shadow-sm flex items-center gap-1.5 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Upload New Template</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {templates.map((tpl) => (
                <div key={tpl.id} className="bg-white rounded-2xl border border-stone-200 p-4 shadow-xs space-y-3">
                  <div
                    className="relative aspect-[5/7] rounded-xl overflow-hidden p-3 flex flex-col justify-between"
                    style={{ backgroundColor: tpl.frontDesign.backgroundValue }}
                  >
                    <BorderFrame
                      style={tpl.frontDesign.borderStyle}
                      color={tpl.frontDesign.borderColor}
                      isFoil={tpl.frontDesign.borderFoilEffect}
                    />
                    <div className="flex justify-center z-10">
                      {tpl.frontDesign.motifs[0] && (
                        <MotifIcon
                          type={tpl.frontDesign.motifs[0].type}
                          color={tpl.frontDesign.motifs[0].color}
                          size={32}
                        />
                      )}
                    </div>
                    <div className="text-center z-10 my-auto">
                      <div
                        className="font-serif text-base font-bold"
                        style={{ color: tpl.frontDesign.borderColor }}
                      >
                        {tpl.sampleBrideName.split(' ')[0]} &amp; {tpl.sampleGroomName.split(' ')[0]}
                      </div>
                    </div>
                    <span className="z-10 text-[9px] font-mono bg-black/40 text-white px-1.5 py-0.5 rounded self-start">
                      {tpl.id}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-mono text-gold-700 font-bold uppercase">
                      {tpl.category}
                    </span>
                    <h4 className="font-serif text-sm font-bold text-stone-900 mt-0.5">
                      {tpl.title}
                    </h4>
                    <p className="text-xs font-mono font-bold text-stone-900 mt-1">
                      ₹{tpl.basePricePerCard}/card
                    </p>
                  </div>

                  <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                    <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Active</span>
                    </span>
                    <Link
                      href={`/editor/${tpl.id}`}
                      className="text-xs text-gold-700 hover:text-gold-900 font-semibold"
                    >
                      Open in Editor →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: PRICING RULES CONFIGURATION */}
        {activeTab === 'pricing' && (
          <div className="bg-white p-8 rounded-2xl border border-stone-200 shadow-xs space-y-6 max-w-3xl">
            <div>
              <h3 className="font-serif text-xl font-bold text-stone-900">
                Dynamic Pricing &amp; Surcharge Configuration
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                Configure baseline paper costs, hot foil stamping rates, and bulk volume tier discounts.
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-4 bg-stone-50 rounded-xl space-y-3">
                <h4 className="font-bold text-stone-800">Volume Tier Discount Rules</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-stone-600">
                  <div className="bg-white p-2.5 rounded border">
                    <span className="block font-semibold">100 - 149 cards</span>
                    <span className="font-mono font-bold text-gold-700">7% Discount</span>
                  </div>
                  <div className="bg-white p-2.5 rounded border">
                    <span className="block font-semibold">150 - 249 cards</span>
                    <span className="font-mono font-bold text-gold-700">12% Discount</span>
                  </div>
                  <div className="bg-white p-2.5 rounded border">
                    <span className="block font-semibold">250 - 499 cards</span>
                    <span className="font-mono font-bold text-gold-700">18% Discount</span>
                  </div>
                  <div className="bg-white p-2.5 rounded border">
                    <span className="block font-semibold">500+ cards</span>
                    <span className="font-mono font-bold text-gold-700">25% Discount</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-stone-50 rounded-xl space-y-3">
                <h4 className="font-bold text-stone-800">Finishes &amp; Foil Surcharges (per card)</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex justify-between bg-white p-2.5 rounded border">
                    <span>24K Hot Stamped Gold Foil:</span>
                    <strong className="font-mono text-stone-900">+₹28</strong>
                  </div>
                  <div className="flex justify-between bg-white p-2.5 rounded border">
                    <span>Rose Gold Foil:</span>
                    <strong className="font-mono text-stone-900">+₹30</strong>
                  </div>
                  <div className="flex justify-between bg-white p-2.5 rounded border">
                    <span>Deep Blind Embossing:</span>
                    <strong className="font-mono text-stone-900">+₹25</strong>
                  </div>
                  <div className="flex justify-between bg-white p-2.5 rounded border">
                    <span>Raised Spot UV Gloss:</span>
                    <strong className="font-mono text-stone-900">+₹22</strong>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-stone-50 rounded-xl space-y-2">
                <h4 className="font-bold text-stone-800">Taxes &amp; Courier Logistics</h4>
                <p className="text-stone-500">
                  GST Rate: <strong className="text-stone-900 font-mono">18% (Standard Indian Printing Tariff)</strong>
                </p>
                <p className="text-stone-500">
                  Free Express Shipping threshold: <strong className="text-stone-900 font-mono">Orders above ₹15,000</strong> (standard courier fee ₹750).
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: ANALYTICS */}
        {activeTab === 'analytics' && (
          <div className="bg-white p-8 rounded-2xl border border-stone-200 shadow-xs space-y-6">
            <div>
              <h3 className="font-serif text-xl font-bold text-stone-900">
                Business Analytics &amp; Conversion Pipeline
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                Overview of customer customization velocity and order lifecycle metrics.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-5 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
                <h4 className="font-serif text-sm font-bold text-stone-900">Order Status Distribution</h4>
                <div className="space-y-2 text-xs">
                  {statuses.map((st) => {
                    const count = orders.filter((o) => o.status === st).length;
                    const pct = orders.length ? Math.round((count / orders.length) * 100) : 0;
                    return (
                      <div key={st} className="space-y-1">
                        <div className="flex justify-between">
                          <span className="font-medium text-stone-700">{st}</span>
                          <span className="font-mono text-stone-500">{count} ({pct}%)</span>
                        </div>
                        <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden">
                          <div className="bg-gold-500 h-full rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="p-5 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
                <h4 className="font-serif text-sm font-bold text-stone-900">Top Performing Collections</h4>
                <div className="space-y-2 text-xs">
                  {[
                    { name: 'The Royal Rajputana Splendor', cat: 'Royal', revenue: '₹84,500' },
                    { name: 'Noor-e-Nikah Imperial Jali', cat: 'Muslim', revenue: '₹62,400' },
                    { name: 'The Anand Karaj Splendor', cat: 'Sikh', revenue: '₹48,200' },
                    { name: 'Champagne Silk Minimalist', cat: 'Minimal', revenue: '₹36,000' },
                  ].map((row, i) => (
                    <div key={i} className="flex justify-between items-center p-2 bg-white rounded-lg border border-stone-200">
                      <div>
                        <strong className="text-stone-900">{row.name}</strong>
                        <div className="text-[10px] text-stone-500 font-mono">{row.cat}</div>
                      </div>
                      <span className="font-mono font-bold text-stone-900">{row.revenue}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ORDER INSPECTION MODAL */}
        {selectedOrder && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
              {/* Modal Header */}
              <div className="p-6 bg-stone-900 text-white flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono text-gold-400 font-bold uppercase tracking-widest">
                    Pre-Press Proof Inspector
                  </span>
                  <h3 className="font-serif text-xl font-bold">
                    Order {selectedOrder.id} • {selectedOrder.customer.fullName}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="text-stone-400 hover:text-white p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Scroll Body */}
              <div className="p-6 overflow-y-auto space-y-6 flex-1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left: Card Visual */}
                  <div>
                    <div className="flex items-center justify-between mb-2 gap-2 flex-wrap">
                      <span className="text-xs font-bold text-stone-800">
                        Visual Vector Proof
                      </span>
                      <div className="flex bg-stone-100 p-0.5 rounded-lg text-[11px] overflow-x-auto max-w-full">
                        {(Object.keys(SUITE_PAGE_LABELS) as SuitePageKey[]).map((key) => {
                          const info = SUITE_PAGE_LABELS[key];
                          const isActive = modalSuitePage === key;
                          return (
                            <button
                              key={key}
                              type="button"
                              onClick={() => setModalSuitePage(key)}
                              className={`px-2 py-1 rounded-md font-medium whitespace-nowrap transition-colors ${
                                isActive
                                  ? 'bg-gold-500 text-white font-semibold shadow-xs'
                                  : 'text-stone-600 hover:text-stone-900'
                              }`}
                              title={info.label}
                            >
                              {info.shortLabel}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {(() => {
                      const activeCust =
                        (selectedOrder.suitePages && selectedOrder.suitePages[modalSuitePage]) ||
                        (modalSuitePage === 'coverBack'
                          ? selectedOrder.backCustomization
                          : selectedOrder.frontCustomization);
                      const isLandscape = modalSuitePage === 'baraatCard';

                      return (
                        <>
                          <div className="mb-2 text-[11px] text-stone-500 flex items-center justify-between px-1">
                            <span>{SUITE_PAGE_LABELS[modalSuitePage]?.description || ''}</span>
                            <span className="font-semibold text-gold-600 bg-gold-50 px-1.5 py-0.5 rounded border border-gold-200">
                              {SUITE_PAGE_LABELS[modalSuitePage]?.format || '5" × 7"'}
                            </span>
                          </div>

                          <div
                            className={`relative ${
                              isLandscape ? 'aspect-[7/5]' : 'aspect-[5/7]'
                            } rounded-xl overflow-hidden p-4 shadow-md select-none border border-stone-200 transition-all duration-300`}
                            style={{
                              backgroundColor: activeCust.backgroundValue,
                            }}
                          >
                            <BorderFrame
                              style={activeCust.borderStyle}
                              color={activeCust.borderColor}
                              isFoil={true}
                            />

                            {activeCust.motifs.map((m) => (
                              <div
                                key={m.id}
                                className="absolute transform -translate-x-1/2 -translate-y-1/2"
                                style={{ left: `${m.position.xPercent}%`, top: `${m.position.yPercent}%` }}
                              >
                                <MotifIcon type={m.type} color={m.color} size={m.size * 0.7} />
                              </div>
                            ))}

                            <div className="absolute inset-0 z-20">
                              {activeCust.elements.map((el) => (
                                <div
                                  key={el.id}
                                  className="absolute transform -translate-x-1/2 -translate-y-1/2 whitespace-pre-line leading-relaxed"
                                  style={{
                                    left: `${el.xPercent}%`,
                                    top: `${el.yPercent}%`,
                                    width: '85%',
                                    fontSize: `clamp(7px, ${el.fontSize * 0.28}px, 18px)`,
                                    color: el.color,
                                    fontWeight: el.fontWeight || 'normal',
                                    fontStyle: el.fontStyle || 'normal',
                                    textAlign: el.textAlign || 'center',
                                    fontFamily:
                                      el.fontFamily === 'serif'
                                        ? 'var(--font-cormorant), Georgia, serif'
                                        : 'var(--font-jakarta), sans-serif',
                                  }}
                                >
                                  {el.text}
                                </div>
                              ))}
                            </div>
                          </div>
                        </>
                      );
                    })()}

                    <div className="mt-4 flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleDownloadPdf(selectedOrder)}
                        className="w-full py-2 bg-gold-500 hover:bg-gold-600 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
                      >
                        <Printer className="w-4 h-4" />
                        <span>Download 300 DPI Print PDF</span>
                      </button>
                    </div>
                  </div>

                  {/* Right: Specifications & Status Controller */}
                  <div className="space-y-4">
                    <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-2 text-xs">
                      <h4 className="font-bold text-stone-900 border-b border-stone-200 pb-1">
                        Client &amp; Shipping Specs
                      </h4>
                      <p><strong>Name:</strong> {selectedOrder.customer.fullName}</p>
                      <p><strong>Phone:</strong> {selectedOrder.customer.phone}</p>
                      <p><strong>Email:</strong> {selectedOrder.customer.email}</p>
                      <p><strong>Address:</strong> {selectedOrder.customer.shippingAddress}, {selectedOrder.customer.city}, {selectedOrder.customer.state} - {selectedOrder.customer.pincode}</p>
                      <p><strong>Quantity:</strong> {selectedOrder.specs.quantity} cards ({selectedOrder.specs.sides})</p>
                      <p><strong>Paper:</strong> {selectedOrder.specs.paperTypeId}</p>
                      <p><strong>Finish:</strong> {selectedOrder.specs.finishId}</p>
                      <p><strong>Total:</strong> ₹{selectedOrder.priceBreakdown.grandTotal.toLocaleString('en-IN')}</p>
                    </div>

                    {/* Change Status Pipeline Form */}
                    <div className="p-4 bg-gold-50/50 rounded-xl border border-gold-200 space-y-3">
                      <h4 className="font-bold text-stone-900 text-xs">
                        Update Order Status Pipeline
                      </h4>

                      <div>
                        <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                          Current Status: <strong className="text-gold-900">{selectedOrder.status}</strong>
                        </label>
                        <select
                          value={newStatusInput}
                          onChange={(e) => setNewStatusInput(e.target.value as OrderStatus)}
                          className="w-full px-2.5 py-1.5 text-xs border border-stone-300 rounded-lg bg-white"
                        >
                          {statuses.map((st) => (
                            <option key={st} value={st}>
                              {st}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                          Status Update Note
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Heidelberg run complete. Plates etched."
                          value={statusNoteInput}
                          onChange={(e) => setStatusNoteInput(e.target.value)}
                          className="w-full px-2.5 py-1.5 text-xs border border-stone-300 rounded-lg bg-white"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={() => handleUpdateStatus(selectedOrder.id)}
                        className="w-full py-2 bg-stone-900 hover:bg-black text-white text-xs font-semibold rounded-lg transition-colors"
                      >
                        Save New Status
                      </button>
                    </div>

                    {/* Status History Audit Log */}
                    <div className="space-y-1.5">
                      <span className="text-[11px] font-bold text-stone-700 uppercase font-mono">
                        Status History Log
                      </span>
                      <div className="space-y-1 text-[11px] max-h-32 overflow-y-auto">
                        {selectedOrder.statusHistory?.map((h, idx) => (
                          <div key={idx} className="p-2 bg-stone-50 rounded border border-stone-100">
                            <span className="font-bold text-stone-800">{h.status}</span>
                            <span className="text-stone-400 font-mono ml-2">
                              {new Date(h.timestamp).toLocaleDateString('en-IN')}
                            </span>
                            <div className="text-stone-500 mt-0.5">{h.note}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CREATE TEMPLATE MODAL */}
        {showTemplateModal && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b pb-3">
                <h3 className="font-serif text-lg font-bold text-stone-900">
                  Upload &amp; Register New Template
                </h3>
                <button
                  type="button"
                  onClick={() => setShowTemplateModal(false)}
                  className="text-stone-400 hover:text-stone-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold mb-1">Unique Design ID *</label>
                  <input
                    type="text"
                    value={editingTemplate.id}
                    onChange={(e) => setEditingTemplate({ ...editingTemplate, id: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg font-mono uppercase"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Design Title *</label>
                  <input
                    type="text"
                    placeholder="e.g. The Jodhpur Sheesh Mahal"
                    value={editingTemplate.title}
                    onChange={(e) => setEditingTemplate({ ...editingTemplate, title: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg font-sans"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold mb-1">Category</label>
                    <select
                      value={editingTemplate.category}
                      onChange={(e) => setEditingTemplate({ ...editingTemplate, category: e.target.value as WeddingCategory })}
                      className="w-full px-3 py-2 border rounded-lg bg-white"
                    >
                      <option value="Royal">Royal Rajputana</option>
                      <option value="Muslim">Noor Nikah</option>
                      <option value="Sikh">Anand Karaj</option>
                      <option value="Hindu">Traditional Hindu</option>
                      <option value="Minimal">Minimalist</option>
                      <option value="Floral">Pastel Floral</option>
                      <option value="Luxury">Imperial Luxury</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Base Price / Card (₹)</label>
                    <input
                      type="number"
                      value={editingTemplate.basePricePerCard}
                      onChange={(e) => setEditingTemplate({ ...editingTemplate, basePricePerCard: Number(e.target.value) })}
                      className="w-full px-3 py-2 border rounded-lg font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold mb-1">Description</label>
                  <textarea
                    rows={2}
                    placeholder="Describe aesthetics, paper compatibility, and motifs..."
                    value={editingTemplate.description}
                    onChange={(e) => setEditingTemplate({ ...editingTemplate, description: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>

              <div className="pt-3 border-t flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowTemplateModal(false)}
                  className="px-4 py-2 border rounded-xl text-stone-600 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveNewTemplate}
                  className="px-5 py-2 bg-gold-500 hover:bg-gold-600 text-white rounded-xl text-xs font-semibold"
                >
                  Save Template
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

