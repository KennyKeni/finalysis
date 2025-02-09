import { User } from "lucide-react";
import mongoose from "mongoose";

const UserDataSchema = new mongoose.Schema({
    _id: { type: String, required: true, index: true },
    xp: { type: Number, required: true},
    nickname: { type: String},
    gamesCompleted: { type: Number }
})

const UserData = mongoose.models.UserData || mongoose.model("UserData", UserDataSchema);
export default UserData;