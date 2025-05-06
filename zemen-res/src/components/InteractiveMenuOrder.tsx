import React, { useState } from "react";
import Swal from "sweetalert2";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { AnimatePresence, motion } from "framer-motion";
import { API_BASE_URL } from "../utils/api";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY!);

interface MenuItem {
  name: string;
  price: string;
  description?: string;
  badge?: "New" | "Popular" | "Special";
  image?: string;
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
      { name: "Kinche", price: "$7.99", description: "Cracked wheat seasoned with clarified and spiced butter.", image: "/kinche.png", badge: "New" },
      { name: "Chechebsa", price: "$7.99", description: "Flat wheat bread cut into pieces mixed with berbere and spiced batter.", image: "/chechebsa.png" },
      { name: "Firfir", price: "$9.99", description: "Injera mixed with onions, tomatoes, jalapenos, tossed in berbere sauce.", image: "/firfir.png" },
      { name: "Scrambled Eggs", price: "$8.99", description: "Scrambled eggs with tomatoes, onions, and jalapenos. Served with bread.", image: "/scrambledeggs.png" },
      { name: "Breakfast Combo", image: "/breakfastcombo.png", price: "$17.99", description: "Combination of all breakfast items.", badge: "Special" },
      { name: "Full", image: "/full.png", price: "$7.99", description: "Fava beans seasoned with olive oil, garlic, onions. Served with fresh diced tomatoes, jalapenos, and a side of warm bread." },
      { name: "Special Full", price: "$9.99", description: "Fava beans with olive oil, garlic, onions, tomatoes, jalapenos, eggs, and bread.", image: "/specialfull2.png" },
      { name: "Sambusa", price: "$3.99", description: "Lightly fried pastry filled with spiced lentils or minced beef.", image: "/sambusa.png" },
      { name: "Tibs Firfir", price: "$14.99+", description: "Injera mixed with tibs, onions, and jalapenos.", image: "/tibsfirfir.png" },
    ],
  },
  {
    title: "Vegan / Vegetarian",
    items: [
      { name: "Rice With Veggies", price: "$8.99+", description: "Fragrant rice cooked with vegetables, lightly seasoned with Ethiopian spices.", image: "/ricewithveggies.png" },
      { name: "Veggie Combo", price: "$15.99", description: "Combination of all the vegan plates.", image: "/veggiecombo.png" },
      { name: "Shiro Wot", price: "$12.99", description: "Chickpea flour stew with onions, garlic, and seasoned oil.", image: "/shiro.png" },
      { name: "Pasta", price: "$9.99+", description: "Spaghetti tossed in a rich, spiced tomato sauce.", image: "/pasta.png" },
      { name: "Misir", price: "$5.00", image: "/misir.png", description: "Spicy lentil stew with onions, garlic, and Ethiopian spices." },
    ],
  },
  {
    title: "Fish Plates",
    items: [
      { name: "Asa Wot", price: "$15.99", description: "Fish stew with fish pieces in spiced berbere sauce. Served with injera.", image: "/asawot.png" },
      { name: "Asa Dulet", price: "$15.99", description: "Finely chopped fish with garlic, onions, and Ethiopian spices.", image: "/asadulet.png" },
      { name: "Asa Goulash", price: "$15.99", description: "Fish chunks in a mild tomato sauce. Served with injera or bread.", image: "/asagoulash.png" },
      { name: "Whole Fish", price: "$20.00", description: "Whole fish seasoned and grilled to perfection.", image: "/wholefish.png" },
    ],
  },
  {
    title: "Meats",
    items: [
      { name: "Tibs", price: "$14.99+", description: "Grilled meat sautéed with onions, jalapenos, and spices.", image: "/tibs.png" },
      { name: "Zilzil Tibs", price: "$15.99", description: "Sliced beef sautéed with onions, jalapenos, and spices.", image: "/zilziltibs.png" },
      { name: "Doro Wot", price: "$16.99", image: "/doro.png", description: "Chicken stew with hard-boiled eggs in a spicy berbere sauce." },
      { name: "Kitfo", price: "$13.99", description: "Minced raw beef seasoned with spices and clarified butter.", image: "/kitfo.png" },
      { name: "Quanta Firfir", price: "$13.99", description: "Dried beef mixed with injera, onions, and spices.", image: "/tibsfirfir.png" },
      { name: "Sheckla Tibs", price: "$17.99+", description: "Grilled meat sautéed with onions, jalapenos, and spices.", image: "/shecklatibs.png" },
      { name: "Tibs Firfir", price: "$14.99+", description: "Injera mixed with tibs, onions, and jalapenos.", image: "/tibsfirfir.png" },
    ],
  },
  {
    title: "Drinks / Beverages",
    items: [
      { name: "Ethiopian Tea", price: "$1.99" },
      { name: "Ethiopian Coffee", price: "$1.99", image: "/coffee.png" },
      { name: "Macchiato", price: "$3.99" },
      { name: "Cappuccino", price: "$3.50" },
      { name: "Latte", price: "$3.99" },
      { name: "Espresso", price: "$2.25" },
      { name: "Iced Tea", price: "$1.99" },
      { name: "Bottled Water", price: "$1.99" },
      { name: "Sparkling Water", price: "$2.50" },
      { name: "Orange Juice", price: "$3.50" },
      { name: "Soda", price: "$2.50" },
      { name: "Tej", price: "$10.00", description: "Ethiopian honey wine.", image: "/tej.png" },
      { name: "Nonalcoholic Beer", price: "$3.99" },
    ],
  },
];

function parsePrice(priceStr: string): number {
  const match = priceStr.match(/\$([\d.]+)/);
  return match ? parseFloat(match[1]) : 0;
}

export const InteractiveMenuOrder: React.FC<Props> = ({ quantities, setQuantities }) => {
  const [specialRequest, setSpecialRequest] = useState("");
  const [orderType, setOrderType] = useState<"pickup" | "delivery" | null>(null);
  const [pickupPaymentMethod, setPickupPaymentMethod] = useState<"store" | "online">("store");
  const [showPayment, setShowPayment] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>(
    Object.fromEntries(menuData.map(section => [section.title, false]))
  );

  const [openDrinkGroups, setOpenDrinkGroups] = useState<{ [key: string]: boolean }>({
    "Coffee & Tea": false,
    "Cold & Soft Drinks": false,
    "Alcoholic & Special": false
  });



  const subtotal = Object.entries(quantities).reduce((acc, [itemName, qty]) => {
    const item = menuData.flatMap(s => s.items).find(i => i.name === itemName);
    return item ? acc + parsePrice(item.price) * qty : acc;
  }, 0);

  const taxRate = 0.0825;
  const totalPrice = subtotal + subtotal * taxRate;

  const handleQuantityChange = (itemName: string, value: number) => {
    setQuantities({ ...quantities, [itemName]: value });
  };

  const toggleSection = (title: string) => {
    setOpenSections(prev => {
      const newState = Object.fromEntries(
        Object.keys(prev).map(key => [key, false])
      );
      return {
        ...newState,
        [title]: !prev[title],
      };
    });
  };
  const drinkGroups = ["Coffee & Tea", "Cold & Soft Drinks", "Alcoholic & Special"];
  const toggleDrinkGroup = (group: string) => {
    setOpenDrinkGroups(prev => {
      const newState = Object.fromEntries(
        drinkGroups.map(g => [g, false])
      );
      return {
        ...newState,
        [group]: !prev[group],
      };
    });
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

    const orderDataToSend = {
      name: "Online Customer",
      phone: "000-000-0000",
      order_type: orderType ?? "",
      total_price: totalPrice,
      special_request: specialRequest,
      items: orderedItems,
      pickup_payment_method: pickupPaymentMethod,
    };

    if (orderType === "pickup" && pickupPaymentMethod === "store") {
      const response = await fetch(`${API_BASE_URL}/api/orders/submit/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderDataToSend),
      });

      if (response.ok) {
        Swal.fire("Success", "Your order has been placed successfully!", "success");
        setQuantities({});
        setSpecialRequest("");
      } else {
        Swal.fire("Error", "Failed to submit order.", "error");
      }

      return;
    }

    if (orderType === "pickup" && pickupPaymentMethod === "online") {
      const paymentResponse = await fetch(`${API_BASE_URL}/api/orders/create-intent/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: Math.round(totalPrice * 100) }),
      });

      const paymentData = await paymentResponse.json();
      setClientSecret(paymentData.client_secret);
      setOrderData(orderDataToSend);
      setShowPayment(true);
    }
  };
  return (
    <section className="px-6 md:px-24 py-16 bg-white text-gray-900">
      <h2 className="text-4xl font-bold mb-10 text-center">Order Online</h2>

      {menuData.map((section, sectionIndex) => (
        <div key={sectionIndex} className="mb-10">
          <button
            onClick={() => toggleSection(section.title)}
            className="w-full text-left text-2xl font-bold flex justify-between items-center mb-4 border-b pb-2"
          >
            {section.title}
            <span>{openSections[section.title] ? "▲" : "▼"}</span>
          </button>

          <AnimatePresence>
            {openSections[section.title] && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-6 overflow-hidden"
              >
                {section.title === "Drinks / Beverages" ? (
                  // Drinks grouped UI
                  [
                    { group: "Coffee & Tea", drinks: ["Ethiopian Tea", "Ethiopian Coffee", "Macchiato", "Cappuccino", "Latte", "Espresso", "Iced Tea"] },
                    { group: "Cold & Soft Drinks", drinks: ["Bottled Water", "Sparkling Water", "Orange Juice", "Soda"] },
                    { group: "Alcoholic & Special", drinks: ["Tej", "Nonalcoholic Beer"] },
                  ].map(({ group, drinks }) => (
                    <div key={group}>
                      <button
                        onClick={() => toggleDrinkGroup(group)}
                        className="w-full text-left text-lg font-semibold flex justify-between items-center border-b pb-2"
                      >
                        {group}
                        <span>{openDrinkGroups[group] ? "▲" : "▼"}</span>
                      </button>

                      <AnimatePresence>
                        {openDrinkGroups[group] && drinks.map(drinkName => {
                          const item = section.items.find(d => d.name === drinkName);
                          if (!item) return null;

                          return (
                            <motion.div
                              key={item.name}
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              className="flex justify-between items-center p-4 border rounded-lg bg-white shadow"
                            >
                              <div>
                                <h4 className="font-bold">{item.name}</h4>
                                {item.description && <p className="text-gray-500 text-sm">{item.description}</p>}
                              </div>
                              <div className="flex gap-2 items-center">
                                <button onClick={() => handleQuantityChange(item.name, Math.max(0, (quantities[item.name] || 0) - 1))} className="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-full">-</button>
                                <span>{quantities[item.name] || 0}</span>
                                <button onClick={() => handleQuantityChange(item.name, (quantities[item.name] || 0) + 1)} className="w-8 h-8 bg-green-500 hover:bg-green-600 text-white rounded-full">+</button>
                              </div>
                            </motion.div>
                          );
                        })}
                      </AnimatePresence>
                    </div>
                  ))
                ) : (
                  // Food Cards UI
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {section.items.map((item, idx) => (
                      <motion.div
                        key={idx}
                        whileHover={{ scale: 1.02 }}
                        className="border rounded-xl overflow-hidden shadow hover:shadow-lg transition bg-white flex flex-col"
                      >
                        <div className="bg-gray-100 h-48 flex items-center justify-center text-gray-400 text-sm">
                          {item.image ? (
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          ) : (
                            "Image Placeholder"
                          )}
                        </div>

                        <div className="p-6 flex-1 flex flex-col justify-between">
                          <div>
                            {item.badge && (
                              <span className={`inline-block mb-2 text-xs px-2 py-1 rounded-full ${item.badge === "New" ? "bg-blue-100 text-blue-600" : item.badge === "Popular" ? "bg-purple-100 text-purple-600" : "bg-green-100 text-green-600"}`}>
                                {item.badge}
                              </span>
                            )}
                            <h3 className="text-lg font-bold">{item.name}</h3>
                            <p className="text-gray-500">{item.price}</p>
                            {item.description && (
                              <p className="text-gray-400 text-sm mt-2">{item.description}</p>
                            )}
                          </div>

                          <div className="mt-6 flex items-center justify-between">
                            <div className="flex gap-2 items-center">
                              <button onClick={() => handleQuantityChange(item.name, Math.max(0, (quantities[item.name] || 0) - 1))} className="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-full">-</button>
                              <span>{quantities[item.name] || 0}</span>
                              <button onClick={() => handleQuantityChange(item.name, (quantities[item.name] || 0) + 1)} className="w-8 h-8 bg-green-500 hover:bg-green-600 text-white rounded-full">+</button>
                            </div>
                            <button onClick={() => handleQuantityChange(item.name, (quantities[item.name] || 0) + 1)} className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm">Select</button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}

      <textarea placeholder="Special Request (optional)" className="w-full border p-3 rounded-lg mb-6" value={specialRequest} onChange={(e) => setSpecialRequest(e.target.value)} />

      <div className="space-y-2 mb-6">
        <p className="font-semibold">Order Type:</p>
        <div className="flex gap-4">
          <button onClick={() => setOrderType("pickup")} className={`px-5 py-2 rounded-lg ${orderType === "pickup" ? "bg-green-600 text-white" : "bg-gray-200"}`}>Pickup</button>
          <button disabled className="px-5 py-2 rounded-lg bg-gray-100 text-gray-400 cursor-not-allowed">Delivery (Coming Soon)</button>
        </div>
      </div>

      {orderType === "pickup" && (
        <div className="space-y-2 mb-6">
          <p className="font-semibold">Pickup Payment:</p>
          <div className="flex gap-4">
            <button onClick={() => setPickupPaymentMethod("store")} className={`px-5 py-2 rounded-lg ${pickupPaymentMethod === "store" ? "bg-green-500 text-white" : "bg-gray-200"}`}>Pay at Store</button>
            <button onClick={() => setPickupPaymentMethod("online")} className={`px-5 py-2 rounded-lg ${pickupPaymentMethod === "online" ? "bg-green-500 text-white" : "bg-gray-200"}`}>Pay Online</button>
          </div>
        </div>
      )}

      {showPayment && clientSecret && orderData && (
        <div className="mt-12">
          <h3 className="text-2xl font-semibold mb-4 text-center">Complete Payment</h3>
          <Elements options={{ clientSecret }} stripe={stripePromise}>
            <PaymentForm orderData={orderData} />
          </Elements>
        </div>
      )}

      <div className="text-right space-y-2 mt-10">
        <p>Subtotal: ${subtotal.toFixed(2)}</p>
        <p>Tax: ${(subtotal * taxRate).toFixed(2)}</p>
        <p className="font-bold text-xl">Total: ${totalPrice.toFixed(2)}</p>
        <button onClick={handleSubmit} className="w-full bg-[#6a3412] hover:bg-green-700 text-white text-lg py-4 rounded-lg transition">Place Order</button>
      </div>
    </section>
  );

};

const PaymentForm: React.FC<{ orderData: OrderData }> = ({ orderData }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [cardholderName, setCardholderName] = useState("");
  const [processing, setProcessing] = useState(false);

  const submitOrder = async () => {
    const response = await fetch(`${API_BASE_URL}/api/orders/submit/`, {
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
      <input type="text" placeholder="Cardholder Name" value={cardholderName} onChange={(e) => setCardholderName(e.target.value)} className="w-full border p-3 rounded" />
      <PaymentElement />
      <button type="submit" disabled={!stripe || processing} className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded">{processing ? "Processing..." : "Pay Now"}</button>
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
      className="px-6 md:px-24 py-10  text-white font-serif"
    >
      <div className="w-full mx-auto border border-yellow-600 p-8 rounded-2xl shadow-lg bg-[#6a3412]">
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
