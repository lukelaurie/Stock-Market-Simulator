// Import the required libraries and dependencies
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Define the schema for the User model
const userSchema = new mongoose.Schema({
  // The user's unique username
  username: {
    type: String,
    required: true,
    unique: true
  },

  // The user's hashed password
  password: {
    type: String,
    required: true
  }
});

// Middleware to hash the password before saving the user to the database
userSchema.pre("save", async function (next) {
  // If the password hasn't been modified, skip the hashing process
  if (!this.isModified("password")) {
    return next();
  }

  // Generate a salt for hashing the password
  const salt = await bcrypt.genSalt(10);
  
  // Hash the password with the generated salt
  const hashedPassword = await bcrypt.hash(this.password, salt);
  
  // Replace the plain-text password with the hashed version
  this.password = hashedPassword;
  
  // Proceed to save the user in the database
  next();
});

// // Method to compare a given password with the stored hashed password
// userSchema.methods.comparePassword = async function (candidatePassword) {
//   // Use bcrypt to compare the given password with the stored hashed password
//   console.log("candidatePassword: " + candidatePassword);
//   console.log("this.password: " + this.password);
//   bcrypt.compare(candidatePassword, this.password)
//   .then(function(result) {
//     console.log("Compare result is " + result);
//     return result;
//   })
//   .catch(function(err) {
//     console.log("err: " + err);
//     return false;
//   });
  

// };

// Create and export the User model using the userSchema
const User = mongoose.model("User", userSchema);
module.exports = User;
