import express from "express";
import { jwtAuthMiddleware } from "../middleware/jwt.js";
import {
  addCandidate,
  editCandidate,
  getCandidates,
  getVoteCounts,
  voteCandidate,
} from "../controllers/candidate.controller.js";

const candidateRouter = express.Router();

candidateRouter.post("/addcandidate", jwtAuthMiddleware, addCandidate);
candidateRouter.put(
  "/editcandidate/:candidateId",
  jwtAuthMiddleware,
  editCandidate
);
candidateRouter.delete("/:candidateId", jwtAuthMiddleware, editCandidate);
candidateRouter.post("/vote/:id", jwtAuthMiddleware, voteCandidate);
candidateRouter.get("/vote/count", jwtAuthMiddleware, getVoteCounts);
candidateRouter.get("/candidates", jwtAuthMiddleware, getCandidates);

export default candidateRouter;
