import React from "react";
import PropTypes from "prop-types";
import { Building2, MapPin, Tag, Trash2 } from "lucide-react";

const PropertiesTable = ({
  properties = [],
  onDelete,
  formatDateTime = null,
}) => {
  // Safe date formatter fallback
  const safeFormatDateTime = (dateStr) => {
    if (typeof formatDateTime === "function") {
      return formatDateTime(dateStr);
    }
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? "N/A" : date.toLocaleDateString();
  };

  // Empty State View
  if (!properties || properties.length === 0) {
    return (
      <div className="p-8 sm:p-12 text-center rounded-xl border border-dashed border-border bg-muted/20 max-w-xl mx-auto my-6">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4 border border-border">
          <Building2 className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-bold text-foreground mb-2">
          No Listed Properties
        </h3>
        <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto">
          There are currently no property listings on the platform.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto bg-card text-card-foreground border border-border rounded-xl shadow-xs">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-muted/50 border-b border-border text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            <th className="py-3 px-4">Property</th>
            <th className="py-3 px-4">Location</th>
            <th className="py-3 px-4">Price</th>
            <th className="py-3 px-4">Type</th>
            <th className="py-3 px-4">Listed On</th>
            <th className="py-3 px-4 text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border text-xs sm:text-sm">
          {properties.map((p) => {
            const propertyId = p._id || p.id;
            const title = p.title || "Untitled Property";

            return (
              <tr
                key={propertyId}
                className="hover:bg-muted/40 transition-colors"
              >
                {/* Property Title */}
                <td className="py-3.5 px-4 font-semibold text-foreground">
                  {title}
                </td>

                {/* Location */}
                <td className="py-3.5 px-4">
                  <div className="flex flex-col">
                    <span className="font-medium text-foreground">
                      {p.estate || "N/A"}
                    </span>
                    {p.county && (
                      <span className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-destructive shrink-0" />
                        {p.county}
                      </span>
                    )}
                  </div>
                </td>

                {/* Price */}
                <td className="py-3.5 px-4 font-bold text-primary whitespace-nowrap">
                  KES {Number(p.price || 0).toLocaleString()}
                </td>

                {/* Type Badge */}
                <td className="py-3.5 px-4">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-muted text-muted-foreground border border-border capitalize">
                    <Tag className="w-3 h-3 text-muted-foreground" />
                    {p.houseType || "Standard"}
                  </span>
                </td>

                {/* Listed Date */}
                <td className="py-3.5 px-4 text-muted-foreground whitespace-nowrap">
                  {safeFormatDateTime(p.createdAt)}
                </td>

                {/* Actions */}
                <td className="py-3.5 px-4 text-right">
                  <button
                    type="button"
                    onClick={() => onDelete?.(propertyId)}
                    className="inline-flex items-center justify-center p-2 rounded-lg bg-destructive/10 hover:bg-destructive/20 text-destructive border border-destructive/20 transition-colors cursor-pointer"
                    title="Remove listing"
                    aria-label={`Remove ${title}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

PropertiesTable.propTypes = {
  properties: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string,
      id: PropTypes.string,
      title: PropTypes.string,
      estate: PropTypes.string,
      county: PropTypes.string,
      price: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      houseType: PropTypes.string,
      createdAt: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
    })
  ),
  onDelete: PropTypes.func.isRequired,
  formatDateTime: PropTypes.func,
};

export default PropertiesTable;