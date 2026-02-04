import '@testing-library/jest-dom'

// Global test setup for all tests

// React Router v6 prints v7 future-flag warnings to console in test runs.
// These are informational and can be noisy; filter them so real warnings stand out.
const originalWarn = console.warn
console.warn = (...args: unknown[]) => {
	const first = args[0]
	if (typeof first === 'string' && first.includes('React Router Future Flag Warning')) {
		return
	}
	originalWarn(...args)
}