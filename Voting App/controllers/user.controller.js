import { StatusCodes } from "http-status-codes";
import User from "../models/user.model.js";
import { generateToken } from "../middleware/jwt.js";

export const signup = async (req, res) => {
  try {
    const data = req.body;

    // Destructure unique field
    const { citizenshipNumber } = data;

    // Validate uniqueness
    const existingUser = await User.findOne({ citizenshipNumber });
    if (existingUser) {
      return res
        .status(StatusCodes.CONFLICT)
        .json({ message: "User with this citizenship number already exists" });
    }

    // Create and save new user
    const newUser = new User(data);
    const user = await newUser.save();

    // Generate token
    const payload = { id: user._id };
    const token = generateToken(payload);

    // Return success response
    res.status(StatusCodes.CREATED).json({
      message: "User created successfully",
      user,
      token,
    });
  } catch (error) {
    console.log("Error in signup controller", error.message);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Internal server error",
    });
  }
};

export const login = async (req, res) => {
  try {
    const { citizenshipNumber, password } = req.body;
    const user = await User.findOne({ citizenshipNumber });

    if (!user || !(await user.comparePassword(password))) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "Invalid username or password" });
    }

    const payload = {
      id: user._id,
    };

    const token = generateToken(payload);
    res.status(StatusCodes.OK).json({ token });
  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Internal server error",
    });
  }
};

export const getProfile = async (req, res) => {
  try {
    const userData = req.user;
    const userId = userData.id;
    const user = await User.findById(userId);
    if (!user)
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "User not found" });
    res.status(StatusCodes.OK).json({ user });
  } catch (error) {
    console.log("Error in getProfile controller", error.message);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Internal server error",
    });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user;
    const user = await User.findById(userId.id);
    if (!user)
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "User not found" });

    if (await user.comparePassword(oldPassword)) {
      user.password = newPassword;
      await user.save();
      return res.status(StatusCodes.OK).json({ message: "Password changed" });
    }

    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "Old password is incorrect" });
  } catch (error) {
    console.log("Error in changePassword controller", error.message);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Internal server error",
    });
  }
};
