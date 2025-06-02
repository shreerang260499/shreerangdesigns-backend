import { renderHook, act } from '@testing-library/react-hooks';
import { describe, it, expect } from 'vitest';
import { AuthProvider } from '../context/AuthContext';
import { CartProvider, useCart } from '../context/CartContext';

const mockItem1 = { _id: '1', name: 'Item 1', price: 100 };
const mockItem2 = { _id: '2', name: 'Item 2', price: 200 };

const wrapper = ({ children }) => (
  <AuthProvider>
    <CartProvider>{children}</CartProvider>
  </AuthProvider>
);

describe('CartContext', () => {
  it('should add items to the cart and calculate subtotal correctly', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addItem(mockItem1);
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.subtotal).toBe(100);

    act(() => {
      result.current.addItem(mockItem2);
    });

    expect(result.current.items).toHaveLength(2);
    expect(result.current.subtotal).toBe(300);
  });

  it('should remove items from the cart and update subtotal correctly', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addItem(mockItem1);
      result.current.addItem(mockItem2);
    });

    expect(result.current.items).toHaveLength(2);
    expect(result.current.subtotal).toBe(300);

    act(() => {
      result.current.removeItem(mockItem1._id);
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.subtotal).toBe(200);
  });

  it('should handle edge cases like items with quantity 0', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addItem({ ...mockItem1, quantity: 0 });
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.subtotal).toBe(0);
  });
});
