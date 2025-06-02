import { renderHook } from '@testing-library/react-hooks';
import { describe, it, expect, beforeEach } from 'vitest';
import { act } from 'react-dom/test-utils';
import { AuthProvider } from '../context/AuthContext';
import { CartProvider, useCart } from '../context/CartContext';

const mockItem1 = { _id: '1', name: 'Item 1', price: 100 };
const mockItem2 = { _id: '2', name: 'Item 2', price: 200 };

let wrapper;

beforeEach(() => {
  localStorage.clear(); // Clear local storage before each test
  wrapper = ({ children }) => (
    <AuthProvider>
      <CartProvider>{children}</CartProvider>
    </AuthProvider>
  );
});

describe('CartContext', () => {  it('should add item to cart only once and prevent duplicates', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    // First attempt - should add successfully
    act(() => {
      result.current.addItem(mockItem1);
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.subtotal).toBe(100);

    // Second attempt - should not add duplicate
    act(() => {
      result.current.addItem(mockItem1);
    });

    // Length should still be 1 and subtotal unchanged
    expect(result.current.items).toHaveLength(1);
    expect(result.current.subtotal).toBe(100);

    // Different item should be added successfully
    act(() => {
      result.current.addItem(mockItem2);
    });

    expect(result.current.items).toHaveLength(2);
    expect(result.current.subtotal).toBe(300);
  });  it('should remove entire item from cart when remove is clicked', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    // Add two items
    act(() => {
      result.current.addItem(mockItem1);
      result.current.addItem(mockItem2);
    });

    expect(result.current.items).toHaveLength(2);
    expect(result.current.subtotal).toBe(300);

    // Remove first item - should remove completely
    act(() => {
      result.current.removeItem(mockItem1._id);
    });

    // Should have only one item left
    expect(result.current.items).toHaveLength(1);
    expect(result.current.subtotal).toBe(200);
    expect(result.current.items[0]._id).toBe(mockItem2._id);
  });it('should handle edge cases like items with quantity 0', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    // Try to add item with quantity 0
    act(() => {
      result.current.addItem({ ...mockItem1, quantity: 0 });
    });

    expect(result.current.items).toHaveLength(0);
    expect(result.current.subtotal).toBe(0);

    // Try to add item with quantity 1 first, then set to 0
    act(() => {
      result.current.addItem({ ...mockItem2, quantity: 1 });
      result.current.addItem({ ...mockItem2, quantity: 0 });
    });

    expect(result.current.items).toHaveLength(0);
    expect(result.current.subtotal).toBe(0);
  });
});
