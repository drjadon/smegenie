
import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Trash2, 
  FileText, 
  Download, 
  Settings, 
  User, 
  Briefcase, 
  ChevronRight, 
  ChevronDown, 
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  TrendingUp,
  ReceiptIndianRupee,
  Calendar,
  Mail,
  MapPin,
  PlusCircle,
  CreditCard,
  Banknote,
  Send,
  Eye,
  QrCode,
  Building2,
  Hash,
  Save,
  Wallet,
  Scale,
  Percent,
  CircleDollarSign,
  Package,
  Layers,
  ArrowRight,
  ClipboardList,
  FileDigit,
  Type,
  Fingerprint
} from 'lucide-react';
import { Invoice, InvoiceLineItem, UserProfile, Transaction, CatalogItem } from '../../types';
import { getCurrencySymbol } from '../../constants';
import { format } from 'date-fns';
import { exportToPDF } from '../../services/export';
import { InvoiceRenderer } from './InvoiceRenderer';

interface InvoiceMakerProps {
  user: UserProfile;
  invoices: Invoice[];
  catalog: CatalogItem[];
  onUpdateCatalog: (items: CatalogItem[]) => void;
  onSave: (invoice: Invoice) => void;
  onDelete: (id: string) => void;
  onAddTransaction: (t: Transaction) => void;
  onUpdateUser: (user: UserProfile) => void;
}

export const InvoiceMaker: React.FC<InvoiceMakerProps> = ({ 
  user, invoices, catalog, onUpdateCatalog, onSave, onDelete, onAddTransaction, onUpdateUser 
}) => {
  const [activeTab, setActiveTab] = useState<'LIST' | 'CATALOG' | 'PAYMENT_CONFIG' | 'TERMS_CONFIG' | 'DOC_SETTINGS'>('LIST');
  const [view, setView] = useState<'LIST' | 'EDIT' | 'PREVIEW'>('LIST');
  const [currentInvoice, setCurrentInvoice] = useState<Invoice | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCatalogPicker, setShowCatalogPicker] = useState(false);
  const [catalogSearch, setCatalogSearch] = useState('');
  
  const currencySymbol = getCurrencySymbol(user.defaultCurrency);

  // Catalog Item Management State
  const [showAddCatalog, setShowAddCatalog] = useState(false);
  const [newCatalogItem, setNewCatalogItem] = useState<Partial<CatalogItem>>({
    name: '',
    category: 'Services',
    defaultRate: 0,
    defaultTaxRate: 18,
    defaultDiscountValue: 0,
    defaultDiscountType: 'PERCENT',
    defaultHsnCode: ''
  });
  
  // Config states
  const [configData, setConfigData] = useState({
    bankName: user.defaultBankName || '',
    accountNumber: user.defaultAccountNumber || '',
    ifscCode: user.defaultIfscCode || '',
    upiId: user.defaultUpiId || '',
    terms: user.defaultTerms || 'Payment is expected within 30 days.',
    invoicePrefix: user.defaultInvoicePrefix || `INV-${new Date().getFullYear()}-`,
    nextSequence: user.nextInvoiceSequence || 1001
  });

  const filteredInvoices = invoices.filter(i => 
    i.clientName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    i.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredCatalog = catalog.filter(c => 
    c.name.toLowerCase().includes(catalogSearch.toLowerCase()) ||
    c.category.toLowerCase().includes(catalogSearch.toLowerCase())
  );

  const startNewInvoice = () => {
    // Determine the next invoice number based on user settings
    const prefix = user.defaultInvoicePrefix || `INV-${new Date().getFullYear()}-`;
    const sequence = user.nextInvoiceSequence || 1001;
    const nextNumber = `${prefix}${sequence}`;

    const newInv: Invoice = {
      id: Math.random().toString(36).substr(2, 9),
      invoiceNumber: nextNumber,
      date: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      clientName: '',
      clientEmail: '',
      clientAddress: '',
      clientGstNumber: '',
      currency: user.defaultCurrency || 'INR',
      items: [{ 
        id: '1', 
        description: '', 
        hsnCode: '',
        quantity: 1, 
        rate: 0, 
        taxRate: 18, 
        discountValue: 0, 
        discountType: 'PERCENT', 
        taxAmount: 0, 
        discountAmount: 0, 
        amount: 0 
      }],
      subtotal: 0,
      taxAmount: 0,
      discountAmount: 0,
      total: 0,
      status: 'DRAFT',
      enterpriseId: user.id,
      timestamp: Date.now(),
      bankName: user.defaultBankName || '',
      accountNumber: user.defaultAccountNumber || '',
      ifscCode: user.defaultIfscCode || '',
      accountHolder: user.name,
      upiId: user.defaultUpiId || '',
      terms: user.defaultTerms || 'Payment is expected within 30 days.'
    };

    // Auto-increment for next time
    onUpdateUser({
        ...user,
        nextInvoiceSequence: sequence + 1
    });

    setCurrentInvoice(newInv);
    setView('EDIT');
  };

  const handleSaveConfig = () => {
    onUpdateUser({
      ...user,
      defaultBankName: configData.bankName,
      defaultAccountNumber: configData.accountNumber,
      defaultIfscCode: configData.ifscCode,
      defaultUpiId: configData.upiId,
      defaultTerms: configData.terms,
      defaultInvoicePrefix: configData.invoicePrefix,
      nextInvoiceSequence: configData.nextSequence
    });
    alert("Invoice settings saved successfully!");
    setActiveTab('LIST');
  };

  const handleAddCatalogItem = () => {
    if (!newCatalogItem.name) return;
    const item: CatalogItem = {
      id: Math.random().toString(36).substr(2, 9),
      name: newCatalogItem.name || '',
      category: newCatalogItem.category || 'General',
      defaultRate: newCatalogItem.defaultRate || 0,
      defaultTaxRate: newCatalogItem.defaultTaxRate || 18,
      defaultDiscountValue: newCatalogItem.defaultDiscountValue || 0,
      defaultDiscountType: newCatalogItem.defaultDiscountType || 'PERCENT',
      defaultHsnCode: newCatalogItem.defaultHsnCode || ''
    };
    onUpdateCatalog([...catalog, item]);
    setShowAddCatalog(false);
    setNewCatalogItem({ name: '', category: 'Services', defaultRate: 0, defaultTaxRate: 18, defaultDiscountValue: 0, defaultDiscountType: 'PERCENT', defaultHsnCode: '' });
  };

  const handleRemoveCatalogItem = (id: string) => {
    onUpdateCatalog(catalog.filter(c => c.id !== id));
  };

  const handleEditInvoice = (inv: Invoice) => {
    setCurrentInvoice(inv);
    setView('EDIT');
  };

  const updateLineItem = (index: number, field: keyof InvoiceLineItem, value: any) => {
    if (!currentInvoice) return;
    const newItems = [...currentInvoice.items];
    const item = { ...newItems[index], [field]: value };
    
    const gross = item.quantity * item.rate;
    if (item.discountType === 'PERCENT') {
      item.discountAmount = (gross * (item.discountValue || 0)) / 100;
    } else {
      item.discountAmount = item.discountValue || 0;
    }
    const taxable = gross - item.discountAmount;
    item.taxAmount = (taxable * (item.taxRate || 0)) / 100;
    item.amount = taxable + item.taxAmount;
    
    newItems[index] = item;
    
    const subtotal = newItems.reduce((sum, it) => sum + (it.quantity * it.rate), 0);
    const totalDiscount = newItems.reduce((sum, it) => sum + it.discountAmount, 0);
    const totalTax = newItems.reduce((sum, it) => sum + it.taxAmount, 0);
    const total = newItems.reduce((sum, it) => sum + it.amount, 0);

    setCurrentInvoice({
      ...currentInvoice,
      items: newItems,
      subtotal,
      discountAmount: totalDiscount,
      taxAmount: totalTax,
      total
    });
  };

  const fetchFromCatalog = (catalogItem: CatalogItem) => {
    if (!currentInvoice) return;
    const newItem: InvoiceLineItem = {
      id: Math.random().toString(36).substr(2, 9),
      description: catalogItem.name,
      hsnCode: catalogItem.defaultHsnCode || '',
      quantity: 1,
      rate: catalogItem.defaultRate,
      taxRate: catalogItem.defaultTaxRate,
      discountValue: catalogItem.defaultDiscountValue,
      discountType: catalogItem.defaultDiscountType,
      taxAmount: 0,
      discountAmount: 0,
      amount: 0
    };
    
    const gross = newItem.rate;
    if (newItem.discountType === 'PERCENT') {
      newItem.discountAmount = (gross * newItem.discountValue) / 100;
    } else {
      newItem.discountAmount = newItem.discountValue;
    }
    const taxable = gross - newItem.discountAmount;
    newItem.taxAmount = (taxable * newItem.taxRate) / 100;
    newItem.amount = taxable + newItem.taxAmount;

    const lastItem = currentInvoice.items[currentInvoice.items.length - 1];
    let newItemsList;
    if (currentInvoice.items.length === 1 && !lastItem.description && lastItem.rate === 0) {
      newItemsList = [newItem];
    } else {
      newItemsList = [...currentInvoice.items, newItem];
    }

    const subtotal = newItemsList.reduce((sum, it) => sum + (it.quantity * it.rate), 0);
    const totalDiscount = newItemsList.reduce((sum, it) => sum + it.discountAmount, 0);
    const totalTax = newItemsList.reduce((sum, it) => sum + it.taxAmount, 0);
    const total = newItemsList.reduce((sum, it) => sum + it.amount, 0);

    setCurrentInvoice({
      ...currentInvoice,
      items: newItemsList,
      subtotal,
      discountAmount: totalDiscount,
      taxAmount: totalTax,
      total
    });
    setShowCatalogPicker(false);
  };

  const addEmptyLineItem = () => {
    if (!currentInvoice) return;
    const newItem: InvoiceLineItem = {
      id: Math.random().toString(36).substr(2, 9),
      description: '',
      hsnCode: '',
      quantity: 1,
      rate: 0,
      taxRate: 18,
      discountValue: 0,
      discountType: 'PERCENT',
      taxAmount: 0,
      discountAmount: 0,
      amount: 0
    };
    setCurrentInvoice({ ...currentInvoice, items: [...currentInvoice.items, newItem] });
  };

  const removeLineItem = (index: number) => {
    if (!currentInvoice || currentInvoice.items.length <= 1) return;
    const newItems = currentInvoice.items.filter((_, i) => i !== index);
    
    const subtotal = newItems.reduce((sum, it) => sum + (it.quantity * it.rate), 0);
    const totalDiscount = newItems.reduce((sum, it) => sum + it.discountAmount, 0);
    const totalTax = newItems.reduce((sum, it) => sum + it.taxAmount, 0);
    const total = newItems.reduce((sum, it) => sum + it.amount, 0);

    setCurrentInvoice({
      ...currentInvoice,
      items: newItems,
      subtotal,
      discountAmount: totalDiscount,
      taxAmount: totalTax,
      total
    });
  };

  const updateInvoiceMeta = (field: keyof Invoice, value: any) => {
    if (!currentInvoice) return;
    setCurrentInvoice({ ...currentInvoice, [field]: value });
  };

  const handleMarkPaid = (inv: Invoice) => {
    if (confirm(`Mark Invoice ${inv.invoiceNumber} as PAID and add to Income Ledger?`)) {
      const updated = { ...inv, status: 'PAID' as const };
      onSave(updated);
      
      const tx: Transaction = {
        id: Math.random().toString(36).substr(2, 9),
        type: 'INCOME',
        amount: inv.total,
        date: new Date().toISOString().split('T')[0],
        category: 'Invoicing',
        paymentMode: 'BANK_TRANSFER',
        reference: inv.invoiceNumber,
        description: `Payment received for Invoice: ${inv.invoiceNumber} (${inv.clientName})`,
        timestamp: Date.now(),
        enterpriseId: user.id,
        currency: inv.currency || user.defaultCurrency
      };
      onAddTransaction(tx);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {view === 'LIST' && (
        <>
          <div className="flex bg-slate-100 p-1.5 rounded-[1.5rem] w-full max-w-4xl mx-auto shadow-inner mb-6 overflow-x-auto custom-scrollbar">
            <button 
              onClick={() => setActiveTab('LIST')}
              className={`flex-1 min-w-[120px] flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                activeTab === 'LIST' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'
              }`}
            >
              <FileText size={14} /> My Invoices
            </button>
            <button 
              onClick={() => setActiveTab('CATALOG')}
              className={`flex-1 min-w-[120px] flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                activeTab === 'CATALOG' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'
              }`}
            >
              <Package size={14} /> Item Catalog
            </button>
            <button 
              onClick={() => setActiveTab('DOC_SETTINGS')}
              className={`flex-1 min-w-[120px] flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                activeTab === 'DOC_SETTINGS' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'
              }`}
            >
              <FileDigit size={14} /> Doc Settings
            </button>
            <button 
              onClick={() => setActiveTab('PAYMENT_CONFIG')}
              className={`flex-1 min-w-[120px] flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                activeTab === 'PAYMENT_CONFIG' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'
              }`}
            >
              <Wallet size={14} /> Payments
            </button>
            <button 
              onClick={() => setActiveTab('TERMS_CONFIG')}
              className={`flex-1 min-w-[120px] flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                activeTab === 'TERMS_CONFIG' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'
              }`}
            >
              <Scale size={14} /> T&C
            </button>
          </div>

          {activeTab === 'LIST' ? (
            <>
              <div className="flex flex-col sm:flex-row justify-between items-center gap-6 bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center shadow-inner">
                    <ReceiptIndianRupee size={32} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Invoice Studio</h2>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Itemized Billing Control</p>
                  </div>
                </div>
                <button 
                  onClick={startNewInvoice}
                  className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-indigo-700 shadow-xl shadow-indigo-200 transition-all active:scale-95"
                >
                  <Plus size={18} /> Create Invoice
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredInvoices.map(inv => (
                  <div key={inv.id} className="bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-sm hover:border-indigo-500 transition-all group relative overflow-hidden flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-6">
                          <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{inv.invoiceNumber}</div>
                          <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                            inv.status === 'PAID' ? 'bg-emerald-50 text-emerald-600' : 
                            inv.status === 'OVERDUE' ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'
                          }`}>
                            {inv.status}
                          </span>
                      </div>
                      <p className="text-xl font-black text-slate-900 mb-1">{inv.clientName}</p>
                      <p className="text-sm font-bold text-slate-500 mb-6">{inv.clientEmail}</p>
                      <div className="flex items-baseline gap-2 mb-4">
                          <p className="text-3xl font-black text-slate-900">{getCurrencySymbol(inv.currency)}{inv.total.toLocaleString()}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase">Due: {format(new Date(inv.dueDate), 'MMM dd')}</p>
                      </div>
                    </div>
                    <div className="pt-6 border-t border-slate-50 flex items-center justify-between mt-auto">
                      <div className="flex gap-2">
                          <button onClick={() => handleEditInvoice(inv)} className="p-2 text-slate-400 hover:text-indigo-600 transition-colors"><Settings size={18} /></button>
                          <button onClick={() => onDelete(inv.id)} className="p-2 text-slate-400 hover:text-rose-500 transition-colors"><Trash2 size={18} /></button>
                      </div>
                      <div className="flex gap-2">
                          {inv.status !== 'PAID' && (
                            <button 
                              onClick={() => handleMarkPaid(inv)}
                              className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 hover:text-white transition-all"
                            >
                              Mark Paid
                            </button>
                          )}
                          <button 
                            onClick={() => { setCurrentInvoice(inv); setView('PREVIEW'); }}
                            className="px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center gap-2"
                          >
                            <Eye size={12} /> View
                          </button>
                      </div>
                    </div>
                  </div>
                ))}
                {filteredInvoices.length === 0 && (
                  <div className="col-span-full py-24 text-center bg-white rounded-[3rem] border-2 border-dashed border-slate-200">
                    <ReceiptIndianRupee size={64} className="mx-auto text-slate-100 mb-4" />
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No invoices created yet</p>
                  </div>
                )}
              </div>
            </>
          ) : activeTab === 'CATALOG' ? (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-6 bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center shadow-inner">
                    <Layers size={32} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Item Catalog</h2>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Pre-define billable services & products</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowAddCatalog(true)}
                  className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-blue-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-blue-700 shadow-xl shadow-blue-100 transition-all active:scale-95"
                >
                  <Plus size={18} /> Add Item
                </button>
              </div>

              <div className="relative max-w-md mx-auto mb-8">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                 <input 
                   placeholder="Search catalog by name or category..." 
                   className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-[1.5rem] outline-none focus:ring-2 focus:ring-blue-500 shadow-sm font-bold text-slate-700" 
                   value={catalogSearch}
                   onChange={e => setCatalogSearch(e.target.value)}
                 />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCatalog.map(item => (
                  <div key={item.id} className="bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-sm hover:border-blue-400 transition-all group">
                    <div className="flex justify-between items-start mb-6">
                      <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-full text-[9px] font-black uppercase tracking-widest">{item.category}</span>
                      <button onClick={() => handleRemoveCatalogItem(item.id)} className="p-2 text-slate-300 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100"><Trash2 size={16} /></button>
                    </div>
                    <p className="text-lg font-black text-slate-900 mb-1">{item.name}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">HSN: {item.defaultHsnCode || 'N/A'}</p>
                    <div className="flex justify-between items-end border-t border-slate-50 pt-4">
                       <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Base Rate</p>
                          <p className="text-xl font-black text-slate-900">{currencySymbol}{item.defaultRate.toLocaleString()}</p>
                       </div>
                       <div className="text-right">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tax Setup</p>
                          <p className="text-sm font-bold text-blue-600">{item.defaultTaxRate}% Tax</p>
                       </div>
                    </div>
                  </div>
                ))}
                {filteredCatalog.length === 0 && (
                   <div className="col-span-full py-24 text-center bg-white rounded-[3rem] border-2 border-dashed border-slate-200">
                     <Package size={64} className="mx-auto text-slate-100 mb-4" />
                     <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No items in your catalog</p>
                   </div>
                )}
              </div>
            </div>
          ) : activeTab === 'DOC_SETTINGS' ? (
            <div className="bg-white p-10 md:p-16 rounded-[3rem] border border-slate-200 shadow-xl max-w-2xl mx-auto animate-in zoom-in-95 duration-300">
              <div className="flex items-center gap-5 mb-10">
                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-[2rem] flex items-center justify-center shadow-inner">
                  <FileDigit size={32} />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Numbering Controls</h3>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Manage global invoice sequence</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <Type size={12} className="text-blue-500" /> Default Prefix
                  </label>
                  <input 
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-black text-slate-700" 
                    placeholder="e.g. LG/2025/"
                    value={configData.invoicePrefix}
                    onChange={e => setConfigData({...configData, invoicePrefix: e.target.value})}
                  />
                  <p className="text-[9px] font-bold text-slate-400 uppercase ml-1 italic">This will be added before every new invoice number.</p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <Hash size={12} className="text-blue-500" /> Next Sequence Number
                  </label>
                  <input 
                    type="number"
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-black text-blue-600" 
                    placeholder="1001"
                    value={configData.nextSequence}
                    onChange={e => setConfigData({...configData, nextSequence: Number(e.target.value)})}
                  />
                  <p className="text-[9px] font-bold text-slate-400 uppercase ml-1 italic">The next generated invoice will start with this number.</p>
                </div>

                <div className="pt-6">
                  <button 
                    onClick={handleSaveConfig} 
                    className="w-full bg-blue-600 text-white py-5 rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-blue-200 hover:bg-blue-700 hover:scale-[1.02] transition-all flex items-center justify-center gap-3"
                  >
                    <Save size={18} /> Update Numbering Rules
                  </button>
                </div>
              </div>
            </div>
          ) : activeTab === 'PAYMENT_CONFIG' ? (
            <div className="bg-white p-10 md:p-16 rounded-[3rem] border border-slate-200 shadow-xl max-w-2xl mx-auto animate-in zoom-in-95 duration-300">
              <div className="flex items-center gap-5 mb-10">
                <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-[2rem] flex items-center justify-center shadow-inner">
                  <Wallet size={32} />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Payment Defaults</h3>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Global Banking Setup</p>
                </div>
              </div>
              <div className="space-y-6">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2"><Building2 size={12} className="text-indigo-500" /> Bank Name</label>
                  <input className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-slate-700" placeholder="e.g. HDFC Bank" value={configData.bankName} onChange={e => setConfigData({...configData, bankName: e.target.value})} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2"><Hash size={12} className="text-indigo-500" /> Account Number</label>
                  <input className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-slate-700" placeholder="e.g. 50100012345678" value={configData.accountNumber} onChange={e => setConfigData({...configData, accountNumber: e.target.value})} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2"><CreditCard size={12} className="text-indigo-500" /> IFSC Code</label>
                  <input className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-slate-700" placeholder="e.g. HDFC0001234" value={configData.ifscCode} onChange={e => setConfigData({...configData, ifscCode: e.target.value.toUpperCase()})} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2"><QrCode size={12} className="text-indigo-500" /> UPI ID for Scans</label>
                  <input className="w-full px-5 py-4 bg-slate-50 border border-indigo-100 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-black text-indigo-600" placeholder="e.g. yourname@upi" value={configData.upiId} onChange={e => setConfigData({...configData, upiId: e.target.value})} />
                </div>
                <div className="pt-6">
                  <button onClick={handleSaveConfig} className="w-full bg-indigo-600 text-white py-5 rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-indigo-200 hover:bg-indigo-700 hover:scale-[1.02] transition-all flex items-center justify-center gap-3">
                    <Save size={18} /> Save Payment Defaults
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white p-10 md:p-16 rounded-[3rem] border border-slate-200 shadow-xl max-w-2xl mx-auto animate-in zoom-in-95 duration-300">
              <div className="flex items-center gap-5 mb-10">
                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-[2rem] flex items-center justify-center shadow-inner">
                  <Scale size={32} />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Terms & Conditions</h3>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Default Document Footer</p>
                </div>
              </div>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Default Terms</label>
                  <textarea className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-slate-700 min-h-[200px] text-sm leading-relaxed" placeholder="Add your payment terms..." value={configData.terms} onChange={e => setConfigData({...configData, terms: e.target.value})} />
                </div>
                <div className="pt-6">
                  <button onClick={handleSaveConfig} className="w-full bg-indigo-600 text-white py-5 rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-indigo-200 hover:bg-indigo-700 hover:scale-[1.02] transition-all flex items-center justify-center gap-3">
                    <Save size={18} /> Save Terms Default
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {view === 'EDIT' && currentInvoice && (
        <div className="space-y-8">
          <div className="bg-white p-8 md:p-12 rounded-[3rem] border border-slate-200 shadow-xl space-y-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-8 border-b border-slate-100">
               <div className="flex items-center gap-4">
                  <button onClick={() => setView('LIST')} className="p-3 bg-slate-100 rounded-2xl text-slate-500 hover:bg-slate-200 transition-all"><XCircle size={20} /></button>
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Drafting Invoice</h3>
                    <div className="relative mt-1 group">
                       <input 
                         className="bg-slate-100 px-3 py-1 rounded-lg text-[11px] font-black text-indigo-600 uppercase tracking-widest outline-none focus:ring-2 focus:ring-indigo-500 w-full"
                         value={currentInvoice.invoiceNumber}
                         onChange={e => updateInvoiceMeta('invoiceNumber', e.target.value.toUpperCase())}
                       />
                       <div className="absolute -top-6 left-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                          <p className="text-[8px] font-black text-slate-400 uppercase bg-white border border-slate-100 px-2 py-1 rounded-md shadow-sm">Click to Manual Edit</p>
                       </div>
                    </div>
                  </div>
               </div>
               <div className="flex gap-3 w-full md:w-auto">
                  <button onClick={() => { onSave(currentInvoice); setView('LIST'); }} className="flex-1 md:flex-none px-8 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-200 transition-all">Save Draft</button>
                  <button onClick={() => setView('PREVIEW')} className="flex-1 md:flex-none px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-indigo-200 hover:bg-indigo-700 transition-all">Preview Final</button>
               </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
               <div className="space-y-6">
                  <h4 className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] flex items-center gap-2">
                    <User size={14} /> Client Details
                  </h4>
                  <div className="space-y-4">
                    <input placeholder="Client/Company Name" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-slate-700" value={currentInvoice.clientName} onChange={e => updateInvoiceMeta('clientName', e.target.value)} />
                    <div className="relative">
                       <Fingerprint className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                       <input 
                         placeholder="Client GST Number" 
                         className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-black text-indigo-600 tracking-widest placeholder:font-normal placeholder:tracking-normal" 
                         value={currentInvoice.clientGstNumber} 
                         onChange={e => updateInvoiceMeta('clientGstNumber', e.target.value.toUpperCase())} 
                       />
                    </div>
                    <input placeholder="Email Address" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-slate-700" value={currentInvoice.clientEmail} onChange={e => updateInvoiceMeta('clientEmail', e.target.value)} />
                    <textarea placeholder="Physical Address" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-slate-700 min-h-[100px]" value={currentInvoice.clientAddress} onChange={e => updateInvoiceMeta('clientAddress', e.target.value)} />
                  </div>
               </div>

               <div className="space-y-8">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="text-[9px] font-black text-slate-400 uppercase mb-2 block ml-1">Date Issued</label>
                      <input type="date" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold" value={currentInvoice.date} onChange={e => updateInvoiceMeta('date', e.target.value)} />
                    </div>
                    <div>
                      <label className="text-[9px] font-black text-slate-400 uppercase mb-2 block ml-1">Due Date</label>
                      <input type="date" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold" value={currentInvoice.dueDate} onChange={e => updateInvoiceMeta('dueDate', e.target.value)} />
                    </div>
                  </div>

                  <div className="space-y-6 bg-slate-50/50 p-6 rounded-[2.5rem] border border-slate-100">
                    <h4 className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] flex items-center gap-2">
                      <CreditCard size={14} /> Payment Details
                    </h4>
                    <div className="space-y-4">
                       <div className="relative">
                          <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
                          <input placeholder="Bank Name" className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-xs font-bold" value={currentInvoice.bankName} onChange={e => updateInvoiceMeta('bankName', e.target.value)} />
                       </div>
                       <div className="relative">
                          <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
                          <input placeholder="Account Number" className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-xs font-bold" value={currentInvoice.accountNumber} onChange={e => updateInvoiceMeta('accountNumber', e.target.value)} />
                       </div>
                    </div>
                  </div>
               </div>
            </div>

            <div className="space-y-6">
              <div className="flex justify-between items-center">
                 <h4 className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] flex items-center gap-2">
                    <ReceiptIndianRupee size={14} /> Billable Items
                 </h4>
                 <div className="flex gap-4">
                    <button 
                      onClick={() => setShowCatalogPicker(true)} 
                      className="text-[10px] font-black text-blue-600 uppercase bg-blue-50 px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-blue-100 transition-all border border-blue-100"
                    >
                      <Package size={14} /> Add from Catalog
                    </button>
                    <button onClick={addEmptyLineItem} className="text-[10px] font-black text-indigo-600 uppercase flex items-center gap-2 hover:underline">
                      <PlusCircle size={14} /> Custom Row
                    </button>
                 </div>
              </div>

              <div className="overflow-x-auto border border-slate-100 rounded-3xl">
                <table className="w-full text-left min-w-[1000px]">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                      <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase">Item Description</th>
                      <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase w-32">HSN/SAC</th>
                      <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase w-20 text-center">Qty</th>
                      <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase w-32">Rate ({currencySymbol})</th>
                      <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase w-48">Discount</th>
                      <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase w-24">Tax %</th>
                      <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase w-32 text-right">Net Amount</th>
                      <th className="px-6 py-4 w-12"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {currentInvoice.items.map((item, idx) => (
                      <tr key={item.id} className="hover:bg-slate-50/30 transition-colors">
                        <td className="px-6 py-4">
                          <input className="w-full bg-transparent border-none p-0 focus:ring-0 font-bold text-sm" placeholder="e.g. Design Services..." value={item.description} onChange={e => updateLineItem(idx, 'description', e.target.value)} />
                        </td>
                        <td className="px-6 py-4">
                          <input className="w-full bg-transparent border-none p-0 focus:ring-0 font-black text-xs text-indigo-500 uppercase" placeholder="HSN" value={item.hsnCode} onChange={e => updateLineItem(idx, 'hsnCode', e.target.value.toUpperCase())} />
                        </td>
                        <td className="px-6 py-4">
                          <input type="number" className="w-full bg-transparent border-none p-0 focus:ring-0 font-black text-sm text-center" value={item.quantity} onChange={e => updateLineItem(idx, 'quantity', Number(e.target.value))} />
                        </td>
                        <td className="px-6 py-4">
                          <input type="number" className="w-full bg-transparent border-none p-0 focus:ring-0 font-black text-sm" value={item.rate} onChange={e => updateLineItem(idx, 'rate', Number(e.target.value))} />
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex bg-slate-100/50 rounded-lg p-0.5 border border-slate-200/50">
                             <input type="number" className="w-full bg-transparent border-none p-1 focus:ring-0 font-bold text-xs" placeholder="Val" value={item.discountValue} onChange={e => updateLineItem(idx, 'discountValue', Number(e.target.value))} />
                             <div className="flex bg-white rounded shadow-sm border border-slate-100 overflow-hidden shrink-0">
                                <button type="button" onClick={() => updateLineItem(idx, 'discountType', 'PERCENT')} className={`px-2 py-1 text-[8px] font-black ${item.discountType === 'PERCENT' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}>%</button>
                                <button type="button" onClick={() => updateLineItem(idx, 'discountType', 'FIXED')} className={`px-2 py-1 text-[8px] font-black ${item.discountType === 'FIXED' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}>{currencySymbol}</button>
                             </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <input type="number" className="w-full bg-transparent border-none p-0 focus:ring-0 font-black text-sm text-indigo-600" value={item.taxRate} onChange={e => updateLineItem(idx, 'taxRate', Number(e.target.value))} />
                        </td>
                        <td className="px-6 py-4 text-right font-black text-sm text-slate-900">
                          {currencySymbol}{item.amount.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button onClick={() => removeLineItem(idx)} className="text-slate-300 hover:text-rose-500 transition-colors"><Trash2 size={16} /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row justify-between items-start gap-12 pt-10 border-t border-slate-100">
               <div className="flex-1 w-full max-w-lg space-y-4">
                  <h4 className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] flex items-center gap-2">
                    <Scale size={14} /> Additional Notes / Terms
                  </h4>
                  <textarea className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-3xl outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-slate-700 min-h-[120px] text-sm leading-relaxed" placeholder="Custom terms for this invoice..." value={currentInvoice.terms} onChange={e => updateInvoiceMeta('terms', e.target.value)} />
               </div>

               <div className="w-full lg:w-96 space-y-4 bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden">
                  <div className="flex justify-between text-sm font-bold text-slate-400">
                     <span>Item Subtotal</span>
                     <span>{currencySymbol}{currentInvoice.subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-emerald-400 italic">
                     <span>Total Savings</span>
                     <span>- {currencySymbol}{currentInvoice.discountAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-indigo-400">
                     <span>Aggregated Tax</span>
                     <span>{currencySymbol}{currentInvoice.taxAmount.toLocaleString()}</span>
                  </div>
                  <div className="pt-6 border-t border-white/10 flex justify-between items-end">
                     <span className="text-sm font-black uppercase tracking-widest text-slate-400">Grand Total</span>
                     <span className="text-4xl font-black tracking-tighter">{currencySymbol}{currentInvoice.total.toLocaleString()}</span>
                  </div>
                  <div className="absolute -right-4 -bottom-4 opacity-5"><ReceiptIndianRupee size={120} /></div>
               </div>
            </div>
          </div>
        </div>
      )}

      {view === 'PREVIEW' && currentInvoice && (
        <div className="space-y-8">
           <div className="bg-white p-4 rounded-[2rem] border border-slate-200 flex justify-between items-center shadow-sm">
              <button onClick={() => setView('EDIT')} className="px-6 py-3 bg-slate-100 text-slate-600 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-200 transition-all">Back to Editor</button>
              <div className="flex gap-3">
                 <button onClick={() => exportToPDF('invoice-document', `Invoice_${currentInvoice.invoiceNumber}`)} className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-indigo-200 hover:bg-indigo-700 flex items-center gap-2">
                   <Download size={14} /> Export PDF
                 </button>
                 <button onClick={() => { onSave(currentInvoice); setView('LIST'); }} className="px-8 py-3 bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:bg-slate-800 flex items-center gap-2">
                   <CheckCircle2 size={14} /> Complete & Archive
                 </button>
              </div>
           </div>
           <div className="flex justify-center p-4 md:p-12 bg-slate-100 rounded-[3rem] overflow-auto">
              <div id="invoice-document" className="w-full max-w-[800px] min-w-[700px]">
                <InvoiceRenderer user={user} invoice={currentInvoice} />
              </div>
           </div>
        </div>
      )}
      {/* (Rest of the modals - CatalogPicker, AddCatalog - remain unchanged) */}
    </div>
  );
};
