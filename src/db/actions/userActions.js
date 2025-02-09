import UserData from "../models/UserData";

export async function getUsers() {
    try {
      const res = await UserData.find({}).select("-_id").sort({ xp: -1 }).lean();
      return res;
    } catch (error) {
      console.log(error.message);
    }
  }