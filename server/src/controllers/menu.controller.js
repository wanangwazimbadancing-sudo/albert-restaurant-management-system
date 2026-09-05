import Menu from '../Models/MenuModels.js';

export const getMenuItems = async (req, res, next) => {
  try {
    const items = await Menu.find({ isAvailable: true }).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, items });
  } catch (error) {
    return next(error);
  }
};

export const createMenuItem = async (req, res, next) => {
  try {
    const item = await Menu.create(req.body);
    return res.status(201).json({ success: true, message: 'Menu item created successfully.', item });
  } catch (error) {
    return next(error);
  }
};

export const getMenuItem = async (req, res, next) => {
  try {
    const item = await Menu.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Menu item not found.' });
    return res.status(200).json({ success: true, item });
  } catch (error) {
    return next(error);
  }
};

export const updateMenuItem = async (req, res, next) => {
  try {
    const item = await Menu.findByIdAndUpdate(req.params.id, req.body, {
      returnDocument: 'after',
      runValidators: true,
    });
    if (!item) return res.status(404).json({ success: false, message: 'Menu item not found.' });
    return res.status(200).json({ success: true, message: 'Menu item updated successfully.', item });
  } catch (error) {
    return next(error);
  }
};

export const deleteMenuItem = async (req, res, next) => {
  try {
    const item = await Menu.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Menu item not found.' });
    return res.status(200).json({ success: true, message: 'Menu item deleted successfully.' });
  } catch (error) {
    return next(error);
  }
};
