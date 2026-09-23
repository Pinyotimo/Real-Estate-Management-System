import React, { useState } from 'react';
import {
  Home,
  Users,
  User,
  Phone,
  Mail,
  MapPin,
  DollarSign,
  CheckCircle,
  XCircle,
  Search,
  Plus,
  Trash2,
  Building,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import Card from '../common/Card';
import Badge from '../common/Badge';
import Button from '../common/Button';
// ✅ FIX: Use named imports from Form.jsx (not default)
import { Input, Select } from '../common/Form';

const OccupancyTab = ({
  properties = [],
  registeredTenants = [],
  selectedTenantMap = {},
  onAssignTenant,
  onUnassignTenant,
  onSelectTenant,
  loading = false,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [expandedProperty, setExpandedProperty] = useState(null);

  // Filter properties
  const filteredProperties = properties.filter((property) => {
    const matchesSearch =
      property.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.estate?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.county?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.tenantName?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === 'all' ? true :
      filterStatus === 'occupied' ? property.status === 'occupied' :
      property.status !== 'occupied';

    return matchesSearch && matchesStatus;
  });

  // Calculate statistics
  const totalProperties = properties.length;
  const occupiedUnits = properties.filter(p => p.status === 'occupied').length;
  const vacantUnits = totalProperties - occupiedUnits;
  const occupancyRate = totalProperties > 0 ? Math.round((occupiedUnits / totalProperties) * 100) : 0;

  // Get tenant details
  const getTenantDetails = (tenantId) => {
    return registeredTenants.find(t => t._id === tenantId);
  };

  // Handle assign tenant
  const handleAssign = (propertyId) => {
    const tenantId = selectedTenantMap[propertyId];
    if (!tenantId) {
      alert('Please select a tenant first');
      return;
    }
    onAssignTenant(propertyId);
  };

  // Toggle property expansion
  const toggleExpand = (propertyId) => {
    setExpandedProperty(expandedProperty === propertyId ? null : propertyId);
  };

  // Status filter options
  const statusOptions = [
    { value: 'all', label: 'All Properties' },
    { value: 'occupied', label: 'Occupied' },
    { value: 'vacant', label: 'Vacant' },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-text-primary">Property Occupancy</h2>
          <p className="text-sm text-text-muted">
            Manage tenant assignments for all your properties
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="success" size="sm">
            {occupiedUnits} Occupied
          </Badge>
          <Badge variant="warning" size="sm">
            {vacantUnits} Vacant
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
              <Building size={24} />
            </div>
          </div>
        </Card>

        <Card padding="normal" hover={false} className="border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-text-muted uppercase tracking-wider">Occupied</p>
              <p className="text-2xl font-bold text-green-600 mt-1">{occupiedUnits}</p>
            </div>
            <div className="p-3 rounded-lg bg-green-50 text-green-600">
              <CheckCircle size={24} />
            </div>
          </div>
        </Card>

        <Card padding="normal" hover={false} className="border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-text-muted uppercase tracking-wider">Vacant</p>
              <p className="text-2xl font-bold text-yellow-600 mt-1">{vacantUnits}</p>
            </div>
            <div className="p-3 rounded-lg bg-yellow-50 text-yellow-600">
              <XCircle size={24} />
            </div>
          </div>
        </Card>

        <Card padding="normal" hover={false} className="border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-text-muted uppercase tracking-wider">Occupancy Rate</p>
              <p className="text-2xl font-bold text-purple-600 mt-1">{occupancyRate}%</p>
            </div>
            <div className="p-3 rounded-lg bg-purple-50 text-purple-600">
              <Users size={24} />
            </div>
          </div>
        </Card>
      </div>

      {/* Occupancy Progress Bar */}
      <Card padding="normal" hover={false}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-text-primary">Occupancy Rate</span>
          <span className="text-sm font-bold text-brand-blue">{occupancyRate}%</span>
        </div>
        <div className="w-full h-3 bg-surface-soft rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-brand-blue to-brand-light-blue rounded-full transition-all duration-500"
            style={{ width: `${occupancyRate}%` }}
          />
        </div>
        <div className="flex justify-between mt-1 text-xs text-text-muted">
          <span>{occupiedUnits} occupied</span>
          <span>{vacantUnits} vacant</span>
        </div>
      </Card>

      {/* Search and Filters */}
      <Card padding="sm" hover={false}>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                type="text"
                placeholder="Search properties by title, location, or tenant..."
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} padding="normal">
              <div className="space-y-3">
                <div className="skeleton skeleton--heading w-3/4" />
                <div className="skeleton skeleton--text w-1/2" />
                <div className="skeleton skeleton--text w-1/3" />
                <div className="flex gap-2">
                  <div className="skeleton skeleton--text w-1/4" />
                  <div className="skeleton skeleton--text w-1/4" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : filteredProperties.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="text-6xl mb-4">🏠</div>
          <h4 className="text-lg font-semibold text-text-primary mb-2">
            {properties.length === 0 ? 'No Properties Yet' : 'No Matching Properties'}
          </h4>
          <p className="text-sm text-text-muted max-w-md">
            {properties.length === 0
              ? 'Add your first property to start managing occupancy and tenant assignments.'
              : 'No properties match your current search or filter criteria.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredProperties.map((property) => {
            const isOccupied = property.status === 'occupied';
            const selectedTenantId = selectedTenantMap[property._id] || '';
            const selectedTenant = getTenantDetails(selectedTenantId);
            const isExpanded = expandedProperty === property._id;

            return (
              <Card
                key={property._id}
                padding="normal"
                hover
                className={`transition-all duration-200 ${
                  isOccupied ? 'border-l-4 border-green-500' : 'border-l-4 border-yellow-500'
                }`}
              >
                {/* Property Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-base font-semibold text-text-primary truncate">
                        {property.title}
                      </h4>
                      <Badge variant="info" size="sm">
                        {property.houseType || 'Property'}
                      </Badge>
                    </div>
                    <p className="text-sm text-text-muted flex items-center gap-1 mt-0.5">
                      <MapPin size={14} />
                      {property.estate}, {property.county}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => toggleExpand(property._id)}
                    className="flex-shrink-0"
                  >
                    {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </Button>
                </div>

                {/* Property Details */}
                <div className="flex flex-wrap items-center gap-4 mt-3">
                  <span className="flex items-center gap-1.5 text-sm font-semibold text-text-primary">
                    <DollarSign size={16} className="text-text-muted" />
                    KES {property.price?.toLocaleString() || 0}/mo
                  </span>
                  <Badge variant={isOccupied ? 'success' : 'warning'}>
                    {isOccupied ? '✅ Occupied' : '📭 Vacant'}
                  </Badge>
                </div>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-border-light space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-xs text-text-muted">Property ID</p>
                        <p className="text-sm font-medium text-text-primary">
                          #{property._id?.slice(-6) || 'N/A'}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-text-muted">Type</p>
                        <p className="text-sm font-medium text-text-primary capitalize">
                          {property.houseType || 'Not specified'}
                        </p>
                      </div>
                      {property.size && (
                        <div>
                          <p className="text-xs text-text-muted">Size</p>
                          <p className="text-sm font-medium text-text-primary">
                            {property.size} sq ft
                          </p>
                        </div>
                      )}
                      {property.bedrooms && (
                        <div>
                          <p className="text-xs text-text-muted">Bedrooms</p>
                          <p className="text-sm font-medium text-text-primary">
                            {property.bedrooms}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Tenant Assignment Section */}
                <div className="mt-4 pt-4 border-t border-border-light">
                  {isOccupied ? (
                    // Occupied - Show tenant info
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-xs text-text-muted">Current Tenant</p>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="w-8 h-8 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-bold text-sm">
                              {property.tenantName?.charAt(0) || 'T'}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-text-primary">
                                {property.tenantName || 'Assigned Resident'}
                              </p>
                              {property.tenantPhone && (
                                <p className="text-xs text-text-muted flex items-center gap-1">
                                  <Phone size={12} />
                                  {property.tenantPhone}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="destructive"
                          icon={Trash2}
                          onClick={() => onUnassignTenant(property._id)}
                        >
                          Vacate Unit
                        </Button>
                      </div>
                    </div>
                  ) : (
                    // Vacant - Show assignment form
                    <div className="space-y-3">
                      <label className="text-sm font-medium text-text-primary">
                        Assign Registered Tenant
                      </label>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <div className="flex-1">
                          <select
                            value={selectedTenantId}
                            onChange={(e) => onSelectTenant(property._id, e.target.value)}
                            className="w-full px-3 py-2 text-sm border border-border rounded-md bg-surface focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all appearance-none"
                          >
                            <option value="">-- Select Tenant --</option>
                            {registeredTenants.map((tenant) => (
                              <option key={tenant._id} value={tenant._id}>
                                {tenant.name} ({tenant.email})
                              </option>
                            ))}
                          </select>
                        </div>
                        <Button
                          size="sm"
                          variant="success"
                          icon={Plus}
                          onClick={() => handleAssign(property._id)}
                          disabled={!selectedTenantId}
                          className="flex-shrink-0"
                        >
                          Assign
                        </Button>
                      </div>

                      {selectedTenantId && selectedTenant && (
                        <div className="p-2 bg-surface-soft rounded-md text-sm">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-brand-very-light-blue text-brand-blue flex items-center justify-center font-bold text-sm">
                              {selectedTenant.name?.charAt(0) || 'T'}
                            </div>
                            <div>
                              <p className="font-medium text-text-primary">{selectedTenant.name}</p>
                              <p className="text-xs text-text-muted flex items-center gap-2">
                                <Mail size={12} /> {selectedTenant.email}
                                {selectedTenant.phone && (
                                  <span className="flex items-center gap-1">
                                    <Phone size={12} /> {selectedTenant.phone}
                                  </span>
                                )}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Registered Tenants Count */}
                {!isOccupied && registeredTenants.length === 0 && (
                  <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded-md text-xs text-yellow-700">
                    No registered tenants available. Please add tenants first.
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}

      {/* Footer */}
      {filteredProperties.length > 0 && (
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
      )}
    </div>
  );
};

export default OccupancyTab;