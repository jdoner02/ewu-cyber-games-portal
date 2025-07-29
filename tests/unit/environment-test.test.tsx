/**
 * Simple test to verify test environment is working
 */
import { render, screen } from '@testing-library/react';

// Simple test component
function TestComponent() {
  return <div data-testid="test-component">Hello Test</div>;
}

describe('🧪 Test Environment Verification', () => {
  test('should render simple component', () => {
    render(<TestComponent />);
    expect(screen.getByTestId('test-component')).toBeInTheDocument();
  });
});
