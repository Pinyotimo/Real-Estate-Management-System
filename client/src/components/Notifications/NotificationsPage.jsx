import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Bell,
  BellOff,
  Check,
  CheckCheck,
  Trash2,
  ExternalLink,
  Clock,
  AlertCircle,
  Filter,
  ArrowUpDown,
} from 'lucide-react';
import Card from '../common/Card';
import { useNotifications } from './NotificationsContext';

// Safe relative time formatter
const formatTimeAgo = (createdAt, fallbackTime) => {
  if (fallbackTime) return fallbackTime;
  if (!createdAt) return 'Just now';

  const date = new Date(createdAt);
  if (isNaN(date.getTime())) return 'Just now';

  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 30) return 'Just now';
  if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;

  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  });
};

const NotificationsPage = () => {
  const {
    notifications = [],
    loading = false,
    error = null,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useNotifications() || {};

  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('recent');

  const safeNotifications = Array.isArray(notifications) ? notifications : [];

  // Filter and sort notifications memo
  const filteredNotifications = useMemo(() => {
    let list = [...safeNotifications];

    if (filter === 'unread') {
      list = list.filter((n) => !(n.isRead ?? n.read));
    } else if (filter === 'read') {
      list = list.filter((n) => Boolean(n.isRead ?? n.read));
    }

    list.sort((a, b) => {
      const dateA = new Date(a.createdAt || 0).getTime();
      const dateB = new Date(b.createdAt || 0).getTime();
      return sortBy === 'recent' ? dateB - dateA : dateA - dateB;
    });

    return list;
  }, [safeNotifications, filter, sortBy]);

  const unreadCount = safeNotifications.filter((n) => !(n.isRead ?? n.read)).length;

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Header & Controls Card */}
      <Card
        padding="normal"
        hover={false}
        title="Notifications"
        subtitle={
          unreadCount > 0
            ? `${unreadCount} unread update${unreadCount !== 1 ? 's' : ''}`
            : 'All caught up!'
        }
        headerActions={
          unreadCount > 0 && (
            <button
              type="button"
              onClick={markAllAsRead}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary/80 transition-colors cursor-pointer"
            >
              <CheckCheck className="w-4 h-4" />
              <span>Mark all as read</span>
            </button>
          )
        }
      >
        {/* Controls Bar */}
        <div className="flex flex-col sm:flex-row gap-4 pt-3 border-t border-border/50 mt-2">
          {/* Filter Dropdown */}
          <div className="flex-1">
            <label className="flex items-center gap-1 text-xs font-medium text-text-muted mb-1.5">
              <Filter className="w-3.5 h-3.5" />
              <span>Filter</span>
            </label>
            <select
              className="w-full bg-surface-soft border border-border rounded-lg px-3 py-1.5 text-xs sm:text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All Notifications ({safeNotifications.length})</option>
              <option value="unread">Unread Only ({unreadCount})</option>
              <option value="read">Read Only</option>
            </select>
          </div>

          {/* Sort Dropdown */}
          <div className="flex-1">
            <label className="flex items-center gap-1 text-xs font-medium text-text-muted mb-1.5">
              <ArrowUpDown className="w-3.5 h-3.5" />
              <span>Sort By</span>
            </label>
            <select
              className="w-full bg-surface-soft border border-border rounded-lg px-3 py-1.5 text-xs sm:text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="recent">Most Recent</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Notification List State Machine */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} padding="sm" hover={false} className="animate-pulse h-24 opacity-60" />
          ))}
        </div>
      ) : error ? (
        <Card padding="normal" className="border-destructive/30 bg-destructive/5 text-destructive text-center">
          <div className="flex items-center justify-center gap-2 text-sm font-semibold">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        </Card>
      ) : filteredNotifications.length === 0 ? (
        <Card padding="lg" className="text-center py-12">
          <div className="w-12 h-12 rounded-full bg-surface-soft flex items-center justify-center mx-auto mb-3 text-text-muted">
            <BellOff className="w-6 h-6" />
          </div>
          <p className="text-sm font-bold text-text-primary">No notifications found</p>
          <p className="text-xs text-text-muted mt-1 max-w-sm mx-auto">
            {filter === 'unread'
              ? "You're completely caught up! No unread notifications right now."
              : 'You have no notifications in this view.'}
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredNotifications.map((notification) => {
            const id = notification._id || notification.id;
            const isRead = Boolean(notification.isRead ?? notification.read);
            const actionUrl = notification.actionUrl || notification.link;

            return (
              <Card
                key={id}
                padding="sm"
                hover={true}
                className={`relative transition-all border-l-4 ${
                  isRead
                    ? 'border-l-border bg-surface'
                    : 'border-l-primary bg-surface-soft/80 shadow-xs'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  {/* Left Main Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-xs sm:text-sm font-bold text-text-primary truncate">
                        {notification.title || 'Notification'}
                      </h4>
                      {!isRead && (
                        <span className="inline-block w-2 h-2 rounded-full bg-primary shrink-0" />
                      )}
                    </div>

                    <p className="text-xs text-text-muted leading-relaxed line-clamp-2">
                      {notification.message}
                    </p>

                    <div className="flex items-center gap-1 mt-2 text-[11px] text-text-subtle font-medium">
                      <Clock className="w-3 h-3 text-text-muted" />
                      <span>{formatTimeAgo(notification.createdAt, notification.timeAgo)}</span>
                    </div>
                  </div>

                  {/* Right Header Action Buttons */}
                  <div className="flex items-center gap-1 shrink-0">
                    {!isRead && (
                      <button
                        type="button"
                        onClick={() => markAsRead?.(id)}
                        className="p-1.5 rounded-lg hover:bg-primary/10 text-text-muted hover:text-primary transition-colors cursor-pointer"
                        title="Mark as read"
                        aria-label="Mark notification as read"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => deleteNotification?.(id)}
                      className="p-1.5 rounded-lg hover:bg-destructive/10 text-text-muted hover:text-destructive transition-colors cursor-pointer"
                      title="Delete notification"
                      aria-label="Delete notification"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Optional Target Link */}
                {actionUrl && (
                  <div className="mt-3 pt-2 border-t border-border/40 flex items-center justify-between">
                    <Link
                      to={actionUrl}
                      onClick={() => !isRead && markAsRead?.(id)}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                    >
                      <span>View details</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;