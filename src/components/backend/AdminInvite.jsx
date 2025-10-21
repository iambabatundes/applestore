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

  const roles = [
    {
      value: "admin",
      label: "Admin",
      permissions: [
        // Users
        "users.create",
        "users.read",
        "users.update",
        "users.delete",
        "users.export",
        // Products
        "products.create",
        "products.read",
        "products.update",
        "products.delete",
        "products.export",
        // Orders
        "orders.create",
        "orders.read",
        "orders.update",
        "orders.cancel",
        "orders.export",
        // Promotions & Coupons
        "promotions.read",
        "promotions.update",
        "coupons.read",
        "coupons.update",
        // Shipping & Taxes
        "shipping.zones",
        "shipping.rates",
        "taxes.rates",
        "taxes.rules",
        // Analytics
        "analytics.basic",
        "analytics.advanced",
        // Content
        "content.create",
        "content.read",
        "content.update",
        "content.moderate",
        // Settings
        "settings.general",
      ],
    },
    {
      value: "moderator",
      label: "Moderator",
      permissions: [
        "users.read",
        "users.update",
        "products.read",
        "products.update",
        "orders.read",
        "content.read",
        "content.moderate",
        "reviews.moderate",
      ],
    },
    {
      value: "editor",
      label: "Editor",
      permissions: [
        "products.create",
        "products.read",
        "products.update",
        "content.create",
        "content.read",
        "content.update",
      ],
    },
  ];

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
    // Orders
    "orders.create",
    "orders.read",
    "orders.update",
    "orders.cancel",
    "orders.refund",
    "orders.export",
    // Promotions
    "promotions.create",
    "promotions.read",
    "promotions.update",
    "promotions.delete",
    // Coupons
    "coupons.create",
    "coupons.read",
    "coupons.update",
    "coupons.delete",
    // Inventory
    "inventory.read",
    "inventory.update",
    "inventory.alerts",
    // Shipping
    "shipping.zones",
    "shipping.rates",
    "shipping.methods",
    // Taxes
    "taxes.rates",
    "taxes.rules",
    "taxes.reports",
    // Analytics
    "analytics.basic",
    "analytics.advanced",
    "analytics.export",
    // Content
    "content.create",
    "content.read",
    "content.update",
    "content.delete",
    "content.moderate",
    // Reviews
    "reviews.moderate",
    // Settings
    "settings.general",
    "settings.security",
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
      await AdminService.createAdminInvite({
        email: inviteForm.email,
        role: inviteForm.role,
        permissions: inviteForm.permissions,
        notes: inviteForm.notes,
      });

      setMessage({ text: "Admin invite sent successfully!", type: "success" });
      setInviteForm({ email: "", role: "admin", permissions: [], notes: "" });
      setShowInviteForm(false);
      await loadInvites();
    } catch (error) {
      console.error("Failed to send invite:", error);
      setMessage({
        text: error.message || "Failed to send invite",
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
            </div>

            <div className="form-group">
              <label>Permissions</label>
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
