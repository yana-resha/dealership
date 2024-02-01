import React from 'react'

export const CustomFileDownloader = ({ onClickRemove }) => (
  <div data-testid="uploadFile">
    <button data-testid="uploadFileRemove" onClick={onClickRemove} />
  </div>
)
