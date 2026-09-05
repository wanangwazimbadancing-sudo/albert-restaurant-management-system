export const getHealth = (req, res) => {
  res.status(200).json({
    success: true,
    message: 'ALBERT API is running',
    timestamp: new Date().toISOString(),
  });
};
