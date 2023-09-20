import React from "react";
import Spinner from "./spinner";
import Button from "../button";
import "../styles/createNew.css";

export default function MessageData({
  message,
  handleCloseMessage,
  networkStatus,
  networkMessage,
  handleCloseNetworkMessage,
  localStorageRestore,
  restoreBackup,
  localStorageNotice,
}) {
  return (
    <>
      {message && (
        <div className="message">
          <p>{message}</p>
          <span
            onClick={handleCloseMessage}
            className="message__btn closed"
          ></span>
        </div>
      )}

      {networkStatus === false && (
        <div className="message no-network">
          <div>
            <Spinner className="spinner network-spinner" />
            {/* <span className="spinner network-spinner"></span> */}
            {networkMessage}
          </div>
          <span
            onClick={handleCloseNetworkMessage}
            className="message__btn closed"
          ></span>
        </div>
      )}

      {!networkStatus && !localStorageRestore && (
        <div id="localStorage-notice" className="loca">
          {localStorageNotice}
        </div>
      )}

      {localStorageRestore && (
        <div className="localStorage-restore">
          <p>
            The backup of this post in your browser is different from the
            version below.
          </p>
          <Button
            onClick={restoreBackup}
            title="Restore Backup"
            type="button"
            className="btn__action"
          />
          <p className="help-message">
            This will replace the current editor content with the last backup
            version. You can use undo and redo in the editor to get the old
            content back or to return to the restored version.
          </p>
        </div>
      )}
    </>
  );
}
