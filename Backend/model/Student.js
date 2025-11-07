import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  class: { type: String, required: true },
  rollNumber: { type: String, required: true, unique: true }
});

export const Student = mongoose.model("Student", studentSchema);
