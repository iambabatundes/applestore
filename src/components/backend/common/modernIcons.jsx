// Modern SVG Icon Components with Unique Colors
export const Icons = {
  Dashboard: ({ size = 24, className = "" }) => (
    <div
      className={`icon-wrapper ${className}`}
      style={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        borderRadius: "8px",
        padding: "0px",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <rect
          x="3"
          y="3"
          width="7"
          height="7"
          rx="1.5"
          stroke="white"
          strokeWidth="2"
        />
        <rect
          x="14"
          y="3"
          width="7"
          height="7"
          rx="1.5"
          stroke="white"
          strokeWidth="2"
        />
        <rect
          x="3"
          y="14"
          width="7"
          height="7"
          rx="1.5"
          stroke="white"
          strokeWidth="2"
        />
        <rect
          x="14"
          y="14"
          width="7"
          height="7"
          rx="1.5"
          stroke="white"
          strokeWidth="2"
        />
      </svg>
    </div>
  ),

  Posts: ({ size = 24, className = "" }) => (
    <div
      className={`icon-wrapper ${className}`}
      style={{
        background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
        borderRadius: "8px",
        padding: "1px",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path
          d="M13 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V9L13 2Z"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M13 2V9H20"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  ),

  Products: ({ size = 24, className = "" }) => (
    <div
      className={`icon-wrapper ${className}`}
      style={{
        background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
        borderRadius: "8px",
        padding: "1px",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path
          d="M20 7H4C2.89543 7 2 7.89543 2 9V19C2 20.1046 2.89543 21 4 21H20C21.1046 21 22 20.1046 22 19V9C22 7.89543 21.1046 7 20 7Z"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M16 21V5C16 4.46957 15.7893 3.96086 15.4142 3.58579C15.0391 3.21071 14.5304 3 14 3H10C9.46957 3 8.96086 3.21071 8.58579 3.58579C8.21071 3.96086 8 4.46957 8 5V21"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  ),

  Media: ({ size = 24, className = "" }) => (
    <div
      className={`icon-wrapper ${className}`}
      style={{
        background: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
        borderRadius: "8px",
        padding: "1px",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <rect
          x="3"
          y="3"
          width="18"
          height="18"
          rx="2"
          stroke="white"
          strokeWidth="2"
        />
        <circle cx="8.5" cy="8.5" r="1.5" fill="white" />
        <path
          d="M21 15L16 10L5 21"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  ),

  Orders: ({ size = 24, className = "" }) => (
    <div
      className={`icon-wrapper ${className}`}
      style={{
        background: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
        borderRadius: "8px",
        padding: "1px",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path
          d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M14 2V8H20"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M16 13H8"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M16 17H8"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M10 9H9H8"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  ),

  Promotion: ({ size = 24, className = "" }) => (
    <div
      className={`icon-wrapper ${className}`}
      style={{
        background: "linear-gradient(135deg, #ffa751 0%, #ffe259 100%)",
        borderRadius: "8px",
        padding: "1px",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path
          d="M21 12L19 10.5L21 9V6L18 5L17 2H14L12.5 4L11 2H8L7 5L4 6V9L6 10.5L4 12V15L7 16L8 19H11L12.5 17L14 19H17L18 16L21 15V12Z"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="12" cy="12" r="3" stroke="white" strokeWidth="2" />
      </svg>
    </div>
  ),

  Coupon: ({ size = 24, className = "" }) => (
    <div
      className={`icon-wrapper ${className}`}
      style={{
        background: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
        borderRadius: "8px",
        padding: "1px",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path
          d="M21 8V16C21 16.5304 20.7893 17.0391 20.4142 17.4142C20.0391 17.7893 19.5304 18 19 18H5C4.46957 18 3.96086 17.7893 3.58579 17.4142C3.21071 17.0391 3 16.5304 3 16V8M21 8C21 7.46957 20.7893 6.96086 20.4142 6.58579C20.0391 6.21071 19.5304 6 19 6H5C4.46957 6 3.96086 6.21071 3.58579 6.58579C3.21071 6.96086 3 7.46957 3 8M21 8V10C20.4696 10 19.9609 10.2107 19.5858 10.5858C19.2107 10.9609 19 11.4696 19 12C19 12.5304 19.2107 13.0391 19.5858 13.4142C19.9609 13.7893 20.4696 14 21 14V16M3 8V10C3.53043 10 4.03914 10.2107 4.41421 10.5858C4.78929 10.9609 5 11.4696 5 12C5 12.5304 4.78929 13.0391 4.41421 13.4142C4.03914 13.7893 3.53043 14 3 14V16"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <line
          x1="10"
          y1="9"
          x2="10"
          y2="15"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="2 2"
        />
      </svg>
    </div>
  ),

  Pages: ({ size = 24, className = "" }) => (
    <div
      className={`icon-wrapper ${className}`}
      style={{
        background: "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)",
        borderRadius: "8px",
        padding: "1px",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path
          d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M14 2V8H20"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  ),

  Users: ({ size = 24, className = "" }) => (
    <div
      className={`icon-wrapper ${className}`}
      style={{
        background: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)",
        borderRadius: "8px",
        padding: "1px",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path
          d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="9" cy="7" r="4" stroke="white" strokeWidth="2" />
        <path
          d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  ),

  Settings: ({ size = 24, className = "" }) => (
    <div
      className={`icon-wrapper ${className}`}
      style={{
        background: "linear-gradient(135deg, #868f96 0%, #596164 100%)",
        borderRadius: "8px",
        padding: "1px",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="3" stroke="white" strokeWidth="2" />
        <path
          d="M12 1V3M12 21V23M4.22 4.22L5.64 5.64M18.36 18.36L19.78 19.78M1 12H3M21 12H23M4.22 19.78L5.64 18.36M18.36 5.64L19.78 4.22"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </div>
  ),

  AdminManagement: ({ size = 24, className = "" }) => (
    <div
      className={`icon-wrapper ${className}`}
      style={{
        background: "linear-gradient(135deg, #f857a6 0%, #ff5858 100%)",
        borderRadius: "8px",
        padding: "1px",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path
          d="M12 15C15.866 15 19 13.2091 19 11C19 8.79086 15.866 7 12 7C8.13401 7 5 8.79086 5 11C5 13.2091 8.13401 15 12 15Z"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M8.21 13.89L7 23L12 20L17 23L15.79 13.88"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12 12V7"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M12 7C12.5523 7 13 6.55228 13 6C13 5.44772 12.5523 5 12 5C11.4477 5 11 5.44772 11 6C11 6.55228 11.4477 7 12 7Z"
          fill="white"
        />
      </svg>
    </div>
  ),
};

export const getIconByLabel = (label) => {
  const iconMap = {
    Dashboard: Icons.Dashboard,
    Posts: Icons.Posts,
    Products: Icons.Products,
    Media: Icons.Media,
    Orders: Icons.Orders,
    Promotion: Icons.Promotion,
    Coupon: Icons.Coupon,
    Pages: Icons.Pages,
    Users: Icons.Users,
    Settings: Icons.Settings,
    "Admin Management": Icons.AdminManagement,
  };

  return iconMap[label] || Icons.Dashboard;
};
