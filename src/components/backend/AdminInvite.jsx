import React, { useState, useEffect } from "react";
import { useAdminAuthStore } from "./store/useAdminAuthStore";
import { AdminService } from "../../services/adminService";
import "../backend/styles/adminInvite.css";

const AdminInvite = ({ darkMode = false }) => {
  const { adminUser } = useAdminAuthStore();
  const [invites, setInvites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inviteForm, setInviteForm] = useState({
    email: "",
    role: "admin",
    permissions: [],
    notes: "",
  });
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  // SYNCHRONIZED WITH BACKEND ROLE_TEMPLATES
  const roles = [
    {
      value: "admin",
      label: "Administrator",
      description:
        "Full business operations access (cannot manage other admins)",
      permissions: [
        // Users
        "users.create",
        "users.read",
        "users.update",
        "users.delete",
        "users.export",
        "users.suspend",
        // Products
        "products.create",
        "products.read",
        "products.update",
        "products.delete",
        "products.import",
        "products.export",
        "products.bulk_edit",
        // Orders
        "orders.create",
        "orders.read",
        "orders.update",
        "orders.cancel",
        "orders.refund",
        "orders.export",
        "orders.bulk_process",
        // Marketing
        "promotions.create",
        "promotions.read",
        "promotions.update",
        "promotions.delete",
        "coupons.create",
        "coupons.read",
        "coupons.update",
        "coupons.delete",
        "coupons.bulk_generate",
        // Inventory
        "inventory.read",
        "inventory.update",
        "inventory.alerts",
        "inventory.reports",
        "inventory.bulk_update",
        // Shipping
        "shipping.zones",
        "shipping.rates",
        "shipping.methods",
        "shipping.tracking",
        "shipping.labels",
        "shipping.reports",
        // Taxes
        "taxes.rates",
        "taxes.rules",
        "taxes.reports",
        "taxes.settings",
        // Analytics
        "analytics.basic",
        "analytics.advanced",
        "analytics.export",
        "analytics.realtime",
        "reports.sales",
        "reports.customers",
        "reports.products",
        // Content
        "content.create",
        "content.read",
        "content.update",
        "content.delete",
        "content.publish",
        "content.moderate",
        // Financial
        "payments.read",
        "payments.process",
        "payments.refund",
        "billing.read",
        "billing.update",
        "revenue.reports",
        // Support
        "tickets.create",
        "tickets.read",
        "tickets.update",
        "tickets.close",
        "chat.access",
        "reviews.moderate",
        // Settings
        "admins.read",
        "settings.general",
        "settings.security",
      ],
    },
    {
      value: "manager",
      label: "Manager",
      description: "Operational management access",
      permissions: [
        "users.read",
        "users.update",
        "users.export",
        "products.create",
        "products.read",
        "products.update",
        "products.delete",
        "products.import",
        "products.export",
        "products.bulk_edit",
        "orders.create",
        "orders.read",
        "orders.update",
        "orders.cancel",
        "orders.refund",
        "orders.export",
        "orders.bulk_process",
        "inventory.read",
        "inventory.update",
        "inventory.alerts",
        "inventory.reports",
        "inventory.bulk_update",
        "analytics.basic",
        "reports.sales",
        "reports.products",
      ],
    },
    {
      value: "moderator",
      label: "Moderator",
      description: "Content and user moderation",
      permissions: [
        "users.read",
        "users.suspend",
        "content.create",
        "content.read",
        "content.update",
        "content.delete",
        "content.publish",
        "content.moderate",
        "reviews.moderate",
        "tickets.read",
        "tickets.update",
      ],
    },
    {
      value: "support",
      label: "Support Agent",
      description: "Customer support access",
      permissions: [
        "users.read",
        "orders.read",
        "orders.update",
        "tickets.create",
        "tickets.read",
        "tickets.update",
        "tickets.close",
        "chat.access",
        "reviews.moderate",
        "analytics.basic",
      ],
    },
  ];

  // Complete list of ALL available permissions (from backend)
  const availablePermissions = [
    // Users
    "users.create",
    "users.read",
    "users.update",
    "users.delete",
    "users.export",
    "users.suspend",
    // Products
    "products.create",
    "products.read",
    "products.update",
    "products.delete",
    "products.import",
    "products.export",
    "products.bulk_edit",
    // Orders
    "orders.create",
    "orders.read",
    "orders.update",
    "orders.cancel",
    "orders.refund",
    "orders.export",
    "orders.bulk_process",
    // Marketing
    "promotions.create",
    "promotions.read",
    "promotions.update",
    "promotions.delete",
    "coupons.create",
    "coupons.read",
    "coupons.update",
    "coupons.delete",
    "coupons.bulk_generate",
    // Inventory
    "inventory.read",
    "inventory.update",
    "inventory.alerts",
    "inventory.reports",
    "inventory.bulk_update",
    // Shipping
    "shipping.zones",
    "shipping.rates",
    "shipping.methods",
    "shipping.tracking",
    "shipping.labels",
    "shipping.reports",
    // Taxes
    "taxes.rates",
    "taxes.rules",
    "taxes.reports",
    "taxes.settings",
    // Analytics
    "analytics.basic",
    "analytics.advanced",
    "analytics.export",
    "analytics.realtime",
    "reports.sales",
    "reports.customers",
    "reports.products",
    // Content
    "content.create",
    "content.read",
    "content.update",
    "content.delete",
    "content.publish",
    "content.moderate",
    // Financial
    "payments.read",
    "payments.process",
    "payments.refund",
    "billing.read",
    "billing.update",
    "revenue.reports",
    // Support
    "tickets.create",
    "tickets.read",
    "tickets.update",
    "tickets.close",
    "chat.access",
    "reviews.moderate",
    // System (only for display, super_admin can assign)
    "admins.create",
    "admins.read",
    "admins.update",
    "admins.delete",
    "settings.general",
    "settings.security",
    "settings.integrations",
    "system.maintenance",
    "system.logs",
    "system.backups",
  ];

  useEffect(() => {
    loadInvites();
  }, []);

  useEffect(() => {
    console.log("AdminInvite - Auth Status:", {
      hasUser: !!adminUser,
      isAuthenticated: useAdminAuthStore.getState().isAuthenticated,
      hasToken: !!useAdminAuthStore.getState().accessToken,
    });
  }, [adminUser]);

  const loadInvites = async () => {
    try {
      setLoading(true);
      const response = await AdminService.getInvites();
      setInvites(response.invites || []);
    } catch (error) {
      console.error("Failed to load invites:", error);
      setMessage({ text: "Failed to load invites", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = (roleValue) => {
    const role = roles.find((r) => r.value === roleValue);
    setInviteForm((prev) => ({
      ...prev,
      role: roleValue,
      permissions: role ? [...role.permissions] : [],
    }));
  };

  const handlePermissionChange = (permission) => {
    setInviteForm((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter((p) => p !== permission)
        : [...prev.permissions, permission],
    }));
  };

  const handleSubmitInvite = async (e) => {
    e.preventDefault();
    if (!inviteForm.email || !inviteForm.role) {
      setMessage({ text: "Email and role are required", type: "error" });
      return;
    }

    try {
      setSubmitting(true);

      console.log("Submitting invite with data:", {
        email: inviteForm.email,
        role: inviteForm.role,
        permissionCount: inviteForm.permissions.length,
        permissions: inviteForm.permissions,
      });

      const response = await AdminService.createAdminInvite({
        email: inviteForm.email,
        role: inviteForm.role,
        permissions: inviteForm.permissions,
        notes: inviteForm.notes,
      });

      console.log("Invite response:", response);

      setMessage({ text: "Admin invite sent successfully!", type: "success" });
      setInviteForm({ email: "", role: "admin", permissions: [], notes: "" });
      setShowInviteForm(false);
      await loadInvites();
    } catch (error) {
      console.error("Failed to send invite:", error);

      // Enhanced error display
      let errorMessage = "Failed to send invite";

      if (error.context?.details) {
        errorMessage = error.context.details.join(", ");
      } else if (error.message) {
        errorMessage = error.message;
      }

      setMessage({
        text: errorMessage,
        type: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelInvite = async (inviteId) => {
    if (!confirm("Are you sure you want to cancel this invite?")) return;

    try {
      await AdminService.cancelInvite(inviteId);
      setMessage({ text: "Invite cancelled successfully", type: "success" });
      await loadInvites();
    } catch (error) {
      console.error("Failed to cancel invite:", error);
      setMessage({ text: "Failed to cancel invite", type: "error" });
    }
  };

  if (loading) {
    return (
      <div className={`admin-invite-management ${darkMode ? "dark-mode" : ""}`}>
        <div className="loading-spinner">Loading invites...</div>
      </div>
    );
  }

  return (
    <div className={`admin-invite-management ${darkMode ? "dark-mode" : ""}`}>
      <div className="page-header">
        <h1>Admin Management</h1>
        <button
          className="btn btn--primary"
          onClick={() => setShowInviteForm(!showInviteForm)}
        >
          {showInviteForm ? "Cancel" : "Invite Admin"}
        </button>
      </div>

      {message.text && (
        <div className={`alert alert--${message.type}`}>
          {message.text}
          <button
            className="alert-close"
            onClick={() => setMessage({ text: "", type: "" })}
          >
            ×
          </button>
        </div>
      )}

      {showInviteForm && (
        <div className="invite-form-container">
          <h2>Invite New Admin</h2>
          <div className="invite-form">
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                value={inviteForm.email}
                onChange={(e) =>
                  setInviteForm((prev) => ({ ...prev, email: e.target.value }))
                }
                placeholder="Enter admin email"
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label htmlFor="role">Role</label>
              <select
                id="role"
                value={inviteForm.role}
                onChange={(e) => handleRoleChange(e.target.value)}
                className="form-control"
              >
                {roles.map((role) => (
                  <option key={role.value} value={role.value}>
                    {role.label}
                  </option>
                ))}
              </select>
              {roles.find((r) => r.value === inviteForm.role)?.description && (
                <small className="form-text">
                  {roles.find((r) => r.value === inviteForm.role).description}
                </small>
              )}
            </div>

            <div className="form-group">
              <label>
                Permissions ({inviteForm.permissions.length} selected)
              </label>
              <div className="permissions-grid">
                {availablePermissions.map((permission) => (
                  <label key={permission} className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={inviteForm.permissions.includes(permission)}
                      onChange={() => handlePermissionChange(permission)}
                    />
                    <span className="checkbox-text">{permission}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="notes">Notes (Optional)</label>
              <textarea
                id="notes"
                value={inviteForm.notes}
                onChange={(e) =>
                  setInviteForm((prev) => ({ ...prev, notes: e.target.value }))
                }
                placeholder="Add any notes about this invite..."
                className="form-control"
                rows="3"
              />
            </div>

            <div className="form-actions">
              <button
                onClick={handleSubmitInvite}
                disabled={submitting}
                className="btn btn--primary"
              >
                {submitting ? "Sending..." : "Send Invite"}
              </button>
              <button
                onClick={() => setShowInviteForm(false)}
                className="btn btn--secondary"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="invites-list">
        <h2>Pending Invites</h2>
        {invites.length === 0 ? (
          <p className="no-invites">No pending invites</p>
        ) : (
          <div className="invites-table">
            <div className="table-header">
              <div className="table-cell">Email</div>
              <div className="table-cell">Role</div>
              <div className="table-cell">Invited By</div>
              <div className="table-cell">Expires</div>
              <div className="table-cell">Actions</div>
            </div>
            {invites.map((invite) => (
              <div key={invite.id} className="table-row">
                <div className="table-cell">{invite.email}</div>
                <div className="table-cell">
                  <span className={`role-badge role-${invite.role}`}>
                    {invite.role}
                  </span>
                </div>
                <div className="table-cell">{invite.invitedBy.email}</div>
                <div className="table-cell">
                  {new Date(invite.expiresAt).toLocaleDateString()}
                </div>
                <div className="table-cell">
                  <button
                    onClick={() => handleCancelInvite(invite.id)}
                    className="btn btn--danger btn--small"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminInvite;
