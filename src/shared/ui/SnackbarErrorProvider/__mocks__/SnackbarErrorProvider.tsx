import React from 'react'

export const useSnackbarErrorContext = () => ({ show: jest.fn() })

export const SnackbarErrorProvider = ({ children }) => <div>{children}</div>
