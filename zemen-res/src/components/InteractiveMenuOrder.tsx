import React, { useState } from "react";
import Swal from "sweetalert2";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { motion } from "framer-motion";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY!);

interface MenuItem {
    name: string;
    price: string;
    description?: string;
}

interface MenuSection {
    title: string;
    items: MenuItem[];
}

interface Props {
    quantities: { [key: string]: number };
    setQuantities: React.Dispatch<React.SetStateAction<{ [key: string]: number }>>;
}

interface OrderData {
    name: string;
    phone: string;
    order_type: string;
    total_price: number;
    special_request: string;
    items: { name: string; quantity: number; price: number }[];
    delivery_address?: string;
    pickup_payment_method?: "store" | "online";
}

const menuData: MenuSection[] = [
  {
    title: "Breakfast",
    items: [
      { name: "Kinche", price: "$7.99", description: "Cracked wheat seasoned with clarified and spiced butter." },
      { name: "Chechebsa", price: "$7.99", description: "Flat wheat bread cut into pieces mixed with berbere and spiced batter." },
      { name: "Firfir", price: "$9.99", description: "Injera mixed with onions, tomatoes, jalapenos, tossed in berbere sauce." },
      { name: "Scrambled Eggs", price: "$8.99", description: "Scrambled eggs with tomatoes, onions, and jalapenos. Served with bread." },
      { name: "Breakfast Combo", price: "$17.99" },
      { name: "Full", price: "$7.99", description: "Fava beans seasoned with olive oil, garlic, onions. Served with fresh diced tomatoes, jalapenos, and a side of warm bread." },
      { name: "Special Full", price: "$9.99", description: "Fava beans with olive oil, garlic, onions, tomatoes, jalapenos, eggs, and bread." },
      { name: "Sambusa", price: "$3.99", description: "Lightly fried pastry filled with spiced lentils or minced beef." },
      { name: "Tibs Firfir", price: "$14.99+" },
    ],
  },
  {
    title: "Vegan / Vegetarian",
    items: [
      { name: "Rice With Veggies", price: "$8.99+", description: "Fragrant rice cooked with vegetables, lightly seasoned with Ethiopian spices." },
      { name: "Veggie Combo", price: "$15.99", description: "Combination of all the vegan plates." },
      { name: "Shiro Wot", price: "$12.99", description: "Chickpea flour stew with onions, garlic, and seasoned oil." },
      { name: "Agelgil", price: "$12.99", description: "Veggie combo layered with injera." },
      { name: "Pasta", price: "$9.99+", description: "Spaghetti tossed in a rich, spiced tomato sauce." },
      { name: "Vegan Buffet", price: "$20.00" },
      { name: "Misir", price: "$5.00" },
    ],
  },
  {
    title: "Fish Plates",
    items: [
      { name: "Asa Wot", price: "$15.99", description: "Fish stew with fish pieces in spiced berbere sauce. Served with injera." },
      { name: "Asa Dulet", price: "$15.99", description: "Finely chopped fish with garlic, onions, and Ethiopian spices." },
      { name: "Asa Goulash", price: "$15.99", description: "Fish chunks in a mild tomato sauce. Served with injera or bread." },
      { name: "Asa Sandwich", price: "$9.99" },
      { name: "Whole Fish", price: "$20.00" },
      { name: "Small Whole Fish", price: "$15.00" },
    ],
  },
  {
    title: "Meats",
    items: [
      { name: "Tibs", price: "$14.99+" },
      { name: "Zilzil Tibs", price: "$15.99" },
      { name: "Doro Wot", price: "$16.99" },
      { name: "Bozena", price: "$13.99" },
      { name: "Quanta Firfir", price: "$13.99" },
      { name: "Sheckla Tibs", price: "$17.99+" },
      { name: "Gebawhata", price: "$14.99" },
      { name: "Tibs Firfir", price: "$14.99+" },
    ],
  },
  {
    title: "Drinks / Beverages",
    items: [
      { name: "Ethiopian Tea", price: "$1.99" },
      { name: "Coffee", price: "$1.99" },
      { name: "Macchiato", price: "$3.99" },
      { name: "Cappuccino", price: "$3.50" },
      { name: "Latte", price: "$3.99" },
      { name: "Espresso", price: "$2.25" },
      { name: "Iced Tea", price: "$1.99" },
      { name: "Bottled Water", price: "$1.99" },
      { name: "Sparkling Water", price: "$2.50" },
      { name: "Orange Juice", price: "$3.50" },
      { name: "Soda", price: "$2.50" },
      { name: "Sprise", price: "$3.25" },
      { name: "Tej", price: "$10.00" },
      { name: "Bottled Coke", price: "$3.00" },
      { name: "Nonalcoholic Beer", price: "$3.99" },
      { name: "Bottled Fanta", price: "$3.00" },
    ],
  },
];
function parsePrice(priceStr: string): number {
    const match = priceStr.match(/\$([\d.]+)/);
    return match ? parseFloat(match[1]) : 0;
}

export const InteractiveMenuOrder: React.FC<Props> = ({ quantities, setQuantities }) => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const [specialRequest, setSpecialRequest] = useState("");
    const [orderType, setOrderType] = useState<"pickup" | "delivery" | null>(null);
    const [pickupPaymentMethod, setPickupPaymentMethod] = useState<"store" | "online">("store");
    const [showPayment, setShowPayment] = useState(false);
    const [clientSecret, setClientSecret] = useState<string | null>(null);
    const [orderData, setOrderData] = useState<OrderData | null>(null);

    const subtotal = Object.entries(quantities).reduce((acc, [itemName, qty]) => {
        const item = menuData.flatMap(s => s.items).find(i => i.name === itemName);
        return item ? acc + parsePrice(item.price) * qty : acc;
    }, 0);

    const taxRate = 0.0825;
    const totalPrice = subtotal + subtotal * taxRate;

    const toggle = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    const handleQuantityChange = (itemName: string, value: number) => {
        setQuantities({ ...quantities, [itemName]: value });
    };

    const handleSubmit = async () => {
        if (!Object.values(quantities).some(qty => qty > 0)) {
            Swal.fire("Warning", "Please select at least one item to order.", "warning");
            return;
        }

        const orderedItems = Object.entries(quantities)
            .filter(([_, qty]) => qty > 0)
            .map(([name, qty]) => ({
                name,
                quantity: qty,
                price: parsePrice(menuData.flatMap(s => s.items).find(i => i.name === name)?.price || "0"),
            }));

        const orderDataToSend: OrderData = {
            name: "Online Customer",
            phone: "000-000-0000",
            order_type: orderType ?? "",
            total_price: totalPrice,
            special_request: specialRequest,
            items: orderedItems,
        };

        if (orderType === "pickup" && pickupPaymentMethod === "store") {
            await submitOrder(orderDataToSend);
            return;
        }
        console.log("Total price", totalPrice);
        console.log("Amount sending", Math.round(totalPrice * 100));
        
        const paymentResponse = await fetch("http://127.0.0.1:8000/api/orders/create-intent/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ amount: Math.round(totalPrice * 100) }),
        });

        const paymentData = await paymentResponse.json();
        setClientSecret(paymentData.client_secret);
        setOrderData(orderDataToSend);
        setShowPayment(true);
    };

    const submitOrder = async (orderDataToSend: OrderData) => {
        const response = await fetch("http://127.0.0.1:8000/api/orders/submit/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(orderDataToSend),
        });

        if (response.ok) {
            Swal.fire("Success", "Your order has been placed successfully!", "success");
        } else {
            Swal.fire("Error", "Failed to submit order.", "error");
        }

        setQuantities({});
        setSpecialRequest("");
    };

    return (
        <section className="px-6 md:px-24 py-16 bg-white text-gray-900">
            <h2 className="text-4xl font-bold mb-10 text-center">Order Online</h2>

            {menuData.map((section, index) => (
                <div key={index} className="mb-6 rounded-xl overflow-hidden shadow">
                    <button
                        onClick={() => toggle(index)}
                        className="w-full text-left px-6 py-4 bg-yellow-50 hover:bg-yellow-100 font-semibold text-lg flex justify-between"
                    >
                        {section.title} <span>{openIndex === index ? "▲" : "▼"}</span>
                    </button>
                    {openIndex === index && (
                        <div className="space-y-4 p-6 bg-white">
                        {section.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between items-start border-b pb-6">
                            {/* LEFT SIDE */}
                            <div className="flex flex-col items-start space-y-1 w-full">
                            <p className="font-semibold text-lg tracking-tight">{item.name}</p>
                            <p className="text-gray-500 text-sm">{item.price}</p>
                            {item.description && (
                              <p className="text-sm text-gray-400 mt-1">{item.description}</p>
                              )}
                            </div>
                      
                            {/* RIGHT SIDE (Quantity controls) */}
                            <div className="flex gap-2 items-center ml-6">
                              <button
                                onClick={() => handleQuantityChange(item.name, Math.max(0, (quantities[item.name] || 0) - 1))}
                                className="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-full"
                              >
                                -
                              </button>
                              <span className="w-6 text-center">{quantities[item.name] || 0}</span>
                              <button
                                onClick={() => handleQuantityChange(item.name, (quantities[item.name] || 0) + 1)}
                                className="w-8 h-8 bg-green-500 hover:bg-green-600 text-white rounded-full"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                    )}
                </div>
            ))}

            <div className="space-y-6 mt-10">
                <textarea
                    placeholder="Special Request (optional)"
                    className="w-full border p-3 rounded-lg"
                    value={specialRequest}
                    onChange={(e) => setSpecialRequest(e.target.value)}
                />

                <div className="space-y-2">
                    <p className="font-semibold">Order Type:</p>
                    <div className="flex gap-4">
                        <button onClick={() => setOrderType("pickup")} className={`px-5 py-2 rounded-lg ${orderType === "pickup" ? "bg-green-600 text-white" : "bg-gray-200"}`}>
                            Pickup
                        </button>
                        <button disabled className="px-5 py-2 rounded-lg bg-gray-100 text-gray-400 cursor-not-allowed">
                            Delivery (Coming Soon)
                        </button>
                    </div>
                </div>

                {orderType === "pickup" && (
                    <div className="space-y-2">
                        <p className="font-semibold">Pickup Payment:</p>
                        <div className="flex gap-4">
                            <button onClick={() => setPickupPaymentMethod("store")} className={`px-5 py-2 rounded-lg ${pickupPaymentMethod === "store" ? "bg-green-500 text-white" : "bg-gray-200"}`}>
                                Pay at Store
                            </button>
                            <button onClick={() => setPickupPaymentMethod("online")} className={`px-5 py-2 rounded-lg ${pickupPaymentMethod === "online" ? "bg-green-500 text-white" : "bg-gray-200"}`}>
                                Pay Online
                            </button>
                        </div>
                    </div>
                )}

                <div className="text-right space-y-2">
                    <p>Subtotal: ${subtotal.toFixed(2)}</p>
                    <p>Tax: ${(subtotal * taxRate).toFixed(2)}</p>
                    <p className="font-bold text-xl">Total: ${totalPrice.toFixed(2)}</p>
                </div>

                <button onClick={handleSubmit} className="w-full bg-green-600 hover:bg-green-700 text-white text-lg py-4 rounded-lg transition">
                    Place Order
                </button>
            </div>

            {showPayment && clientSecret && orderData && (
                <div className="mt-12">
                    <h3 className="text-2xl font-semibold mb-4 text-center">Complete Payment</h3>
                    <Elements options={{ clientSecret }} stripe={stripePromise}>
                        <PaymentForm orderData={orderData} />
                    </Elements>
                </div>
            )}
        </section>
    );
};

const PaymentForm: React.FC<{ orderData: OrderData }> = ({ orderData }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [cardholderName, setCardholderName] = useState("");
    const [processing, setProcessing] = useState(false);

    const submitOrder = async () => {
        const response = await fetch("http://127.0.0.1:8000/api/orders/submit/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(orderData),
        });

        if (response.ok) {
            Swal.fire("Success", "Your order has been placed!", "success").then(() => {
                window.location.href = "/thank-you";
            });
        } else {
            Swal.fire("Error", "Failed to submit order.", "error");
        }
    };

    const handlePaymentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!stripe || !elements) return;

        setProcessing(true);

        const result = await stripe.confirmPayment({
            elements,
            confirmParams: { payment_method_data: { billing_details: { name: cardholderName } } },
            redirect: "if_required",
        });

        if (result.error) {
            Swal.fire("Payment Failed", result.error.message ?? "Unknown error", "error");
            setProcessing(false);
        } else {
            await submitOrder();
        }
    };

    return (
        <form onSubmit={handlePaymentSubmit} className="space-y-4 bg-white p-6 border rounded-lg shadow">
            <input
                type="text"
                placeholder="Cardholder Name"
                value={cardholderName}
                onChange={(e) => setCardholderName(e.target.value)}
                className="w-full border p-3 rounded"
            />
            <PaymentElement />
            <button type="submit" disabled={!stripe || processing} className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded">
                {processing ? "Processing..." : "Pay Now"}
            </button>
        </form>
    );
};


export const StaticMenuPreview: React.FC = () => {
  return (
    <motion.section
      id="menu-preview"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="px-6 md:px-24 py-16 bg-[#5c2f13] text-white font-serif"
    >
      <div className="max-w-6xl mx-auto border border-yellow-600 p-8 rounded-2xl shadow-lg bg-[#6a3412]">
        <h1 className="text-5xl font-extrabold text-center mb-12 tracking-wide">Menu Preview</h1>
        <div className="grid md:grid-cols-2 gap-12">
          {menuData.map((section, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="space-y-6"
            >
              <h3 className="text-xl font-bold border-b border-white pb-2 uppercase tracking-wide">
                {section.title}
              </h3>
              {section.items.map((item, idx) => (
                <div key={idx}>
                  <div className="flex justify-between font-semibold">
                    <span>{item.name}</span>
                    <span>{item.price}</span>
                  </div>
                  {item.description && (
                    <p className="italic text-sm text-gray-300 mt-1">{item.description}</p>
                  )}
                </div>
              ))}
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};
