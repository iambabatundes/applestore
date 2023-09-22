import React from "react";
import "../styles/createNew.css";
import PublishActions from "./PublishActions";
import PublishVisibility from "./publishVisibility";
import PublishImmediately from "./publishImmediately";
import PublishStatus from "./publishStatus";
import SavePreviewAction from "./savePreviewAction";

export default function PublishData({
  isContentVisible,
  handleSaveDraft,
  networkStatus,
  savingDraft,
  handlePostPublish,
  handlePostDelete,
  publishing,
  handleCancelDateTime,
  day,
  handleEditDateTime,
  year,
  month,
  hour,
  minute,
  setDay,
  setHour,
  setMinute,
  setMonth,
  setYear,
  handleSaveDateTime,
  immediateDisplay,
  isImmediate,
  handleVisibilityCancel,
  handleVisibilityEdit,
  handleVisibilitySave,
  isEditingVisibility,
  setVisibility,
  stickToTop,
  visibility,
  visibilityOptions,
  postPublished,
  setStickToTop,
  months,
}) {
  return (
    <>
      {isContentVisible && (
        <>
          <SavePreviewAction
            handlePostPublish={handlePostPublish}
            handleSaveDraft={handleSaveDraft}
            networkStatus={networkStatus}
            savingDraft={savingDraft}
          />
          <div className="publishing-actions">
            <PublishStatus />

            <PublishVisibility
              handleVisibilityCancel={handleVisibilityCancel}
              handleVisibilityEdit={handleVisibilityEdit}
              handleVisibilitySave={handleVisibilitySave}
              isEditingVisibility={isEditingVisibility}
              setVisibility={setVisibility}
              stickToTop={stickToTop}
              visibility={visibility}
              visibilityOptions={visibilityOptions}
              setStickToTop={setStickToTop}
            />

            <PublishImmediately
              day={day}
              handleCancelDateTime={handleCancelDateTime}
              handleEditDateTime={handleEditDateTime}
              handleSaveDateTime={handleSaveDateTime}
              hour={hour}
              immediateDisplay={immediateDisplay}
              isImmediate={isImmediate}
              minute={minute}
              month={month}
              months={months}
              setDay={setDay}
              setHour={setHour}
              setMinute={setMinute}
              setMonth={setMonth}
              setYear={setYear}
              year={year}
            />
          </div>
          <PublishActions
            handlePostDelete={handlePostDelete}
            networkStatus={networkStatus}
            handlePostPublish={handlePostPublish}
            postPublished={postPublished}
            publishing={publishing}
          />
        </>
      )}
    </>
  );
}
