import { Notification } from "../models/notification.model.js";

export const getNotifications = async (req, res) => {
  try {
    const userId = req.user._id;
    const notifications = await Notification.find({ to: userId }).populate({
      path: "from",
      select: "username profileImg",
    });

    await Notification.updateMany({ to: userId }, { read: true });
    res.status(200).json(notifications);
  } catch (error) {
    console.log("Error in getNotifications controller", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteNotifications = async (req, res) => {
  try {
    const userId = req.user._id;
    await Notification.deleteMany({ to: userId });
    res.status(200).json({ message: "Notifications deleted successfully" });
  } catch (error) {
    console.log("Error in deleteNotifications controller", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};


// This following code for delete only one notification at a time but i don't want to implement it

    //router.delete('/:id',protectRoute,deleteOneNotification)

// export const deleteOneNotification = async (req, res) => {
//   try {
//     const notificationId = req.params.id;
//     const userId = req.user._id;
//     const notification = await Notification.findById(notificationId);
//     if (!notification || notification.to.toString() !== userId) {
//       return res.status(404).json({ message: "Notification not found" });
//     }
//     if (notification.to.toString() !== userId) {
//       return res
//         .status(401)
//         .json({ message: "You are not allowed to delete this notification" });
//     }
//     await Notification.findByIdAndDelete(notificationId);
//     res.status(200).json({ message: "Notification deleted successfully" });
//   } catch (error) {
//     console.log("Error in deleteOneNotification controller", error.message);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };
