const User = require('../models/User');

exports.getUserProfile = async (req, res) => {
  try {
    // req.user.id comes from the middleware we just created
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] } // Never send the password back!
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error("Profile Error:", error);
    res.status(500).json({ success: false, message: 'Server error fetching profile' });
  }
};