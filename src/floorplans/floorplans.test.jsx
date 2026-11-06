import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import '../i18n'
import {
  PageFrame,
  PageHeader,
  PageToolbar,
  PageSearch,
  FloorplanFooter,
  PageState,
  ListDetailLayout,
} from '.'

describe('PageFrame', () => {
  it('renders the header, toolbar and content', () => {
    render(
      <PageFrame
        header={<PageHeader title="Athletes" primaryAction={{ id: 'add', label: 'Add athlete', onClick: () => {} }} />}
        toolbar={<PageToolbar><PageSearch value="" onChange={() => {}} /></PageToolbar>}
      >
        <p>Content</p>
      </PageFrame>
    )
    expect(screen.getByText('Athletes')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Add athlete' })).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: 'Search' })).toBeInTheDocument()
    expect(screen.getByText('Content')).toBeInTheDocument()
  })

  it('replaces the toolbar with the selection bar while rows are selected', () => {
    const toolbar = <PageToolbar><span>Filters</span></PageToolbar>
    const actions = [{ id: 'export', label: 'Export', onClick: () => {} }]
    const { rerender } = render(<PageFrame toolbar={toolbar} selection={{ count: 0, actions }} />)
    expect(screen.getByText('Filters')).toBeInTheDocument()

    rerender(<PageFrame toolbar={toolbar} selection={{ count: 2, actions }} />)
    expect(screen.queryByText('Filters')).not.toBeInTheDocument()
    expect(screen.getByText(/2 selected/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Export' })).toBeInTheDocument()
  })
})

describe('FloorplanFooter', () => {
  it('puts Cancel first and the primary action last', () => {
    const onCancel = vi.fn()
    render(
      <FloorplanFooter
        onCancel={onCancel}
        actions={[{ id: 'back', label: 'Back', onClick: () => {} }]}
        primaryAction={{ label: 'Next', onClick: () => {} }}
      />
    )
    const labels = screen.getAllByRole('button').map((b) => b.textContent)
    expect(labels).toEqual(['Cancel', 'Back', 'Next'])
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }))
    expect(onCancel).toHaveBeenCalled()
  })

  it('renders nothing when closed', () => {
    render(<FloorplanFooter open={false} primaryAction={{ label: 'Save', onClick: () => {} }} />)
    expect(screen.queryByTestId('FloorplanFooter')).not.toBeInTheDocument()
  })
})

describe('PageState', () => {
  it('shows the default message for a kind', () => {
    render(<PageState kind="noResults" />)
    expect(screen.getByText('No results')).toBeInTheDocument()
  })

  it('shows an action', () => {
    const onClick = vi.fn()
    render(<PageState title="No athletes yet" action={{ label: 'Add athlete', onClick }} />)
    fireEvent.click(screen.getByRole('button', { name: 'Add athlete' }))
    expect(onClick).toHaveBeenCalled()
  })
})

describe('ListDetailLayout', () => {
  // The test environment's matchMedia matches nothing, so this is the one-pane (compact) layout.
  it('shows the list until something is selected, then the detail with Back', () => {
    const onBack = vi.fn()
    const { rerender } = render(
      <ListDetailLayout list={<p>List</p>} detail={<p>Detail</p>} hasSelection={false} onBack={onBack} />
    )
    expect(screen.getByText('List')).toBeInTheDocument()
    expect(screen.queryByText('Detail')).not.toBeInTheDocument()

    rerender(<ListDetailLayout list={<p>List</p>} detail={<p>Detail</p>} hasSelection onBack={onBack} />)
    expect(screen.getByText('Detail')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Back' }))
    expect(onBack).toHaveBeenCalled()
  })
})
