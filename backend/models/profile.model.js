import mongoose from "mongoose";
const profileSchema = new mongoose.Schema({
    user: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  required: true,
  unique: true, // ← verhindert doppelte Profile für denselben User
},
    age: {
    type: Number,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
    height: {
    type: Number,
    required: true,
  },
   weight: {
    type: Number,
    required: true,
  },
  budget: {
    type: Number,
    required: true,
  },
  allergies: [{
    type: String,
        default: [],

  }],
  conditions: [{
    type: String,
    default: [],

  }],
  activityLevel: {
    type: Number,
    default: 3
  },
   stressLevel: {
    type: Number,
    default: 3

  },
    dietType: {
    type: String,
    default: "",

  },
      dislikes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Recipe",
        default: []
    }],
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Recipe",
        default: []
    }],
   goal: {
    type: String,
    required: true,
  },
})

const Profile = mongoose.models.profile || mongoose.model("Profile", profileSchema);
export default Profile;