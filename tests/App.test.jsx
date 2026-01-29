import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import App from '../src/App'

const mockNavigate = vi.fn()

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

function renderApp() {
  return render(
    <MemoryRouter>
      <App />
    </MemoryRouter>,
  )
}

describe('Load from URL', () => {
  beforeEach(() => {
    mockNavigate.mockClear()
    // Mock the fetch for index.json so the component mounts cleanly
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      json: () => Promise.resolve([]),
    })
  })

  it('renders the URL input and buttons', () => {
    renderApp()

    expect(screen.getByPlaceholderText('https://example.com/config.json')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Load from URL' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Example' })).toBeInTheDocument()
  })

  it('navigates to /view with encoded URL on submit', () => {
    renderApp()

    const input = screen.getByPlaceholderText('https://example.com/config.json')
    const submitButton = screen.getByRole('button', { name: 'Load from URL' })

    fireEvent.change(input, { target: { value: 'https://example.com/my-config.json' } })
    fireEvent.click(submitButton)

    expect(mockNavigate).toHaveBeenCalledWith(
      `/view?json=${encodeURIComponent('https://example.com/my-config.json')}`,
    )
  })

  it('trims whitespace from the URL before navigating', () => {
    renderApp()

    const input = screen.getByPlaceholderText('https://example.com/config.json')
    const submitButton = screen.getByRole('button', { name: 'Load from URL' })

    fireEvent.change(input, { target: { value: '  https://example.com/config.json  ' } })
    fireEvent.click(submitButton)

    expect(mockNavigate).toHaveBeenCalledWith(
      `/view?json=${encodeURIComponent('https://example.com/config.json')}`,
    )
  })

  it('does not navigate when the URL input is empty', () => {
    renderApp()

    const submitButton = screen.getByRole('button', { name: 'Load from URL' })
    fireEvent.click(submitButton)

    expect(mockNavigate).not.toHaveBeenCalled()
  })

  it('does not navigate when the URL input is only whitespace', () => {
    renderApp()

    const input = screen.getByPlaceholderText('https://example.com/config.json')
    const submitButton = screen.getByRole('button', { name: 'Load from URL' })

    fireEvent.change(input, { target: { value: '   ' } })
    fireEvent.click(submitButton)

    expect(mockNavigate).not.toHaveBeenCalled()
  })

  it('fills in the example URL when the Example button is clicked', () => {
    renderApp()

    const exampleButton = screen.getByRole('button', { name: 'Example' })
    fireEvent.click(exampleButton)

    const input = screen.getByPlaceholderText('https://example.com/config.json')
    expect(input).toHaveValue(
      `${window.location.origin}/view_configs/spectrum_all_cells_csc_chunked_all_10.json`,
    )
  })

  it('submits the example URL after clicking the Example button', () => {
    renderApp()

    const exampleButton = screen.getByRole('button', { name: 'Example' })
    fireEvent.click(exampleButton)

    const submitButton = screen.getByRole('button', { name: 'Load from URL' })
    fireEvent.click(submitButton)

    const expectedUrl = `${window.location.origin}/view_configs/spectrum_all_cells_csc_chunked_all_10.json`
    expect(mockNavigate).toHaveBeenCalledWith(
      `/view?json=${encodeURIComponent(expectedUrl)}`,
    )
  })
})
