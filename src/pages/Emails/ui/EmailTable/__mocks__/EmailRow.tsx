import React from 'react'

export const EmailRow = ({ row, onRowClick }) => (
  <div data-testid="dealershipclient.Emails.EmailTable.EmailRow" onClick={() => onRowClick(row.emailId)} />
)
