import { CategoryArt, Icon } from "../Icon";
import { CATEGORY_STYLE, COLORS } from "../../constants/colors";
import { formatMK } from "../../utils/helpers";

export function CartPage({ menu, cart, setCart, onCheckout }) {
  const items = Object.entries(cart)
    .filter(([, qty]) => qty > 0)
    .map(([id, qty]) => ({ ...menu.find((m) => m.id === id), qty }));

  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const delivery = items.length ? 1000 : 0;
  const total = subtotal + delivery;

  const updateQty = (id, delta) => {
    setCart((prev) => ({ ...prev, [id]: Math.max(0, (prev[id] || 0) + delta) }));
  };
  const removeItem = (id) => setCart((prev) => ({ ...prev, [id]: 0 }));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-neutral-900">Your Cart</h1>
          <p className="text-sm text-neutral-500">
            {items.length} {items.length === 1 ? "item" : "items"}
          </p>
        </div>
        {items.length > 0 && (
          <button
            onClick={() => setCart({})}
            className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-neutral-500"
          >
            <Icon name="trash" className="w-4 h-4" />
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center text-center py-16 bg-white rounded-3xl shadow-sm border-1 border-neutral-200">
          <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 mb-4">
            <Icon name="cart" className="w-7 h-7" />
          </div>
          <p className="font-semibold text-neutral-900 mb-1">Your cart is empty</p>
          <p className="text-sm text-neutral-400 max-w-xs px-6">Add a dish from the menu to see it here.</p>
        </div>
      ) : (
        <>
          <div className="space-y-3 mb-6">
            {items.map((item) => {
              const style = CATEGORY_STYLE[item.category];
              return (
                <div key={item.id} className="flex items-center gap-3 bg-white rounded-2xl p-3 border-1 border-neutral-200">
                  <div
                    className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl"
                    style={{ background: style.bg, color: style.accent }}
                  >
                    <CategoryArt category={item.category} className="h-6 w-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-neutral-900 text-sm truncate">{item.name}</p>
                    <p className="text-xs text-neutral-400">{formatMK(item.price)} each</p>
                  </div>
                  <div className="flex items-center gap-2 bg-neutral-100 rounded-full px-1 py-1 shrink-0">
                    <button
                      onClick={() => updateQty(item.id, -1)}
                      className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-neutral-600 shadow-sm"
                    >
                      <Icon name="minus" className="w-3 h-3" />
                    </button>
                    <span className="text-sm font-semibold w-4 text-center">{item.qty}</span>
                    <button
                      onClick={() => updateQty(item.id, 1)}
                      className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-neutral-600 shadow-sm"
                    >
                      <Icon name="plus" className="w-3 h-3" />
                    </button>
                  </div>
                  <button onClick={() => removeItem(item.id)} className="text-neutral-300 shrink-0">
                    <Icon name="trash" className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>

          <div className="bg-white rounded-3xl shadow-sm border-1 border-neutral-200 p-5">
            <div className="flex items-center justify-between text-sm text-neutral-500 mb-2">
              <span>Subtotal</span>
              <span>{formatMK(subtotal)}</span>
            </div>
            <div className="flex items-center justify-between text-sm text-neutral-500 mb-3">
              <span>Delivery</span>
              <span>{formatMK(delivery)}</span>
            </div>
            <div className="h-px bg-neutral-100 mb-3" />
            <div className="flex items-center justify-between font-bold text-neutral-900 mb-5">
              <span>Total</span>
              <span>{formatMK(total)}</span>
            </div>
            <button
              onClick={() => onCheckout(items)}
              className="w-full py-3.5 rounded-full text-white font-semibold"
              style={{ background: COLORS.dark }}
            >
              Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
}
