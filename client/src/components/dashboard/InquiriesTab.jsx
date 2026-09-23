import React, { useState } from 'react';
import { 
  Mail, 
  User, 
  Phone, 
  Calendar, 
  MessageSquare, 
  Search, 
  CheckCircle, 
  X,
  Filter
} from 'lucide-react';
import Card from '../common/Card';
import Badge from '../common/Badge';
import Button from '../common/Button';
// ❌ Remove: import Input from '../common/Form/Input';

const InquiriesTab = ({ inquiries = [], loading = false }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all'); // 'all', 'read', 'unread'

  // Filter inquiries
  const filteredInquiries = inquiries.filter((inquiry) => {
    const matchesSearch =
      inquiry.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.message?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter =
      filter === 'all' ? true :
      filter === 'read' ? inquiry.isRead :
      !inquiry.isRead;
    
    return matchesSearch && matchesFilter;
  });

  // Format date
  const formatDate = (date) => {
    if (!date) return 'N/A';
    const now = new Date();
    const diff = now - new Date(date);
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return new Date(date).toLocaleDateString('en-KE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Get initials for avatar
  const getInitials = (name) => {
    return name
      ?.split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || '?';
  };

  // Status options
  const statusOptions = [
    { value: 'all', label: 'All' },
    { value: 'unread', label: 'Unread' },
    { value: 'read', label: 'Read' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-text-primary">Tenant Inquiries</h2>
          <p className="text-sm text-text-muted">
            Manage all messages from potential and current tenants
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="info" size="sm">
            {inquiries.filter((i) => !i.isRead).length} Unread
          </Badge>
          <Button size="sm" variant="outline" icon={CheckCircle}>
            Mark All Read
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card padding="sm" hover={false}>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                type="text"
                placeholder="Search by name, email, or message..."
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
                variant={filter === opt.value ? 'primary' : 'ghost'}
                onClick={() => setFilter(opt.value)}
                className={filter === opt.value ? '' : 'hover:bg-surface-muted'}
              >
                {opt.label}
              </Button>
            ))}
          </div>
        </div>
      </Card>

      {/* Inquiries List */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} padding="normal">
              <div className="flex items-start gap-4">
                <div className="skeleton skeleton--avatar" />
                <div className="flex-1 space-y-2">
                  <div className="skeleton skeleton--text w-1/3 h-4" />
                  <div className="skeleton skeleton--text w-2/3 h-3" />
                  <div className="skeleton skeleton--text w-1/2 h-3" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : filteredInquiries.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="text-6xl mb-4">📭</div>
          <h4 className="text-lg font-semibold text-text-primary mb-2">
            {inquiries.length === 0 ? 'No Inquiries Yet' : 'No Matching Inquiries'}
          </h4>
          <p className="text-sm text-text-muted max-w-md">
            {inquiries.length === 0
              ? 'Tenant inquiries will appear here once they reach out about your properties.'
              : 'No inquiries match your current search or filter criteria.'}
          </p>
          {inquiries.length === 0 && (
            <p className="text-xs text-text-muted mt-4">
              Share your property listings to start receiving inquiries.
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredInquiries.map((inquiry) => (
            <Card
              key={inquiry._id || inquiry.id}
              padding="normal"
              hover
              className={`transition-all duration-200 ${
                !inquiry.isRead ? 'border-l-4 border-brand-blue' : ''
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                {/* Avatar */}
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-brand-very-light-blue text-brand-blue flex items-center justify-center font-bold text-lg">
                    {getInitials(inquiry.name)}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h4 className="text-base font-semibold text-text-primary truncate">
                          {inquiry.name || 'Anonymous'}
                        </h4>
                        {!inquiry.isRead && (
                          <Badge variant="info" size="sm">New</Badge>
                        )}
                        {inquiry.isRead && (
                          <Badge variant="default" size="sm">Read</Badge>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-sm text-text-muted">
                        <span className="flex items-center gap-1">
                          <Mail size={14} />
                          {inquiry.email || 'No email'}
                        </span>
                        <span className="flex items-center gap-1">
                          <Phone size={14} />
                          {inquiry.phone || 'No phone'}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar size={14} />
                          {formatDate(inquiry.createdAt)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          // Mark as read logic here
                          console.log('Mark read:', inquiry._id);
                        }}
                        title="Mark as read"
                      >
                        <CheckCircle size={16} />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-danger hover:bg-red-50"
                        onClick={() => {
                          // Delete logic here
                          console.log('Delete:', inquiry._id);
                        }}
                        title="Delete inquiry"
                      >
                        <X size={16} />
                      </Button>
                    </div>
                  </div>

                  <div className="mt-3 p-3 bg-surface-soft rounded-lg border border-border-light">
                    <div className="flex items-start gap-2">
                      <MessageSquare size={16} className="text-text-muted flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-text-primary whitespace-pre-wrap">
                        {inquiry.message || 'No message content'}
                      </p>
                    </div>
                  </div>

                  {inquiry.propertyTitle && (
                    <div className="mt-2 text-xs text-text-muted">
                      Regarding: <span className="font-medium text-text-primary">{inquiry.propertyTitle}</span>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}

          {/* Footer */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
            <p className="text-xs text-text-muted">
              Showing {filteredInquiries.length} of {inquiries.length} inquiries
            </p>
            <div className="flex items-center gap-3">
              {filter !== 'all' && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setFilter('all')}
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

export default InquiriesTab;