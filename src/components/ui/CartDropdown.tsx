import React, { Fragment } from "react";
import { Menu, Transition, MenuButton, MenuItems } from "@headlessui/react";
import { FiShoppingCart, FiTrash } from "react-icons/fi";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/stores/cartContext";

const CartDropdown = () => {
  const { cartCount, cartItems, removeFromCart } = useCart();

  const cartSubtotal = cartItems.reduce((sum, item) => {
    return sum + (item.product?.best_vendor?.price || 0) * item.quantity;
  }, 0);

  return (
    <Menu as="div" className="relative">
      <MenuButton className="text-gray-700 hover:text-[#4DA9FF] transition-colors duration-200 group">
        <div className="relative">
          <FiShoppingCart className="text-2xl transform group-hover:scale-110 transition-transform duration-200" />
          {cartCount > 0 && (
            <span className="absolute top-1 right-0 translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-blue-500 to-[#4DA9FF] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center shadow-md transition-all duration-200 group-hover:scale-110">
              {cartCount}
            </span>
          )}
          <span className="absolute -bottom-1 left-1/2 w-0 h-0.5 bg-[#4DA9FF] group-hover:w-full group-hover:left-0 transition-all duration-300"></span>
        </div>
      </MenuButton>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <MenuItems className="absolute right-0 mt-2 w-80 origin-top-right bg-white rounded-lg shadow-lg border border-gray-100 focus:outline-none z-50">
          <div className="px-4 py-3 border-b border-gray-100">
            <h3 className="text-lg font-medium text-gray-900">Your Cart</h3>
          </div>

          {cartItems.length > 0 ? (
            <>
              <div className="py-2 max-h-[320px] overflow-y-auto custom-scrollbar">
                {cartItems.map((item) => (
                  <div
                    key={item.productId}
                    className="hover:bg-gray-50 px-4 py-3 border-b border-gray-100 last:border-0"
                  >
                    <div className="flex items-center">
                      <div className="w-16 h-16 relative rounded-md overflow-hidden bg-gray-50 flex-shrink-0">
                        {item.product?.images && item.product.images[0] ? (
                          <Image
                            src={item.product.images[0].url}
                            alt={item.product?.name || "Product"}
                            fill
                            className="object-contain p-1"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                            <FiShoppingCart size={20} />
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0 ml-3">
                        <Link
                          href={`/product/${item.productId}`}
                          className="text-sm font-medium text-gray-800 hover:text-[#4DA9FF] truncate block"
                        >
                          {item.product?.name || "Product"}
                        </Link>

                        <div className="flex justify-between items-center mt-1">
                          <span className="text-sm text-gray-500">
                            Qty: {item.quantity}
                          </span>
                          <span className="text-sm font-medium text-[#4DA9FF]">
                            $
                            {(
                              (item.product?.best_vendor?.price || 0) *
                              item.quantity
                            ).toLocaleString()}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.productId)}
                        className="ml-3 text-gray-400 hover:text-red-500 p-1.5 rounded-full hover:bg-gray-100 transition-colors"
                        aria-label="Remove item"
                      >
                        <FiTrash size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 bg-gray-50">
                <div className="flex justify-between font-medium mb-4">
                  <span className="text-gray-700">Subtotal:</span>
                  <span className="text-[#4DA9FF]">
                    ${cartSubtotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex flex-col space-y-2">
                  <Link
                    href="/cart"
                    className="w-full text-center py-2.5 px-4 border border-[#4DA9FF] text-[#4DA9FF] rounded-lg hover:bg-blue-50 transition-colors text-sm font-medium"
                  >
                    View Cart
                  </Link>
                  <Link
                    href="/checkout"
                    className="w-full text-center py-2.5 px-4 bg-[#4DA9FF] hover:bg-blue-500 text-white rounded-lg transition-colors text-sm font-medium"
                  >
                    Checkout
                  </Link>
                </div>
              </div>
            </>
          ) : (
            <div className="py-8 px-4 text-center">
              <div className="w-16 h-16 rounded-full bg-gray-100 mx-auto mb-4 flex items-center justify-center">
                <FiShoppingCart className="text-gray-400" size={24} />
              </div>
              <p className="text-gray-600 mb-4">Your cart is empty</p>
              <Link
                href="/shop"
                className="inline-block text-center text-sm py-2.5 px-6 border border-[#4DA9FF] text-[#4DA9FF] rounded-lg hover:bg-blue-50 transition-colors font-medium"
              >
                Continue Shopping
              </Link>
            </div>
          )}
        </MenuItems>
      </Transition>
    </Menu>
  );
};

export default CartDropdown;
