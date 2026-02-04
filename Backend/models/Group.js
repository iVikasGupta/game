import mongoose from "mongoose";

const groupSchema = new mongoose.Schema(
  {
    sessionId: {
      type: String,
      required: true,
    },

    name: {
      type: String,
      required: true, // e.g. Group A
    },

    maxPlayers: {
      type: Number,
      default: 5,
    },

    players: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    createdByAdmin: {
      type: Boolean,
      default: true,
    },

    locked: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Group", groupSchema);
