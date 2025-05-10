import React from "react";
import UserSection from "../UserSection";
import UserAddress from "../common/userAddress";

export default function NavbarActions({
  user,
  geoLocation,
  isDropdownOpen,
  toggleDropdown,
}) {
  return (
    <section className="navbar-actions">
      <UserSection
        user={user}
        geoLocation={geoLocation?.country}
        isDropdownOpen={isDropdownOpen}
        toggleDropdown={toggleDropdown}
      />
      <UserAddress geoLocation={geoLocation?.country_name} user={user} />
    </section>
  );
}
