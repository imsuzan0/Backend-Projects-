import { StatusCodes } from "http-status-codes";
import { User } from "../models/user.model";
import { generateToken } from "../middleware/jwt";

export const signup = async (req, res) => {
  try {
    const data = req.body;
    const newUser = new User(data);
    const user = await newUser.save();

    const payload = {
      id: user._id,
    };

    const token = generateToken(payload);
    res
      .status(StatusCodes.CREATED)
      .json({ message: "User created successfully", user });
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

    if (!user || !user.comparePassword(password)) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "Invalid username or password" });
    }

    const payload = {
      id: user._id,
    };

    const token = generateToken(payload);
    res.status(StatusCodes.OK).json({ token });
  } catch (error) {}
};
