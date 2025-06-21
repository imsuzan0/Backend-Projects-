import { StatusCodes } from "http-status-codes";
import Candidate from "../models/candidate.model.js";
import User from "../models/user.model.js";

const checkAdminRole = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (user.role === "admin") {
      return true;
    }
    return false;
  } catch (error) {
    console.log("Error in checkAdminRole controller", error.message);
    return false;
  }
};

export const addCandidate = async (req, res) => {
  try {
    if (!(await checkAdminRole(req.user.id))) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "Unauthorized , only admin can add candidate" });
    }
    const data = req.body;
    const newCandidate = new Candidate(data);
    const responce = await newCandidate.save();
    res
      .status(StatusCodes.CREATED)
      .json({ message: "Candidate added successfully", responce });
  } catch (error) {
    console.log("Error in candidate controller", error.message);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Internal server error",
    });
  }
};

export const editCandidate = async (req, res) => {
  try {
    if (!(await checkAdminRole(req.user.id))) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "Unauthorized , only admin can add candidate" });
    }

    const candidateId = req.params.id;
    const data = req.body;

    const candidate = await Candidate.findByIdAndUpdate(candidateId, data, {
      new: true,
      runValidators: true,
    });

    if (!candidate) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Candidate not found" });
    }

    res
      .status(StatusCodes.OK)
      .json({ message: "Candidate updated successfully", candidate });
  } catch (error) {
    console.log("Error in editCandidate controller", error.message);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Internal server error",
    });
  }
};

export const deleteCandidate = async (req, res) => {
  try {
    if (!(await checkAdminRole(req.user.id))) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "Unauthorized , only admin can add candidate" });
    }
    const candidateId = req.params.id;
    const candidate = await Candidate.findByIdAndDelete(candidateId);
    if (!candidate) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Candidate not found" });
    }
    res
      .status(StatusCodes.OK)
      .json({ message: "Candidate deleted successfully", candidate });
  } catch (error) {
    console.log("Error in deleteCandidate controller", error.message);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Internal server error",
    });
  }
};

export const voteCandidate = async (req, res) => {
  try {
    //no admin can vote and user can vote only once
    const candidateId = req.params.id;
    const userId = req.user.id;

    const candidate = await Candidate.findById(candidateId);
    if (!candidate) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Candidate not found" });
    }
    const user=await User.findById(userId);
    if(!user){
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "User not found" });
    }

    if(user.isVoted){
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "User already voted" });
    }
    if(user.role==="admin"){
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "Admin can not vote" });
    }
    candidate.votes.push({user:userId})
    candidate.voteCount++

    await candidate.save();

    //update the user document
    user.isVoted=true;
    await user.save();
    
    res
      .status(StatusCodes.OK)
      .json({ message: "Candidate voted successfully", candidate });
  } catch (error) {
    console.log("Error in voteCandidate controller", error.message);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Internal server error",
    });
  }
};


export const getVoteCounts=async(req,res)=>{
  try {
    const candidate=await Candidate.find().sort({voteCount:'desc'})
    
    const record=candidate.map((data)=>{
      return{
        party:data.party,
        voteCount:data.voteCount
      }
    })

    res.status(StatusCodes.OK).json({record});

  } catch (error) {
    console.log("Error in getVoteCounts controller", error.message);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Internal server error",
    });
  }
}
export const getCandidates = async (req, res) => {
  try {
    const candidates = await Candidate.find();
    res.status(StatusCodes.OK).json({ candidates });
  } catch (error) {
    console.log("Error in getCandidates controller", error.message);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Internal server error",
    });
  }
};
