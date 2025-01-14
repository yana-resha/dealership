// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'

jest.mock('redux-state-sync', () => ({
  createStateSyncMiddleware: () => () => (next: any) => (action: any) => next(action),
  initMessageListener: () => jest.fn(),
}))

jest.spyOn(console, 'error').mockImplementation(() => {})

const mockEnqueue = jest.fn()
jest.mock('notistack', () => ({
  ...jest.requireActual('notistack'),
  useSnackbar: () => ({
    enqueueSnackbar: mockEnqueue,
  }),
}))
