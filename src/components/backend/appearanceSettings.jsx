import React, { useState, useEffect } from "react";
import {
  Save,
  Upload,
  AlertCircle,
  CheckCircle,
  RefreshCw,
  Eye,
  EyeOff,
  Copy,
  ExternalLink,
  Settings,
  Mail,
  Shield,
  Palette,
  Plug,
  Bell,
} from "lucide-react";
import "./styles/systemSetting.css";

const SystemSettingsUI = () => {
  const [activeCategory, setActiveCategory] = useState("GENERAL");
  const [settings, setSettings] = useState({});
  const [originalSettings, setOriginalSettings] = useState({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [showPasswords, setShowPasswords] = useState({});

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    setTimeout(() => {
      const mockSettings = {
        GENERAL: {
          siteName: "Admin Panel",
          siteUrl: "https://example.com",
          adminPanelUrl: "https://admin.example.com",
          frontendUrl: "https://example.com",
          apiUrl: "https://api.example.com",
          timezone: "UTC",
          dateFormat: "YYYY-MM-DD",
          timeFormat: "HH:mm:ss",
          language: "en",
          currency: "USD",
          maintenanceMode: false,
        },
        EMAIL: {
          fromEmail: "noreply@example.com",
          fromName: "Admin Panel",
          replyTo: "support@example.com",
          smtpHost: "smtp.gmail.com",
          smtpPort: 587,
          smtpSecure: false,
          smtpUser: "user@gmail.com",
          smtpPassword: "••••••••",
          emailProvider: "smtp",
          emailsEnabled: true,
        },
        SECURITY: {
          sessionTimeout: 3600,
          tokenExpiry: 3600,
          refreshTokenExpiry: 2592000,
          maxLoginAttempts: 5,
          lockoutDuration: 900,
          passwordMinLength: 12,
          passwordRequireUppercase: true,
          passwordRequireLowercase: true,
          passwordRequireNumbers: true,
          passwordRequireSpecialChars: true,
          passwordExpiryDays: 90,
          twoFactorRequired: false,
          corsOrigins: "http://localhost:3000",
        },
        BRANDING: {
          logoUrl: "",
          faviconUrl: "",
          brandColor: "#3b82f6",
          brandColorSecondary: "#1e40af",
          companyName: "Your Company",
          supportEmail: "support@example.com",
          supportPhone: "",
          twitterUrl: "",
          linkedinUrl: "",
          facebookUrl: "",
          instagramUrl: "",
        },
        INTEGRATIONS: {
          analyticsEnabled: false,
          googleAnalyticsId: "",
          mixpanelToken: "",
          stripePublicKey: "",
          stripeSecretKey: "",
          paypalClientId: "",
          storageProvider: "local",
          s3Bucket: "",
          s3Region: "",
          cloudinaryCloudName: "",
        },
        NOTIFICATIONS: {
          newUserRegistration: true,
          newOrder: true,
          systemErrors: true,
          securityAlerts: true,
          welcomeEmail: true,
          orderConfirmation: true,
          passwordReset: true,
          accountUpdates: true,
          slackWebhookUrl: "",
          discordWebhookUrl: "",
        },
      };
      setSettings(mockSettings);
      setOriginalSettings(JSON.parse(JSON.stringify(mockSettings)));
      setLoading(false);
    }, 800);
  };

  const categories = [
    { key: "GENERAL", label: "General", icon: Settings, color: "blue" },
    { key: "EMAIL", label: "Email", icon: Mail, color: "green" },
    { key: "SECURITY", label: "Security", icon: Shield, color: "red" },
    { key: "BRANDING", label: "Branding", icon: Palette, color: "purple" },
    { key: "INTEGRATIONS", label: "Integrations", icon: Plug, color: "yellow" },
    { key: "NOTIFICATIONS", label: "Notifications", icon: Bell, color: "pink" },
  ];

  const handleInputChange = (category, field, value) => {
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value,
      },
    }));
  };

  const hasChanges = (category) => {
    return (
      JSON.stringify(settings[category]) !==
      JSON.stringify(originalSettings[category])
    );
  };

  const handleSave = async (category) => {
    setSaving(true);
    setMessage(null);

    setTimeout(() => {
      setOriginalSettings((prev) => ({
        ...prev,
        [category]: JSON.parse(JSON.stringify(settings[category])),
      }));
      setSaving(false);
      setMessage({
        type: "success",
        text: `${category} settings saved successfully!`,
      });
      setTimeout(() => setMessage(null), 3000);
    }, 1000);
  };

  const handleReset = (category) => {
    setSettings((prev) => ({
      ...prev,
      [category]: JSON.parse(JSON.stringify(originalSettings[category])),
    }));
    setMessage({ type: "info", text: "Changes discarded" });
    setTimeout(() => setMessage(null), 2000);
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setMessage({ type: "success", text: "Copied to clipboard!" });
    setTimeout(() => setMessage(null), 2000);
  };

  const renderField = (
    category,
    field,
    value,
    label,
    type = "text",
    options = {}
  ) => {
    const fieldId = `${category}-${field}`;

    if (type === "boolean") {
      return (
        <div className="toggle-field">
          <div className="toggle-content">
            <label htmlFor={fieldId} className="toggle-label">
              {label}
            </label>
            {options.description && (
              <p className="form-description">{options.description}</p>
            )}
          </div>
          <button
            type="button"
            onClick={() => handleInputChange(category, field, !value)}
            className={`toggle-switch ${value ? "active" : ""}`}
            aria-pressed={value}
          >
            <span className="toggle-slider" />
          </button>
        </div>
      );
    }

    if (type === "select") {
      return (
        <div className="form-field">
          <label htmlFor={fieldId} className="form-label">
            {label}
          </label>
          <select
            id={fieldId}
            value={value}
            onChange={(e) => handleInputChange(category, field, e.target.value)}
            className="form-select"
          >
            {options.choices?.map((choice) => (
              <option key={choice.value} value={choice.value}>
                {choice.label}
              </option>
            ))}
          </select>
        </div>
      );
    }

    if (type === "textarea") {
      return (
        <div className="form-field">
          <label htmlFor={fieldId} className="form-label">
            {label}
          </label>
          <textarea
            id={fieldId}
            value={value}
            onChange={(e) => handleInputChange(category, field, e.target.value)}
            rows={options.rows || 3}
            className="form-textarea"
            placeholder={options.placeholder}
          />
          {options.description && (
            <p className="form-description">{options.description}</p>
          )}
        </div>
      );
    }

    if (type === "password") {
      return (
        <div className="form-field">
          <label htmlFor={fieldId} className="form-label">
            {label}
          </label>
          <div className="input-wrapper">
            <input
              id={fieldId}
              type={showPasswords[field] ? "text" : "password"}
              value={value}
              onChange={(e) =>
                handleInputChange(category, field, e.target.value)
              }
              className="form-input input-with-icon"
              placeholder={options.placeholder}
            />
            <div className="input-icon">
              <button
                type="button"
                onClick={() => togglePasswordVisibility(field)}
                className="icon-button"
                aria-label={
                  showPasswords[field] ? "Hide password" : "Show password"
                }
              >
                {showPasswords[field] ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>
          </div>
        </div>
      );
    }

    if (type === "color") {
      return (
        <div className="form-field">
          <label htmlFor={fieldId} className="form-label">
            {label}
          </label>
          <div className="color-input-group">
            <input
              id={fieldId}
              type="color"
              value={value}
              onChange={(e) =>
                handleInputChange(category, field, e.target.value)
              }
              className="color-picker"
            />
            <input
              type="text"
              value={value}
              onChange={(e) =>
                handleInputChange(category, field, e.target.value)
              }
              className="form-input"
              placeholder="#000000"
            />
          </div>
        </div>
      );
    }

    if (type === "number") {
      return (
        <div className="form-field">
          <label htmlFor={fieldId} className="form-label">
            {label}
          </label>
          <input
            id={fieldId}
            type="number"
            value={value}
            onChange={(e) =>
              handleInputChange(category, field, parseInt(e.target.value) || 0)
            }
            className="form-input"
            placeholder={options.placeholder}
            min={options.min}
            max={options.max}
          />
          {options.description && (
            <p className="form-description">{options.description}</p>
          )}
        </div>
      );
    }

    if (type === "url") {
      return (
        <div className="form-field">
          <label htmlFor={fieldId} className="form-label">
            {label}
          </label>
          <div className="input-wrapper">
            <input
              id={fieldId}
              type="url"
              value={value}
              onChange={(e) =>
                handleInputChange(category, field, e.target.value)
              }
              className={`form-input ${value ? "input-with-actions" : ""}`}
              placeholder={options.placeholder || "https://example.com"}
            />
            {value && (
              <div className="input-icon">
                <button
                  type="button"
                  onClick={() => copyToClipboard(value)}
                  className="icon-button"
                  title="Copy URL"
                >
                  <Copy size={16} />
                </button>
                <a
                  href={value}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="icon-button"
                  title="Open URL"
                >
                  <ExternalLink size={16} />
                </a>
              </div>
            )}
          </div>
          {options.description && (
            <p className="form-description">{options.description}</p>
          )}
        </div>
      );
    }

    return (
      <div className="form-field">
        <label htmlFor={fieldId} className="form-label">
          {label}
        </label>
        <input
          id={fieldId}
          type={type}
          value={value}
          onChange={(e) => handleInputChange(category, field, e.target.value)}
          className="form-input"
          placeholder={options.placeholder}
        />
        {options.description && (
          <p className="form-description">{options.description}</p>
        )}
      </div>
    );
  };

  const renderCategoryContent = () => {
    if (loading) {
      return (
        <div className="loading-container">
          <RefreshCw className="spinner" size={32} />
        </div>
      );
    }

    const categorySettings = settings[activeCategory] || {};

    switch (activeCategory) {
      case "GENERAL":
        return (
          <div>
            <div className="form-grid cols-2">
              {renderField(
                "GENERAL",
                "siteName",
                categorySettings.siteName,
                "Site Name",
                "text",
                { placeholder: "My Awesome Site" }
              )}
              {renderField(
                "GENERAL",
                "timezone",
                categorySettings.timezone,
                "Timezone",
                "select",
                {
                  choices: [
                    { value: "UTC", label: "UTC" },
                    { value: "America/New_York", label: "Eastern Time" },
                    { value: "America/Chicago", label: "Central Time" },
                    { value: "America/Denver", label: "Mountain Time" },
                    { value: "America/Los_Angeles", label: "Pacific Time" },
                    { value: "Europe/London", label: "London" },
                    { value: "Asia/Tokyo", label: "Tokyo" },
                  ],
                }
              )}
            </div>

            <div className="form-grid cols-2">
              {renderField(
                "GENERAL",
                "language",
                categorySettings.language,
                "Language",
                "select",
                {
                  choices: [
                    { value: "en", label: "English" },
                    { value: "es", label: "Spanish" },
                    { value: "fr", label: "French" },
                    { value: "de", label: "German" },
                  ],
                }
              )}
              {renderField(
                "GENERAL",
                "currency",
                categorySettings.currency,
                "Currency",
                "select",
                {
                  choices: [
                    { value: "USD", label: "USD - US Dollar" },
                    { value: "EUR", label: "EUR - Euro" },
                    { value: "GBP", label: "GBP - British Pound" },
                    { value: "JPY", label: "JPY - Japanese Yen" },
                  ],
                }
              )}
            </div>

            <div className="form-section">
              <h3 className="form-section-title">URLs Configuration</h3>
              {renderField(
                "GENERAL",
                "siteUrl",
                categorySettings.siteUrl,
                "Site URL",
                "url",
                { description: "The main public URL of your website" }
              )}
              {renderField(
                "GENERAL",
                "adminPanelUrl",
                categorySettings.adminPanelUrl,
                "Admin Panel URL",
                "url",
                { description: "URL where administrators access the panel" }
              )}
              {renderField(
                "GENERAL",
                "frontendUrl",
                categorySettings.frontendUrl,
                "Frontend URL",
                "url",
                { description: "URL of your frontend application" }
              )}
              {renderField(
                "GENERAL",
                "apiUrl",
                categorySettings.apiUrl,
                "API URL",
                "url",
                { description: "Base URL for API endpoints" }
              )}
            </div>

            <div className="form-section">
              {renderField(
                "GENERAL",
                "maintenanceMode",
                categorySettings.maintenanceMode,
                "Maintenance Mode",
                "boolean",
                {
                  description:
                    "When enabled, the site will show a maintenance page to visitors",
                }
              )}
            </div>
          </div>
        );

      case "EMAIL":
        return (
          <div>
            <div className="alert blue-alert">
              <Mail size={20} style={{ flexShrink: 0 }} />
              <div>
                <h4>Email Configuration</h4>
                <p>
                  Configure your email settings to ensure reliable delivery of
                  transactional emails
                </p>
              </div>
            </div>

            <div className="form-grid cols-2">
              {renderField(
                "EMAIL",
                "fromEmail",
                categorySettings.fromEmail,
                "From Email",
                "email",
                { placeholder: "noreply@example.com" }
              )}
              {renderField(
                "EMAIL",
                "fromName",
                categorySettings.fromName,
                "From Name",
                "text",
                { placeholder: "My Company" }
              )}
            </div>

            {renderField(
              "EMAIL",
              "replyTo",
              categorySettings.replyTo,
              "Reply-To Email",
              "email",
              {
                placeholder: "support@example.com",
                description: "Email address where replies will be sent",
              }
            )}

            <div className="form-section">
              <h3 className="form-section-title">SMTP Configuration</h3>
              {renderField(
                "EMAIL",
                "emailProvider",
                categorySettings.emailProvider,
                "Email Provider",
                "select",
                {
                  choices: [
                    { value: "smtp", label: "SMTP" },
                    { value: "sendgrid", label: "SendGrid" },
                    { value: "mailgun", label: "Mailgun" },
                    { value: "ses", label: "Amazon SES" },
                  ],
                }
              )}

              <div className="form-grid cols-3">
                {renderField(
                  "EMAIL",
                  "smtpHost",
                  categorySettings.smtpHost,
                  "SMTP Host",
                  "text",
                  { placeholder: "smtp.gmail.com" }
                )}
                {renderField(
                  "EMAIL",
                  "smtpPort",
                  categorySettings.smtpPort,
                  "SMTP Port",
                  "number",
                  { placeholder: "587" }
                )}
                <div>
                  {renderField(
                    "EMAIL",
                    "smtpSecure",
                    categorySettings.smtpSecure,
                    "Use SSL/TLS",
                    "boolean"
                  )}
                </div>
              </div>

              <div className="form-grid cols-2">
                {renderField(
                  "EMAIL",
                  "smtpUser",
                  categorySettings.smtpUser,
                  "SMTP Username",
                  "text",
                  { placeholder: "user@gmail.com" }
                )}
                {renderField(
                  "EMAIL",
                  "smtpPassword",
                  categorySettings.smtpPassword,
                  "SMTP Password",
                  "password",
                  { placeholder: "Enter password" }
                )}
              </div>
            </div>

            <div className="form-section">
              {renderField(
                "EMAIL",
                "emailsEnabled",
                categorySettings.emailsEnabled,
                "Enable Email Sending",
                "boolean",
                {
                  description:
                    "Master switch to enable or disable all email sending",
                }
              )}
            </div>
          </div>
        );

      case "SECURITY":
        return (
          <div>
            <div className="alert red-alert">
              <Shield size={20} style={{ flexShrink: 0 }} />
              <div>
                <h4>Security Settings</h4>
                <p>
                  Configure authentication, session management, and password
                  policies
                </p>
              </div>
            </div>

            <div className="form-section">
              <h3 className="form-section-title">Session & Token Settings</h3>
              <div className="form-grid cols-3">
                {renderField(
                  "SECURITY",
                  "sessionTimeout",
                  categorySettings.sessionTimeout,
                  "Session Timeout (seconds)",
                  "number",
                  {
                    description: "How long before idle sessions expire",
                    min: 300,
                  }
                )}
                {renderField(
                  "SECURITY",
                  "tokenExpiry",
                  categorySettings.tokenExpiry,
                  "Token Expiry (seconds)",
                  "number",
                  {
                    description: "Access token lifetime",
                    min: 300,
                  }
                )}
                {renderField(
                  "SECURITY",
                  "refreshTokenExpiry",
                  categorySettings.refreshTokenExpiry,
                  "Refresh Token Expiry (seconds)",
                  "number",
                  {
                    description: "Refresh token lifetime",
                    min: 3600,
                  }
                )}
              </div>
            </div>

            <div className="form-section">
              <h3 className="form-section-title">Login Protection</h3>
              <div className="form-grid cols-2">
                {renderField(
                  "SECURITY",
                  "maxLoginAttempts",
                  categorySettings.maxLoginAttempts,
                  "Max Login Attempts",
                  "number",
                  {
                    description: "Failed attempts before lockout",
                    min: 3,
                  }
                )}
                {renderField(
                  "SECURITY",
                  "lockoutDuration",
                  categorySettings.lockoutDuration,
                  "Lockout Duration (seconds)",
                  "number",
                  {
                    description: "How long accounts are locked",
                    min: 300,
                  }
                )}
              </div>
            </div>

            <div className="form-section">
              <h3 className="form-section-title">Password Requirements</h3>
              {renderField(
                "SECURITY",
                "passwordMinLength",
                categorySettings.passwordMinLength,
                "Minimum Password Length",
                "number",
                {
                  min: 8,
                  max: 128,
                }
              )}
              <div className="form-grid cols-2">
                {renderField(
                  "SECURITY",
                  "passwordRequireUppercase",
                  categorySettings.passwordRequireUppercase,
                  "Require Uppercase Letters",
                  "boolean"
                )}
                {renderField(
                  "SECURITY",
                  "passwordRequireLowercase",
                  categorySettings.passwordRequireLowercase,
                  "Require Lowercase Letters",
                  "boolean"
                )}
                {renderField(
                  "SECURITY",
                  "passwordRequireNumbers",
                  categorySettings.passwordRequireNumbers,
                  "Require Numbers",
                  "boolean"
                )}
                {renderField(
                  "SECURITY",
                  "passwordRequireSpecialChars",
                  categorySettings.passwordRequireSpecialChars,
                  "Require Special Characters",
                  "boolean"
                )}
              </div>
              {renderField(
                "SECURITY",
                "passwordExpiryDays",
                categorySettings.passwordExpiryDays,
                "Password Expiry (days)",
                "number",
                {
                  description:
                    "Force password change after this many days (0 = never)",
                  min: 0,
                }
              )}
            </div>

            <div className="form-section">
              <h3 className="form-section-title">Advanced Security</h3>
              {renderField(
                "SECURITY",
                "twoFactorRequired",
                categorySettings.twoFactorRequired,
                "Require Two-Factor Authentication",
                "boolean",
                {
                  description: "Force all users to enable 2FA",
                }
              )}
              {renderField(
                "SECURITY",
                "corsOrigins",
                categorySettings.corsOrigins,
                "CORS Allowed Origins",
                "textarea",
                {
                  description: "Comma-separated list of allowed origins",
                  placeholder: "https://example.com, https://app.example.com",
                  rows: 2,
                }
              )}
            </div>
          </div>
        );

      case "BRANDING":
        return (
          <div>
            <div className="alert purple-alert">
              <Palette size={20} style={{ flexShrink: 0 }} />
              <div>
                <h4>Branding & Appearance</h4>
                <p>
                  Customize your brand identity, colors, and company information
                </p>
              </div>
            </div>

            <div className="form-section">
              <h3 className="form-section-title">Logo & Icon</h3>
              <div className="form-grid cols-2">
                <div className="form-field">
                  <label className="form-label">Logo</label>
                  <div className="upload-area">
                    {categorySettings.logoUrl ? (
                      <img
                        src={categorySettings.logoUrl}
                        alt="Logo"
                        className="upload-preview"
                      />
                    ) : (
                      <div className="upload-placeholder">
                        <Upload size={32} />
                        <p>Click to upload logo</p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="form-field">
                  <label className="form-label">Favicon</label>
                  <div className="upload-area">
                    {categorySettings.faviconUrl ? (
                      <img
                        src={categorySettings.faviconUrl}
                        alt="Favicon"
                        className="upload-preview"
                      />
                    ) : (
                      <div className="upload-placeholder">
                        <Upload size={32} />
                        <p>Click to upload favicon</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3 className="form-section-title">Brand Colors</h3>
              <div className="form-grid cols-2">
                {renderField(
                  "BRANDING",
                  "brandColor",
                  categorySettings.brandColor,
                  "Primary Brand Color",
                  "color"
                )}
                {renderField(
                  "BRANDING",
                  "brandColorSecondary",
                  categorySettings.brandColorSecondary,
                  "Secondary Brand Color",
                  "color"
                )}
              </div>
            </div>

            <div className="form-section">
              <h3 className="form-section-title">Company Information</h3>
              {renderField(
                "BRANDING",
                "companyName",
                categorySettings.companyName,
                "Company Name",
                "text"
              )}
              <div className="form-grid cols-2">
                {renderField(
                  "BRANDING",
                  "supportEmail",
                  categorySettings.supportEmail,
                  "Support Email",
                  "email"
                )}
                {renderField(
                  "BRANDING",
                  "supportPhone",
                  categorySettings.supportPhone,
                  "Support Phone",
                  "tel",
                  { placeholder: "+1 (555) 123-4567" }
                )}
              </div>
            </div>

            <div className="form-section">
              <h3 className="form-section-title">Social Media Links</h3>
              <div className="form-grid cols-2">
                {renderField(
                  "BRANDING",
                  "twitterUrl",
                  categorySettings.twitterUrl,
                  "Twitter URL",
                  "url",
                  { placeholder: "https://twitter.com/yourcompany" }
                )}
                {renderField(
                  "BRANDING",
                  "linkedinUrl",
                  categorySettings.linkedinUrl,
                  "LinkedIn URL",
                  "url",
                  { placeholder: "https://linkedin.com/company/yourcompany" }
                )}
                {renderField(
                  "BRANDING",
                  "facebookUrl",
                  categorySettings.facebookUrl,
                  "Facebook URL",
                  "url",
                  { placeholder: "https://facebook.com/yourcompany" }
                )}
                {renderField(
                  "BRANDING",
                  "instagramUrl",
                  categorySettings.instagramUrl,
                  "Instagram URL",
                  "url",
                  { placeholder: "https://instagram.com/yourcompany" }
                )}
              </div>
            </div>
          </div>
        );

      case "INTEGRATIONS":
        return (
          <div>
            <div className="alert yellow-alert">
              <Plug size={20} style={{ flexShrink: 0 }} />
              <div>
                <h4>Third-Party Integrations</h4>
                <p>Connect with external services and platforms</p>
              </div>
            </div>

            <div className="form-section">
              <h3 className="form-section-title">Analytics</h3>
              {renderField(
                "INTEGRATIONS",
                "analyticsEnabled",
                categorySettings.analyticsEnabled,
                "Enable Analytics",
                "boolean"
              )}
              <div className="form-grid cols-2">
                {renderField(
                  "INTEGRATIONS",
                  "googleAnalyticsId",
                  categorySettings.googleAnalyticsId,
                  "Google Analytics ID",
                  "text",
                  { placeholder: "G-XXXXXXXXXX" }
                )}
                {renderField(
                  "INTEGRATIONS",
                  "mixpanelToken",
                  categorySettings.mixpanelToken,
                  "Mixpanel Token",
                  "text",
                  { placeholder: "your-mixpanel-token" }
                )}
              </div>
            </div>

            <div className="form-section">
              <h3 className="form-section-title">Payment Gateways</h3>
              <div className="subsection-card">
                <h4>Stripe</h4>
                {renderField(
                  "INTEGRATIONS",
                  "stripePublicKey",
                  categorySettings.stripePublicKey,
                  "Stripe Public Key",
                  "text",
                  { placeholder: "pk_live_..." }
                )}
                {renderField(
                  "INTEGRATIONS",
                  "stripeSecretKey",
                  categorySettings.stripeSecretKey,
                  "Stripe Secret Key",
                  "password",
                  { placeholder: "sk_live_..." }
                )}
              </div>

              <div className="subsection-card">
                <h4>PayPal</h4>
                {renderField(
                  "INTEGRATIONS",
                  "paypalClientId",
                  categorySettings.paypalClientId,
                  "PayPal Client ID",
                  "text",
                  { placeholder: "your-paypal-client-id" }
                )}
              </div>
            </div>

            <div className="form-section">
              <h3 className="form-section-title">File Storage</h3>
              {renderField(
                "INTEGRATIONS",
                "storageProvider",
                categorySettings.storageProvider,
                "Storage Provider",
                "select",
                {
                  choices: [
                    { value: "local", label: "Local Storage" },
                    { value: "s3", label: "Amazon S3" },
                    { value: "cloudinary", label: "Cloudinary" },
                    { value: "gcs", label: "Google Cloud Storage" },
                  ],
                }
              )}

              {categorySettings.storageProvider === "s3" && (
                <div className="form-grid cols-2">
                  {renderField(
                    "INTEGRATIONS",
                    "s3Bucket",
                    categorySettings.s3Bucket,
                    "S3 Bucket Name",
                    "text"
                  )}
                  {renderField(
                    "INTEGRATIONS",
                    "s3Region",
                    categorySettings.s3Region,
                    "S3 Region",
                    "text",
                    { placeholder: "us-east-1" }
                  )}
                </div>
              )}

              {categorySettings.storageProvider === "cloudinary" &&
                renderField(
                  "INTEGRATIONS",
                  "cloudinaryCloudName",
                  categorySettings.cloudinaryCloudName,
                  "Cloudinary Cloud Name",
                  "text"
                )}
            </div>
          </div>
        );

      case "NOTIFICATIONS":
        return (
          <div>
            <div className="alert pink-alert">
              <Bell size={20} style={{ flexShrink: 0 }} />
              <div>
                <h4>Notification Preferences</h4>
                <p>Configure when and how notifications are sent</p>
              </div>
            </div>

            <div className="form-section">
              <h3 className="form-section-title">Admin Notifications</h3>
              {renderField(
                "NOTIFICATIONS",
                "newUserRegistration",
                categorySettings.newUserRegistration,
                "New User Registration",
                "boolean",
                { description: "Notify admins when new users register" }
              )}
              {renderField(
                "NOTIFICATIONS",
                "newOrder",
                categorySettings.newOrder,
                "New Order",
                "boolean",
                { description: "Notify admins about new orders" }
              )}
              {renderField(
                "NOTIFICATIONS",
                "systemErrors",
                categorySettings.systemErrors,
                "System Errors",
                "boolean",
                { description: "Notify admins about system errors" }
              )}
              {renderField(
                "NOTIFICATIONS",
                "securityAlerts",
                categorySettings.securityAlerts,
                "Security Alerts",
                "boolean",
                { description: "Notify admins about security events" }
              )}
            </div>

            <div className="form-section">
              <h3 className="form-section-title">User Notifications</h3>
              {renderField(
                "NOTIFICATIONS",
                "welcomeEmail",
                categorySettings.welcomeEmail,
                "Welcome Email",
                "boolean",
                { description: "Send welcome email to new users" }
              )}
              {renderField(
                "NOTIFICATIONS",
                "orderConfirmation",
                categorySettings.orderConfirmation,
                "Order Confirmation",
                "boolean",
                { description: "Send order confirmation emails" }
              )}
              {renderField(
                "NOTIFICATIONS",
                "passwordReset",
                categorySettings.passwordReset,
                "Password Reset",
                "boolean",
                { description: "Send password reset emails" }
              )}
              {renderField(
                "NOTIFICATIONS",
                "accountUpdates",
                categorySettings.accountUpdates,
                "Account Updates",
                "boolean",
                { description: "Notify users of account changes" }
              )}
            </div>

            <div className="form-section">
              <h3 className="form-section-title">Webhook Integrations</h3>
              {renderField(
                "NOTIFICATIONS",
                "slackWebhookUrl",
                categorySettings.slackWebhookUrl,
                "Slack Webhook URL",
                "url",
                {
                  placeholder: "https://hooks.slack.com/services/...",
                  description: "Send notifications to Slack channel",
                }
              )}
              {renderField(
                "NOTIFICATIONS",
                "discordWebhookUrl",
                categorySettings.discordWebhookUrl,
                "Discord Webhook URL",
                "url",
                {
                  placeholder: "https://discord.com/api/webhooks/...",
                  description: "Send notifications to Discord channel",
                }
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const currentCategory = categories.find((cat) => cat.key === activeCategory);

  return (
    <div className="settings-container">
      <style>{`
        ${CSS_STYLES}
      `}</style>

      <div className="settings-header">
        <div className="header-content">
          <div className="header-title-section">
            <h1>System Settings</h1>
            <p>Manage your application configuration</p>
          </div>
          {message && (
            <div className={`toast ${message.type}`}>
              {message.type === "success" ? (
                <CheckCircle size={18} />
              ) : (
                <AlertCircle size={18} />
              )}
              <span>{message.text}</span>
            </div>
          )}
        </div>
      </div>

      <div className="settings-main">
        <div className="settings-grid">
          <aside className="settings-sidebar">
            <div className="sidebar-header">
              <h2>Categories</h2>
            </div>
            <nav className="sidebar-nav">
              {categories.map((category) => {
                const Icon = category.icon;
                const isActive = activeCategory === category.key;
                const changed = hasChanges(category.key);

                return (
                  <button
                    key={category.key}
                    onClick={() => setActiveCategory(category.key)}
                    className={`nav-button ${isActive ? "active" : ""} ${
                      isActive ? `${category.color}-category` : ""
                    }`}
                  >
                    <Icon size={20} />
                    <span className="nav-button-text">{category.label}</span>
                    {changed && <span className="nav-indicator" />}
                  </button>
                );
              })}
            </nav>
          </aside>

          <main className="settings-panel">
            <div className="panel-header">
              <div className="panel-header-content">
                {currentCategory && <currentCategory.icon size={24} />}
                <div>
                  <h2>{currentCategory?.label}</h2>
                  {hasChanges(activeCategory) && (
                    <p className="unsaved-notice">You have unsaved changes</p>
                  )}
                </div>
              </div>
            </div>

            <div className="panel-content">{renderCategoryContent()}</div>

            <div className="panel-footer">
              <button
                onClick={() => handleReset(activeCategory)}
                disabled={!hasChanges(activeCategory) || saving}
                className="button button-secondary"
              >
                Discard Changes
              </button>
              <button
                onClick={() => handleSave(activeCategory)}
                disabled={!hasChanges(activeCategory) || saving}
                className="button button-primary"
              >
                {saving ? (
                  <>
                    <RefreshCw className="spinner" size={18} />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

const CSS_STYLES = `
/* Embedded CSS from system-settings.css */
:root {
  --primary-50: #eff6ff;
  --primary-600: #2563eb;
  --primary-700: #1d4ed8;
  --gray-50: #f9fafb;
  --gray-100: #f3f4f6;
  --gray-200: #e5e7eb;
  --gray-300: #d1d5db;
  --gray-400: #9ca3af;
  --gray-500: #6b7280;
  --gray-700: #374151;
  --gray-900: #111827;
  --success-50: #f0fdf4;
  --success-200: #bbf7d0;
  --success-700: #15803d;
  --error-50: #fef2f2;
  --error-200: #fecaca;
  --error-700: #b91c1c;
  --blue-50: #eff6ff;
  --blue-200: #bfdbfe;
  --blue-700: #1d4ed8;
  --green-50: #f0fdf4;
  --green-200: #bbf7d0;
  --green-700: #15803d;
  --red-50: #fef2f2;
  --red-200: #fecaca;
  --red-700: #b91c1c;
  --red-900: #7f1d1d;
  --purple-50: #faf5ff;
  --purple-200: #e9d5ff;
  --purple-700: #7e22ce;
  --purple-900: #581c87;
  --yellow-50: #fefce8;
  --yellow-200: #fef08a;
  --yellow-700: #a16207;
  --yellow-900: #713f12;
  --pink-50: #fdf2f8;
  --pink-200: #fbcfe8;
  --pink-700: #be185d;
  --pink-900: #831843;
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;
  --radius-sm: 0.375rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-xl: 1rem;
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1);
  --transition-base: 200ms cubic-bezier(0.4, 0, 0.2, 1);
  --font-sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

* {
  box-sizing: border-box;
}

.settings-container {
  min-height: 100vh;
  background: linear-gradient(135deg, var(--gray-50) 0%, var(--gray-100) 100%);
  font-family: var(--font-sans);
}

.settings-header {
  background: white;
  border-bottom: 1px solid var(--gray-200);
  position: sticky;
  top: 0;
  z-index: 1000;
  box-shadow: var(--shadow-sm);
}

.header-content {
  max-width: 1280px;
  margin: 0 auto;
  padding: var(--spacing-lg) var(--spacing-xl);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-lg);
}

.header-title-section h1 {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--gray-900);
  margin: 0 0 var(--spacing-xs) 0;
}

.header-title-section p {
  font-size: 0.875rem;
  color: var(--gray-500);
  margin: 0;
}

.settings-main {
  max-width: 1280px;
  margin: 0 auto;
  padding: var(--spacing-xl);
}

.settings-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--spacing-lg);
}

@media (min-width: 1024px) {
  .settings-grid {
    grid-template-columns: 280px 1fr;
  }
  .settings-sidebar {
    position: sticky;
    top: calc(88px + var(--spacing-lg));
    align-self: start;
  }
}

.settings-sidebar {
  background: white;
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--gray-200);
  overflow: hidden;
}

.sidebar-header {
  padding: var(--spacing-lg);
  background: var(--gray-50);
  border-bottom: 1px solid var(--gray-200);
}

.sidebar-header h2 {
  font-size: 1rem;
  font-weight: 600;
  color: var(--gray-900);
  margin: 0;
}

.sidebar-nav {
  padding: var(--spacing-sm);
}

.nav-button {
  width: 100%;
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md) var(--spacing-lg);
  border: 1px solid transparent;
  background: transparent;
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all var(--transition-base);
  font-size: 0.9375rem;
  font-weight: 500;
  color: var(--gray-700);
  margin-bottom: var(--spacing-xs);
}

.nav-button:hover {
  background: var(--gray-50);
}

.nav-button.active {
  color: var(--primary-700);
  background: var(--primary-50);
  border-color: var(--primary-600);
}

.nav-button.active.blue-category {
  color: var(--blue-700);
  background: var(--blue-50);
  border-color: var(--blue-200);
}

.nav-button.active.green-category {
  color: var(--green-700);
  background: var(--green-50);
  border-color: var(--green-200);
}

.nav-button.active.red-category {
  color: var(--red-700);
  background: var(--red-50);
  border-color: var(--red-200);
}

.nav-button.active.purple-category {
  color: var(--purple-700);
  background: var(--purple-50);
  border-color: var(--purple-200);
}

.nav-button.active.yellow-category {
  color: var(--yellow-700);
  background: var(--yellow-50);
  border-color: var(--yellow-200);
}

.nav-button.active.pink-category {
  color: var(--pink-700);
  background: var(--pink-50);
  border-color: var(--pink-200);
}

.nav-button-text {
  flex: 1;
  text-align: left;
}

.nav-indicator {
  width: 8px;
  height: 8px;
  background: #f97316;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.settings-panel {
  background: white;
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--gray-200);
}

.panel-header {
  padding: var(--spacing-xl);
  border-bottom: 1px solid var(--gray-200);
}

.panel-header-content {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.panel-header-content h2 {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--gray-900);
  margin: 0;
}

.unsaved-notice {
  font-size: 0.875rem;
  color: #f97316;
  margin: var(--spacing-xs) 0 0 0;
  font-weight: 500;
}

.panel-content {
  padding: var(--spacing-xl);
}

.alert {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-md);
  padding: var(--spacing-lg);
  border-radius: var(--radius-lg);
  margin-bottom: var(--spacing-xl);
}

.alert h4 {
  font-weight: 600;
  margin: 0 0 var(--spacing-xs) 0;
}

.alert p {
  font-size: 0.875rem;
  line-height: 1.5;
  margin: 0;
}

.alert.blue-alert {
  background: var(--blue-50);
  border: 1px solid var(--blue-200);
  color: var(--blue-700);
}

.alert.red-alert {
  background: var(--red-50);
  border: 1px solid var(--red-200);
  color: var(--red-700);
}

.alert.red-alert h4 {
  color: var(--red-900);
}

.alert.purple-alert {
  background: var(--purple-50);
  border: 1px solid var(--purple-200);
  color: var(--purple-700);
}

.alert.purple-alert h4 {
  color: var(--purple-900);
}

.alert.yellow-alert {
  background: var(--yellow-50);
  border: 1px solid var(--yellow-200);
  color: var(--yellow-700);
}

.alert.yellow-alert h4 {
  color: var(--yellow-900);
}

.alert.pink-alert {
  background: var(--pink-50);
  border: 1px solid var(--pink-200);
  color: var(--pink-700);
}

.alert.pink-alert h4 {
  color: var(--pink-900);
}

.form-section {
  margin-bottom: var(--spacing-xl);
}

.form-section:not(:last-child) {
  padding-bottom: var(--spacing-xl);
  border-bottom: 1px solid var(--gray-200);
}

.form-section-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--gray-900);
  margin: 0 0 var(--spacing-lg) 0;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--spacing-lg);
}

@media (min-width: 768px) {
  .form-grid.cols-2 {
    grid-template-columns: repeat(2, 1fr);
  }
  .form-grid.cols-3 {
    grid-template-columns: repeat(3, 1fr);
  }
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.form-label {
  display: block;
  font-weight: 500;
  color: var(--gray-700);
  font-size: 0.9375rem;
  margin: 0;
}

.form-input,
.form-select,
.form-textarea {
  width: 100%;
  padding: 0.625rem var(--spacing-lg);
  border: 1px solid var(--gray-300);
  border-radius: var(--radius-lg);
  font-size: 0.9375rem;
  color: var(--gray-900);
  background: white;
  transition: all var(--transition-base);
  font-family: var(--font-sans);
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  outline: none;
  border-color: var(--primary-600);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-input::placeholder,
.form-textarea::placeholder {
  color: var(--gray-400);
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
}

.form-description {
  font-size: 0.875rem;
  color: var(--gray-500);
  line-height: 1.5;
  margin: 0;
}

.input-wrapper {
  position: relative;
}

.input-with-icon {
  padding-right: 3rem;
}

.input-with-actions {
  padding-right: 5rem;
}

.input-icon {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  gap: var(--spacing-xs);
}

.icon-button {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-xs);
  border: none;
  background: transparent;
  color: var(--gray-400);
  cursor: pointer;
  border-radius: var(--radius-sm);
  transition: all var(--transition-fast);
  text-decoration: none;
}

.icon-button:hover {
  color: var(--gray-700);
  background: var(--gray-100);
}

.color-input-group {
  display: flex;
  gap: var(--spacing-md);
  align-items: center;
}

.color-picker {
  height: 3rem;
  width: 5rem;
  border: 2px solid var(--gray-300);
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: border-color var(--transition-base);
}

.color-picker:hover {
  border-color: var(--primary-600);
}

.toggle-field {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-lg);
  background: var(--gray-50);
  border-radius: var(--radius-lg);
  transition: background-color var(--transition-base);
}

.toggle-field:hover {
  background: var(--gray-100);
}

.toggle-content {
  flex: 1;
}

.toggle-label {
  font-weight: 500;
  color: var(--gray-900);
  cursor: pointer;
  margin: 0;
}

.toggle-switch {
  position: relative;
  display: inline-flex;
  align-items: center;
  height: 1.5rem;
  width: 2.75rem;
  background: var(--gray-300);
  border-radius: 9999px;
  border: none;
  cursor: pointer;
  transition: background-color var(--transition-base);
}

.toggle-switch.active {
  background: var(--primary-600);
}

.toggle-slider {
  display: block;
  height: 1rem;
  width: 1rem;
  background: white;
  border-radius: 50%;
  transform: translateX(0.25rem);
  transition: transform var(--transition-base);
  box-shadow: var(--shadow-sm);
}

.toggle-switch.active .toggle-slider {
  transform: translateX(1.5rem);
}

.upload-area {
  border: 2px dashed var(--gray-300);
  border-radius: var(--radius-lg);
  padding: var(--spacing-xl);
  text-align: center;
  cursor: pointer;
  transition: all var(--transition-base);
}

.upload-area:hover {
  border-color: var(--primary-600);
  background: var(--gray-50);
}

.upload-placeholder {
  color: var(--gray-400);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-sm);
}

.upload-placeholder p {
  font-size: 0.875rem;
  margin: 0;
}

.upload-preview {
  max-height: 6rem;
  margin: 0 auto;
  border-radius: var(--radius-md);
}

.subsection-card {
  background: var(--gray-50);
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
}

.subsection-card h4 {
  font-weight: 600;
  color: var(--gray-900);
  margin: 0 0 var(--spacing-md) 0;
}

.subsection-card + .subsection-card {
  margin-top: var(--spacing-lg);
}

.panel-footer {
  padding: var(--spacing-xl);
  background: var(--gray-50);
  border-top: 1px solid var(--gray-200);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-md);
}

.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  padding: 0.625rem var(--spacing-lg);
  font-size: 0.9375rem;
  font-weight: 500;
  border-radius: var(--radius-lg);
  border: none;
  cursor: pointer;
  transition: all var(--transition-base);
  font-family: var(--font-sans);
}

.button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.button-secondary {
  color: var(--gray-700);
  background: white;
  border: 1px solid var(--gray-300);
}

.button-secondary:hover:not(:disabled) {
  background: var(--gray-50);
}

.button-primary {
  color: white;
  background: var(--primary-600);
  padding-left: var(--spacing-xl);
  padding-right: var(--spacing-xl);
}

.button-primary:hover:not(:disabled) {
  background: var(--primary-700);
  box-shadow: var(--shadow-md);
}

.toast {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md) var(--spacing-lg);
  border-radius: var(--radius-lg);
  font-size: 0.875rem;
  font-weight: 500;
  box-shadow: var(--shadow-md);
  animation: slideIn var(--transition-base);
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-1rem);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.toast.success {
  background: var(--success-50);
  color: var(--success-700);
  border: 1px solid var(--success-200);
}

.toast.error {
  background: var(--error-50);
  color: var(--error-700);
  border: 1px solid var(--error-200);
}

.toast.info {
  background: #eff6ff;
  color: #1d4ed8;
  border: 1px solid #bfdbfe;
}

.loading-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 16rem;
}

.spinner {
  animation: spin 1s linear infinite;
  color: var(--primary-600);
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 1023px) {
  .settings-grid {
    gap: var(--spacing-md);
  }
  
  .settings-sidebar {
    margin-bottom: var(--spacing-md);
  }
  
  .header-content {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .panel-footer {
    flex-direction: column-reverse;
  }
  
  .button {
    width: 100%;
  }
}

@media (max-width: 640px) {
  .settings-main {
    padding: var(--spacing-md);
  }
  
  .header-content {
    padding: var(--spacing-md);
  }
  
  .panel-content {
    padding: var(--spacing-md);
  }
  
  .panel-header {
    padding: var(--spacing-md);
  }
  
  .panel-footer {
    padding: var(--spacing-md);
  }
  
  .form-grid.cols-2,
  .form-grid.cols-3 {
    grid-template-columns: 1fr;
  }
}
`;

export default SystemSettingsUI;
