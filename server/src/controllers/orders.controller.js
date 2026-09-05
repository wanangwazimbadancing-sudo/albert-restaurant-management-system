import Order from '../Models/OrderModels.js';
import Menu from '../Models/MenuModels.js';

export const getOrders = async (req, res, next) => {
  try {
    const filter = req.user.role === 'admin' ? {} : { customer: req.user._id };
    const orders = await Order.find(filter).populate('customer', 'name email').sort({ createdAt: -1 });
    return res.status(200).json({ success: true, orders });
  } catch (error) {
    return next(error);
  }
};

export const createOrder = async (req, res, next) => {
  try {
    const requestedItems = req.body.items;
    const menuIds = requestedItems.map((item) => item.menuItem);
    const menuItems = await Menu.find({ _id: { $in: menuIds }, isAvailable: true });
    const menuById = new Map(menuItems.map((item) => [item._id.toString(), item]));

    if (menuItems.length !== new Set(menuIds).size) {
      return res.status(400).json({ success: false, message: 'One or more selected menu items are unavailable.' });
    }

    const items = requestedItems.map((requestedItem) => {
      const menuItem = menuById.get(requestedItem.menuItem);
      return {
        menuItem: menuItem._id,
        name: menuItem.name,
        category: menuItem.category,
        price: menuItem.price,
        qty: requestedItem.qty,
      };
    });
    const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
    const total = subtotal + 1000;
    const order = await Order.create({ customer: req.user._id, items, total });
    return res.status(201).json({ success: true, message: 'Order created successfully.', order });
  } catch (error) {
    return next(error);
  }
};

export const getOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('customer', 'name email');
    if (!order) return res.status(404).json({ success: false, message: 'Order not found.' });
    return res.status(200).json({ success: true, order });
  } catch (error) {
    return next(error);
  }
};

export const updateOrderStatus = async (req, res, next) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { returnDocument: 'after', runValidators: true },
    );

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    return res.status(200).json({ success: true, message: 'Order status updated.', order });
  } catch (error) {
    return next(error);
  }
};

export const deleteOrder = async (req, res, next) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found.' });
    return res.status(200).json({ success: true, message: 'Order deleted successfully.' });
  } catch (error) {
    return next(error);
  }
};
