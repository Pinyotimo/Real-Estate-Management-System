import React, { useState } from 'react';
import { 
  Wifi, 
  Zap, 
  Wrench, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  Edit,
  Save,
  X
} from 'lucide-react';
import Card from '../common/Card';
import Badge from '../common/Badge';
import Button from '../common/Button';
import { Input, Select } from '../common/Form';

const OperationsTab = ({ 
  properties = [], 
  onUpdateOperations,
  loading = false,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'pending', 'in_progress', 'completed'
  const [expandedProperty, setExpandedProperty] = useState(null);
  const [saving, setSaving] = useState({});

  // Filter properties
  const filteredProperties = properties.filter((property) => {
    const matchesSearch =
      property.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.electricityMeter?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter =
      filterStatus === 'all' ? true :
      property.repairStatus === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  // Calculate statistics
  const totalProperties = properties.length;
  const activeWifi = properties.filter(p => p.wifiStatus === 'active').length;
  const pendingRepairs = properties.filter(p => p.repairStatus === 'pending' || p.repairStatus === 'in_progress').length;
  const completedRepairs = properties.filter(p => p.repairStatus === 'completed').length;

  // Toggle property expansion
  const toggleExpand = (propertyId) => {
    setExpandedProperty(expandedProperty === propertyId ? null : propertyId);
  };

  // Handle form submission
  const handleSubmit = async (e, propertyId) => {
    e.preventDefault();
    setSaving(prev => ({ ...prev, [propertyId]: true }));
    
    try {
      await onUpdateOperations(e, propertyId);
      // Show success state briefly
      setTimeout(() => {
        setSaving(prev => ({ ...prev, [propertyId]: false }));
      }, 1000);
    } catch (error) {
      console.error('Error updating operations:', error);
      setSaving(prev => ({ ...prev, [propertyId]: false }));
    }
  };

  // Get repair status badge variant
  const getRepairBadge = (status) => {
    const variants = {
      none: 'default',
      pending: 'warning',
      in_progress: 'info',
      completed: 'success',
    };
    return variants[status] || 'default';
  };

  // Get WiFi status badge variant
  const getWifiBadge = (status) => {
    const variants = {
      active: 'success',
      disconnected: 'danger',
      pending: 'warning',
    };
    return variants[status] || 'default';
  };

  // Status filter options
  const statusOptions = [
    { value: 'all', label: 'All Properties' },
    { value: 'pending', label: 'Pending Repairs' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
  ];

  // WiFi status options
  const wifiOptions = [
    { value: 'active', label: 'Active' },
    { value: 'disconnected', label: 'Disconnected' },
    { value: 'pending', label: 'Pending' },
  ];

  // Repair status options
  const repairOptions = [
    { value: 'none', label: 'None' },
    { value: 'pending', label: 'Pending Request' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-text-primary">Operations Management</h2>
          <p className="text-sm text-text-muted">
            Manage electricity, WiFi, and repairs for all properties
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="success" size="sm">
            <Wifi size={12} className="mr-1" /> {activeWifi} WiFi Active
          </Badge>
          <Badge variant="warning" size="sm">
            <Wrench size={12} className="mr-1" /> {pendingRepairs} Repairs Pending
          </Badge>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card padding="normal" hover={false} className="border-l-4 border-brand-blue">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-text-muted uppercase tracking-wider">Total Properties</p>
              <p className="text-2xl font-bold text-text-primary mt-1">{totalProperties}</p>
            </div>
            <div className="p-3 rounded-lg bg-brand-very-light-blue text-brand-blue">
              <Zap size={24} />
            </div>
          </div>
        </Card>

        <Card padding="normal" hover={false} className="border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-text-muted uppercase tracking-wider">WiFi Active</p>
              <p className="text-2xl font-bold text-green-600 mt-1">{activeWifi}</p>
            </div>
            <div className="p-3 rounded-lg bg-green-50 text-green-600">
              <Wifi size={24} />
            </div>
          </div>
        </Card>

        <Card padding="normal" hover={false} className="border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-text-muted uppercase tracking-wider">Pending Repairs</p>
              <p className="text-2xl font-bold text-yellow-600 mt-1">{pendingRepairs}</p>
            </div>
            <div className="p-3 rounded-lg bg-yellow-50 text-yellow-600">
              <Clock size={24} />
            </div>
          </div>
        </Card>

        <Card padding="normal" hover={false} className="border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-text-muted uppercase tracking-wider">Repairs Completed</p>
              <p className="text-2xl font-bold text-purple-600 mt-1">{completedRepairs}</p>
            </div>
            <div className="p-3 rounded-lg bg-purple-50 text-purple-600">
              <CheckCircle size={24} />
            </div>
          </div>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card padding="sm" hover={false}>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                type="text"
                placeholder="Search properties by title or meter number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm border border-border rounded-md bg-surface focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all"
              />
            </div>
          </div>
          <div className="flex gap-1 p-1 bg-surface-soft rounded-md">
            {statusOptions.map((opt) => (
              <Button
                key={opt.value}
                size="sm"
                variant={filterStatus === opt.value ? 'primary' : 'ghost'}
                onClick={() => setFilterStatus(opt.value)}
                className={filterStatus === opt.value ? '' : 'hover:bg-surface-muted'}
              >
                {opt.label}
              </Button>
            ))}
          </div>
        </div>
      </Card>

      {/* Properties Grid */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} padding="normal">
              <div className="space-y-3">
                <div className="skeleton skeleton--heading w-1/3" />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {[...Array(4)].map((_, j) => (
                    <div key={j} className="space-y-2">
                      <div className="skeleton skeleton--text w-1/2" />
                      <div className="skeleton skeleton--text w-full h-10" />
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : filteredProperties.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="text-6xl mb-4">🔧</div>
          <h4 className="text-lg font-semibold text-text-primary mb-2">
            {properties.length === 0 ? 'No Properties Yet' : 'No Matching Properties'}
          </h4>
          <p className="text-sm text-text-muted max-w-md">
            {properties.length === 0
              ? 'Add your first property to start managing operations.'
              : 'No properties match your current search or filter criteria.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredProperties.map((property) => {
            const isExpanded = expandedProperty === property._id;
            const isSaving = saving[property._id];

            return (
              <Card
                key={property._id}
                padding="normal"
                hover
                className={`transition-all duration-200 ${
                  property.repairStatus === 'pending' ? 'border-l-4 border-yellow-500' :
                  property.repairStatus === 'in_progress' ? 'border-l-4 border-brand-blue' :
                  property.repairStatus === 'completed' ? 'border-l-4 border-green-500' :
                  'border-l-4 border-border'
                }`}
              >
                <form onSubmit={(e) => handleSubmit(e, property._id)}>
                  {/* Property Header */}
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3">
                        <h4 className="text-base font-semibold text-text-primary truncate">
                          {property.title}
                        </h4>
                        <Badge variant={getRepairBadge(property.repairStatus)} size="sm">
                          {property.repairStatus === 'none' ? '✅ Good' :
                           property.repairStatus === 'pending' ? '⚠️ Pending' :
                           property.repairStatus === 'in_progress' ? '🔄 In Progress' :
                           '✅ Completed'}
                        </Badge>
                        <Badge variant={getWifiBadge(property.wifiStatus)} size="sm">
                          <Wifi size={12} className="mr-1" />
                          {property.wifiStatus}
                        </Badge>
                      </div>
                      {property.electricityMeter && (
                        <p className="text-sm text-text-muted mt-0.5">
                          Meter: {property.electricityMeter}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Button
                        type="button"
                        size="sm"
                        variant={isSaving ? 'success' : 'primary'}
                        loading={isSaving}
                        icon={isSaving ? undefined : Save}
                        disabled={isSaving}
                        className="min-w-[80px]"
                      >
                        {isSaving ? 'Saving...' : 'Save'}
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => toggleExpand(property._id)}
                      >
                        {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                      </Button>
                    </div>
                  </div>

                  {/* Form Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                    <Input
                      label="Electricity Meter No"
                      name="electricityMeter"
                      defaultValue={property.electricityMeter || ''}
                      placeholder="Enter meter number"
                      icon={Zap}
                      size="sm"
                    />

                    <Select
                      label="WiFi Status"
                      name="wifiStatus"
                      options={wifiOptions}
                      defaultValue={property.wifiStatus || 'pending'}
                      size="sm"
                    />

                    <Select
                      label="Repair Status"
                      name="repairStatus"
                      options={repairOptions}
                      defaultValue={property.repairStatus || 'none'}
                      size="sm"
                    />

                    <Input
                      label="Repair Notes"
                      name="repairNotes"
                      defaultValue={property.repairNotes || ''}
                      placeholder="e.g., Fix kitchen tap"
                      icon={Wrench}
                      size="sm"
                    />
                  </div>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t border-border-light">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="p-3 bg-surface-soft rounded-md">
                          <p className="text-xs text-text-muted">Property ID</p>
                          <p className="text-sm font-medium text-text-primary">
                            #{property._id?.slice(-6) || 'N/A'}
                          </p>
                        </div>
                        <div className="p-3 bg-surface-soft rounded-md">
                          <p className="text-xs text-text-muted">Location</p>
                          <p className="text-sm font-medium text-text-primary">
                            {property.estate || 'N/A'}, {property.county || 'N/A'}
                          </p>
                        </div>
                        <div className="p-3 bg-surface-soft rounded-md">
                          <p className="text-xs text-text-muted">Last Updated</p>
                          <p className="text-sm font-medium text-text-primary">
                            {property.updatedAt ? new Date(property.updatedAt).toLocaleDateString() : 'N/A'}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </form>
              </Card>
            );
          })}

          {/* Footer */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
            <p className="text-xs text-text-muted">
              Showing {filteredProperties.length} of {properties.length} properties
            </p>
            <div className="flex items-center gap-3">
              {filterStatus !== 'all' && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setFilterStatus('all')}
                  className="text-xs"
                >
                  Clear Filter
                </Button>
              )}
              {searchTerm && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setSearchTerm('')}
                  className="text-xs"
                >
                  Clear Search
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OperationsTab;