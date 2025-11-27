import React, { useState, useEffect, useRef, useCallback } from "react";
import PropTypes from "prop-types";
import "../styles/searchBox.css";

export default function SearchBox({
  value = "",
  onChange,
  placeholder = "Search...",
  debounceDelay = 300,
  className = "",
  disabled = false,
  autoFocus = false,
  minLength = 0,
  maxLength = 100,
  showClearButton = true,
  showSearchIcon = true,
  showCharacterCount = false,
  onClear,
  onFocus,
  onBlur,
  ariaLabel = "Search",
}) {
  const [localValue, setLocalValue] = useState(value);
  const [isFocused, setIsFocused] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const inputRef = useRef(null);
  const debounceTimerRef = useRef(null);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleChange = useCallback(
    (e) => {
      const newValue = e.target.value;
      setLocalValue(newValue);
      setIsTyping(true);

      // Clear existing timer
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      // Set new timer
      debounceTimerRef.current = setTimeout(() => {
        if (onChange) {
          onChange(newValue);
        }
        setIsTyping(false);
      }, debounceDelay);
    },
    [onChange, debounceDelay]
  );

  const handleClear = useCallback(
    (e) => {
      e.preventDefault();
      setLocalValue("");
      setIsTyping(false);

      // Clear debounce timer
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      if (onChange) {
        onChange("");
      }

      if (onClear) {
        onClear();
      }

      // Focus input
      if (inputRef.current) {
        inputRef.current.focus();
      }
    },
    [onChange, onClear]
  );

  const handleFocus = useCallback(
    (e) => {
      setIsFocused(true);
      if (onFocus) {
        onFocus(e);
      }
    },
    [onFocus]
  );

  const handleBlur = useCallback(
    (e) => {
      setIsFocused(false);
      if (onBlur) {
        onBlur(e);
      }
    },
    [onBlur]
  );

  const handleKeyDown = useCallback(
    (e) => {
      // Escape key - clear search
      if (e.key === "Escape") {
        e.preventDefault();
        if (localValue) {
          handleClear(e);
        } else if (inputRef.current) {
          inputRef.current.blur();
        }
      }

      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        if (inputRef.current && !isFocused) {
          inputRef.current.focus();
        }
      }
    },
    [localValue, isFocused, handleClear]
  );

  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }
    };

    document.addEventListener("keydown", handleGlobalKeyDown);
    return () => {
      document.removeEventListener("keydown", handleGlobalKeyDown);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  const showClear = showClearButton && localValue && !disabled;

  const characterCount = localValue.length;
  const isNearLimit = maxLength && characterCount >= maxLength * 0.8;

  return (
    <div
      className={`searchBox__container ${
        isFocused ? "searchBox__container--focused" : ""
      } ${disabled ? "searchBox__container--disabled" : ""} ${className}`}
      role="search"
    >
      {showSearchIcon && (
        <div className="searchBox__icon searchBox__icon--search">
          <i
            className={`fa ${isTyping ? "fa-spinner fa-spin" : "fa-search"}`}
            aria-hidden="true"
          ></i>
        </div>
      )}

      <input
        ref={inputRef}
        type="text"
        className="searchBox__input"
        value={localValue}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        minLength={minLength}
        maxLength={maxLength}
        aria-label={ariaLabel}
        aria-describedby={showCharacterCount ? "search-char-count" : undefined}
        autoComplete="off"
        spellCheck="false"
      />

      {showClear && (
        <button
          type="button"
          className="searchBox__clear-btn"
          onClick={handleClear}
          aria-label="Clear search"
          title="Clear search (Esc)"
          tabIndex={-1}
        >
          <i className="fa fa-times-circle" aria-hidden="true"></i>
        </button>
      )}

      {!isFocused && !localValue && !disabled && (
        <div className="searchBox__shortcut-hint" aria-hidden="true">
          <kbd className="searchBox__kbd">Ctrl</kbd>
          <span className="searchBox__kbd-plus">+</span>
          <kbd className="searchBox__kbd">K</kbd>
        </div>
      )}

      {showCharacterCount && maxLength && isFocused && (
        <div
          className={`searchBox__char-count ${
            isNearLimit ? "searchBox__char-count--warning" : ""
          }`}
          id="search-char-count"
          aria-live="polite"
        >
          {characterCount}/{maxLength}
        </div>
      )}

      <div
        className="searchBox__sr-only"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {isTyping && "Searching..."}
        {localValue && !isTyping && `Search results for: ${localValue}`}
      </div>
    </div>
  );
}

SearchBox.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  debounceDelay: PropTypes.number,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  autoFocus: PropTypes.bool,
  minLength: PropTypes.number,
  maxLength: PropTypes.number,
  showClearButton: PropTypes.bool,
  showSearchIcon: PropTypes.bool,
  showCharacterCount: PropTypes.bool,
  onClear: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  ariaLabel: PropTypes.string,
};
