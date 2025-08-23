import React from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '../layout/layout';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { useCart } from '@/contexts/CartContext';
import { ShoppingCart, Trash2 } from 'lucide-react';

export const CartPage: React.FC = () => {
  const { items, removeFromCart, clearCart, totalPrice } = useCart();

  const handleRemoveItem = (courseId: string) => {
    removeFromCart(courseId);
  };

  const handleClearCart = () => {
    clearCart();
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-3 mb-8">
          <ShoppingCart className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <span className="text-gray-600">({items.length} items)</span>
        </div>

        {items.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Your cart is empty
              </h2>
              <p className="text-gray-600 mb-6">
                Add some courses to get started with your learning journey.
              </p>
              <Link to="/courses">
                <Button>
                  Browse Courses
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="space-y-4">
                {items.map((item) => (
                  <Card key={item.id}>
                    <CardContent className="p-6">
                      <div className="flex gap-4">
                        <img
                          src={item.course.thumbnailUrl || '/placeholder-course.jpg'}
                          alt={item.course.title}
                          className="w-24 h-16 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1">
                            {item.course.title}
                          </h3>
                          <p className="text-sm text-gray-600 mb-2">
                            by {item.course.instructor.firstName} {item.course.instructor.lastName}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-lg font-bold text-blue-600">
                              ${item.course.price.toFixed(2)}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveItem(item.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="mt-6 flex gap-4">
                <Link to="/courses">
                  <Button variant="outline">
                    Continue Shopping
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  onClick={handleClearCart}
                  className="text-red-600 hover:text-red-700"
                >
                  Clear Cart
                </Button>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Subtotal ({items.length} items)</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total</span>
                      <span>${totalPrice.toFixed(2)}</span>
                    </div>
                  </div>
                  <Button className="w-full" size="lg">
                    Checkout
                  </Button>
                  <p className="text-xs text-gray-600 text-center">
                    Secure checkout with SSL encryption
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};