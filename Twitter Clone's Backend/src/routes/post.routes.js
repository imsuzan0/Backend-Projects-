import express from "express";
import { protectRoute } from "../middlewares/protectRoute.js";
import {
  createPost,
  deletePost,
  likeUnlikePost,
  commentOnPost,
  getAllPosts,
  getLikedPosts,
  getFollowingPost,
  getUserPosts,
} from "../controllers/post.controller.js";

const router = express.Router();

router.get("/user/:username", protectRoute, getUserPosts);
router.get("/following", protectRoute, getFollowingPost);
router.get("/all", protectRoute, getAllPosts);
router.get("/like:id", protectRoute, getLikedPosts);
router.post("/create", protectRoute, createPost);
router.delete("/:id", protectRoute, deletePost);
router.post("/like/:id", protectRoute, likeUnlikePost);
router.post("/comment/:id", protectRoute, commentOnPost);

export default router;
