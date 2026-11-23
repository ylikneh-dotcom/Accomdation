import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { Property } from '../../types';
import { DashboardLayout, TaskListItem } from '../../components/layout/DashboardLayout';
import {
  getBilingual,
  formatCategory,
  formatCondition
} from '../../utils/translationUtils';
import { 
  Package, 
  Plus, 
  Search, 
  Download, 
  RefreshCw, 
  AlertTriangle, 
  CheckCircle, 
  Building, 
  Wrench,
  Tag
} from 'lucide-react';

export const PropertyDashboard: React.FC = () => {
  const { 
    properties, 
    addProperty, 
    updatePropertyCondition, 
    transferProperty 
  } = useAuth();
  const { language, t } = useLanguage();

  // Search & Filters
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [conditionFilter, setConditionFilter] = useState('ALL');

  // Register Property Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [category, setCategory] = useState<Property['category']>('FURNITURE');
  const [buildingType, setBuildingType] = useState<Property['buildingType']>('DORMITORY');
  const [buildingName, setBuildingName] = useState('Block 45 - Tewodros Hall');
  const [roomNumber, setRoomNumber] = useState('Room 101');
  const [serialNumber, setSerialNumber] = useState('');
  const [condition, setCondition] = useState<Property['condition']>('EXCELLENT');
  const [assignedTo, setAssignedTo] = useState('');

  // Transfer Property Modal
  const [transferTarget, setTransferTarget] = useState<Property | null>(null);
  const [newBuilding, setNewBuilding] = useState('');
  const [newRoom, setNewRoom] = useState('');
  const [transferSuccess, setTransferSuccess] = useState('');

  const filteredProperties = properties.filter(p => {
    const matchesSearch = 
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.propertyCode.toLowerCase().includes(search.toLowerCase()) ||
      p.buildingName.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === 'ALL' || p.category === categoryFilter;
    const matchesCondition = conditionFilter === 'ALL' || p.condition === conditionFilter;
    return matchesSearch && matchesCategory && matchesCondition;
  });

  const totalCount = properties.length;
  const goodCount = properties.filter(p => p.condition === 'EXCELLENT' || p.condition === 'GOOD').length;
  const repairCount = properties.filter(p => p.condition === 'NEEDS_REPAIR').length;
  const damagedCount = properties.filter(p => p.condition === 'DAMAGED' || p.condition === 'MISSING').length;

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const code = `WU-PROP-2024-${String(properties.length + 1).padStart(3, '0')}`;
    addProperty({
      propertyCode: code,
      name,
      category,
      buildingType,
      buildingName,
      roomNumber,
      purchaseDate: new Date().toISOString().split('T')[0],
      condition,
      serialNumber: serialNumber || `SN-${Date.now()}`,
      assignedTo
    });

    setShowAddModal(false);
    setName('');
    setSerialNumber('');
    setAssignedTo('');
  };

  const handleTransferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!transferTarget || !newBuilding || !newRoom) return;

    transferProperty(transferTarget.id, newBuilding, newRoom);
    setTransferSuccess(
      language === 'am' 
        ? `ንብረት ${transferTarget.propertyCode} ወደ ${newBuilding} (${newRoom}) ተዛውሯል!`
        : `Transferred ${transferTarget.propertyCode} to ${newBuilding} (${newRoom})`
    );
    setTimeout(() => {
      setTransferTarget(null);
      setTransferSuccess('');
    }, 2500);
  };

  const exportInventory = () => {
    const headers = 'Property Code,Name,Category,Building,Room,Condition,Purchase Date,Assigned To\n';
    const rows = properties.map(p => 
      `"${p.propertyCode}","${p.name}","${p.category}","${p.buildingName}","${p.roomNumber}","${p.condition}","${p.purchaseDate}","${p.assignedTo || ''}"`
    ).join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `wachemo_property_inventory_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const propertyTaskLists: TaskListItem[] = [
    {
      id: 'inventory',
      label: 'Asset Inventory',
      amharicLabel: 'የቋሚ ንብረት ዝርዝር',
      icon: Package,
      badge: `${properties.length} Items`,
      hasChevron: true
    },
    {
      id: 'add',
      label: 'Register New Asset',
      amharicLabel: 'አዲስ ንብረት መዝግብ',
      icon: Plus,
      hasChevron: true
    },
    {
      id: 'locations',
      label: 'Building Locations',
      amharicLabel: 'የህንፃዎች መገኛ',
      icon: Building,
      badge: 'Active',
      badgeColor: 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
    }
  ];

  const [activeTab, setActiveTab] = useState<'inventory' | 'add' | 'locations'>('inventory');

  return (
    <DashboardLayout
      activeTab={activeTab}
      onTabChange={(tab) => {
        if (tab === 'add') {
          setShowAddModal(true);
        } else {
          setActiveTab(tab as any);
        }
      }}
      taskLists={propertyTaskLists}
      bannerImage="/assets/images/dormitory_blocks.jpg"
    >
      <div className="space-y-6 animate-in fade-in">
      {/* Top Banner */}
      <div className="rounded-2xl border border-purple-200 dark:border-purple-500/30 bg-gradient-to-r from-purple-50 via-white to-purple-50 dark:from-slate-900 dark:via-[#180F28] dark:to-slate-900 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center space-x-4">
          <div className="p-3.5 bg-purple-100 dark:bg-purple-950 border border-purple-300 dark:border-purple-500/40 rounded-2xl text-purple-700 dark:text-purple-400">
            <Package className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                {language === 'am' ? 'የዩኒቨርሲቲው ቋሚ ንብረት አስተዳደር' : 'University Property & Fixed Assets Console'}
              </h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-500/30">
                {language === 'am' ? 'የንብረት መዝገብ' : 'INVENTORY REGISTRY'}
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
              {language === 'am'
                ? 'የንብረት ቁጥጥር፣ የቦታ ዝውውር እና የሁኔታ ክትትል በዶርሞች፣ በላቦራቶሪዎችና በመማሪያ ክፍሎች ውስጥ::'
                : 'Asset tracking, location transfers, and condition monitoring across dormitories, laboratories, and lecture halls.'}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-3.5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl text-xs flex items-center space-x-1.5 transition shadow-sm cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{language === 'am' ? 'አዲስ ንብረት መዝግብ' : 'Register New Asset'}</span>
          </button>

          <button
            onClick={exportInventory}
            className="px-3 py-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-xl flex items-center space-x-1.5 transition shadow-sm cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
            <span>{language === 'am' ? 'ወደ CSV ላክ' : 'Export CSV'}</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Inventory Registry */}
      {activeTab === 'inventory' && (
        <div className="space-y-6 animate-in fade-in">
          {/* KPI Counters */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
                {language === 'am' ? 'ጠቅላላ የተመዘገቡ ንብረቶች' : 'Total Registered Assets'}
              </div>
              <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">{totalCount}</div>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
                {language === 'am' ? 'በጥሩ ሁኔታ ላይ ያሉ' : 'Good / Prime Condition'}
              </div>
              <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">{goodCount}</div>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
                {language === 'am' ? 'ጥገና የሚያስፈልጋቸው' : 'Requires Repair'}
              </div>
              <div className="text-2xl font-extrabold text-amber-500 mt-1">{repairCount}</div>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
                {language === 'am' ? 'የተበላሸ / የጠፋ' : 'Damaged / Missing'}
              </div>
              <div className="text-2xl font-extrabold text-red-500 mt-1">{damagedCount}</div>
            </div>
          </div>

          {/* Filter and Search Bar */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-sm">
            <div className="flex flex-1 items-center space-x-3">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={language === 'am' ? 'በኮድ፣ በስም ወይም በህንጻ ፈልግ...' : 'Search by code, item name, or building...'}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-purple-500"
                />
              </div>

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
              >
                <option value="ALL">{language === 'am' ? 'ሁሉም ምድቦች' : 'All Categories'}</option>
                <option value="DORM_BED">{formatCategory(language, 'DORM_BED')}</option>
                <option value="FURNITURE">{formatCategory(language, 'FURNITURE')}</option>
                <option value="ELECTRONICS">{formatCategory(language, 'ELECTRONICS')}</option>
                <option value="LABORATORY">{formatCategory(language, 'LABORATORY')}</option>
              </select>

              <select
                value={conditionFilter}
                onChange={(e) => setConditionFilter(e.target.value)}
                className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
              >
                <option value="ALL">{language === 'am' ? 'ሁሉም ሁኔታዎች' : 'All Conditions'}</option>
                <option value="EXCELLENT">{formatCondition(language, 'EXCELLENT')}</option>
                <option value="GOOD">{formatCondition(language, 'GOOD')}</option>
                <option value="NEEDS_REPAIR">{formatCondition(language, 'NEEDS_REPAIR')}</option>
                <option value="DAMAGED">{formatCondition(language, 'DAMAGED')}</option>
              </select>
            </div>

            <div className="text-xs text-slate-500 dark:text-slate-400 font-mono font-bold">
              {language === 'am' ? `${filteredProperties.length} ንብረቶች ተገኝተዋል` : `${filteredProperties.length} Assets Found`}
            </div>
          </div>

          {/* Properties Table */}
          <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 shadow-sm">
            <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 font-mono text-[10px] uppercase border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4">{language === 'am' ? 'የንብረት ኮድ' : 'Property Code'}</th>
                  <th className="py-3 px-4">{language === 'am' ? 'የእቃው ስም' : 'Item Name'}</th>
                  <th className="py-3 px-4">{language === 'am' ? 'ምድብ' : 'Category'}</th>
                  <th className="py-3 px-4">{language === 'am' ? 'የአሁን ቦታ' : 'Current Location'}</th>
                  <th className="py-3 px-4">{language === 'am' ? 'ሁኔታ' : 'Condition'}</th>
                  <th className="py-3 px-4">{language === 'am' ? 'ኃላፊ / ተጠቃሚ' : 'Assigned To'}</th>
                  <th className="py-3 px-4 text-right">{language === 'am' ? 'እርምጃዎች' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {filteredProperties.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                    <td className="py-3 px-4 font-mono font-bold text-purple-700 dark:text-purple-300">
                      {p.propertyCode}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                      {p.name}
                      {p.serialNumber && (
                        <div className="text-[10px] text-slate-400 font-mono">SN: {p.serialNumber}</div>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {formatCategory(language, p.category)}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div>{p.buildingName}</div>
                      <div className="text-[10px] text-slate-400">{p.roomNumber}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        p.condition === 'EXCELLENT' ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300' :
                        p.condition === 'GOOD' ? 'bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300' :
                        p.condition === 'NEEDS_REPAIR' ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300' :
                        'bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-300'
                      }`}>
                        {formatCondition(language, p.condition)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                      {p.assignedTo || '-'}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setTransferTarget(p)}
                        className="px-2.5 py-1 bg-purple-50 hover:bg-purple-100 text-purple-700 dark:bg-purple-950 dark:hover:bg-purple-900 dark:text-purple-300 rounded-lg text-[11px] font-semibold border border-purple-200 dark:border-purple-800 transition cursor-pointer"
                      >
                        {language === 'am' ? 'አዘዋውር' : 'Transfer'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Campus Buildings & Property Locations */}
      {activeTab === 'locations' && (
        <div className="space-y-6 animate-in fade-in max-w-5xl mx-auto">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400">
                <Building className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  {language === 'am' ? 'የህንፃዎችና ክፍሎች የንብረት ስርጭት' : 'Campus Buildings & Asset Location Distribution'}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {language === 'am' ? 'ንብረቶች በተመደቡባቸው ህንፃዎችና ወለሎች የተደራጁበት ካርታ' : 'Audited property counts mapped across student dormitories and academic facilities.'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
              {[
                { name: 'Block 45 - Tewodros Hall (Men)', amharic: 'ብሎክ 45 - ቴዎድሮስ አዳራሽ (ወንዶች)', items: 340, good: 310, repair: 25, damaged: 5 },
                { name: 'Block 46 - Taytu Hall (Women)', amharic: 'ብሎክ 46 - ጣይቱ አዳራሽ (ሴቶች)', items: 320, good: 298, repair: 18, damaged: 4 },
                { name: 'Main Campus Central Library', amharic: 'የዋና ግቢ ማዕከላዊ ቤተ-መጽሐፍት', items: 185, good: 175, repair: 8, damaged: 2 },
                { name: 'Technology & ICT Engineering Labs', amharic: 'የቴክኖሎጂና አይሲቲ ላቦራቶሪዎች', items: 210, good: 195, repair: 12, damaged: 3 },
                { name: 'Administrative Building & Proctor Offices', amharic: 'የአስተዳደር ህንጻና የፕሮክተር ቢሮዎች', items: 95, good: 90, repair: 4, damaged: 1 }
              ].map((loc, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900 dark:text-white leading-tight">
                      {language === 'am' ? loc.amharic : loc.name}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                      {loc.items} {language === 'am' ? 'እቃዎች' : 'Items'}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
                    <div className="p-1.5 bg-emerald-50 dark:bg-emerald-950/60 rounded border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300">
                      <div className="font-bold">{loc.good}</div>
                      <div>{language === 'am' ? 'ጥሩ' : 'Good'}</div>
                    </div>
                    <div className="p-1.5 bg-amber-50 dark:bg-amber-950/60 rounded border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300">
                      <div className="font-bold">{loc.repair}</div>
                      <div>{language === 'am' ? 'ጥገና' : 'Repair'}</div>
                    </div>
                    <div className="p-1.5 bg-red-50 dark:bg-red-950/60 rounded border border-red-200 dark:border-red-800 text-red-800 dark:text-red-300">
                      <div className="font-bold">{loc.damaged}</div>
                      <div>{language === 'am' ? 'ብልሽት' : 'Damaged'}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Transfer Property Modal */}
      {transferTarget && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4 animate-in zoom-in-95">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <RefreshCw className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span>{language === 'am' ? `ንብረት አዘዋውር፡ ${transferTarget.propertyCode}` : `Transfer Property: ${transferTarget.propertyCode}`}</span>
            </h3>

            {transferSuccess && (
              <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs rounded">
                {transferSuccess}
              </div>
            )}

            <form onSubmit={handleTransferSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold">
                  {language === 'am' ? 'አዲስ ህንጻ *' : 'New Target Building *'}
                </label>
                <input
                  type="text"
                  placeholder="e.g. Block 46 - Taytu Hall"
                  value={newBuilding}
                  onChange={(e) => setNewBuilding(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold">
                  {language === 'am' ? 'አዲስ ክፍል / ቢሮ *' : 'New Room / Office Number *'}
                </label>
                <input
                  type="text"
                  placeholder="e.g. Room 204"
                  value={newRoom}
                  onChange={(e) => setNewRoom(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setTransferTarget(null)}
                  className="px-3 py-1.5 bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded text-xs cursor-pointer"
                >
                  {language === 'am' ? 'ሰርዝ' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded text-xs cursor-pointer"
                >
                  {language === 'am' ? 'ዝውውሩን አጽድቅ' : 'Execute Transfer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Register Property Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4 animate-in zoom-in-95">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <Plus className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span>{language === 'am' ? 'አዲስ የዩኒቨርሲቲ ቋሚ ንብረት መዝግብ' : 'Register New University Asset'}</span>
            </h3>

            <form onSubmit={handleAddSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold">
                  {language === 'am' ? 'የንብረቱ ስም *' : 'Asset Item Name *'}
                </label>
                <input
                  type="text"
                  placeholder="e.g. Wooden Study Desk Double Drawer"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold">
                    {language === 'am' ? 'ምድብ' : 'Category'}
                  </label>
                  <select
                    value={category}
                    onChange={(e: any) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded text-slate-900 dark:text-white"
                  >
                    <option value="DORM_BED">{formatCategory(language, 'DORM_BED')}</option>
                    <option value="FURNITURE">{formatCategory(language, 'FURNITURE')}</option>
                    <option value="ELECTRONICS">{formatCategory(language, 'ELECTRONICS')}</option>
                    <option value="LABORATORY">{formatCategory(language, 'LABORATORY')}</option>
                    <option value="OFFICE">{formatCategory(language, 'OFFICE')}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold">
                    {language === 'am' ? 'ሁኔታ' : 'Condition'}
                  </label>
                  <select
                    value={condition}
                    onChange={(e: any) => setCondition(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded text-slate-900 dark:text-white"
                  >
                    <option value="EXCELLENT">{formatCondition(language, 'EXCELLENT')}</option>
                    <option value="GOOD">{formatCondition(language, 'GOOD')}</option>
                    <option value="NEEDS_REPAIR">{formatCondition(language, 'NEEDS_REPAIR')}</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold">
                    {language === 'am' ? 'ህንጻ' : 'Building'}
                  </label>
                  <input
                    type="text"
                    value={buildingName}
                    onChange={(e) => setBuildingName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold">
                    {language === 'am' ? 'ክፍል' : 'Room Number'}
                  </label>
                  <input
                    type="text"
                    value={roomNumber}
                    onChange={(e) => setRoomNumber(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded text-xs cursor-pointer"
                >
                  {language === 'am' ? 'ሰርዝ' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded text-xs cursor-pointer"
                >
                  {language === 'am' ? 'መዝግብ' : 'Register Asset'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      </div>
    </DashboardLayout>
  );
};
