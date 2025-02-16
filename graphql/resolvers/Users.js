const User = require("../../models/User");
const { ApolloError } = require("apollo-server-errors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

module.exports = {
  Query: {
    // Login query
    async loginUser(_, { loginInput: { email, password } }) {
      const user = await User.findOne({ email });

      // Check if user exists and passwords match
      if (user && (await bcrypt.compare(password, user.password))) {
        // Create JWT token
        const token = jwt.sign({ user_id: user._id, email }, "secretString", {
          expiresIn: "2h",
        });

        // Assign the token to the user
        user.token = token;

        // Save the updated user object with token
        await user.save(); // Save to the database

        return {
          id: user.id,
          ...user._doc,
        };
      } else {
        throw new ApolloError(
          "Incorrect email or password, please try again",
          "INCORRECT_PASSWORD"
        );
      }
    },
  },

  Mutation: {
    // Register a new user
    async registerUser(_, { registerInput: { username, email, password } }) {
      // Check if the user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new ApolloError(
          `A user is already registered with this email: ${email}`,
          "USER_ALREADY_EXISTS"
        );
      }

      // Encrypt the password
      const encryptedPassword = await bcrypt.hash(password, 10);

      // Create a new user
      const newUser = new User({
        username,
        email: email.toLowerCase(),
        password: encryptedPassword,
      });

      // Create JWT token for the new user
      const token = jwt.sign({ user_id: newUser._id, email }, "secretString", {
        expiresIn: "1h",
      });

      newUser.token = token;

      // Save the new user to the database
      const res = await newUser.save();

      return {
        id: res.id,
        ...res._doc,
      };
    },

    // Login a user
    async loginUser(_, { loginInput: { email, password } }) {
      const user = await User.findOne({ email });

      // Check if user exists and passwords match
      if (user && (await bcrypt.compare(password, user.password))) {
        // Create JWT token
        const token = jwt.sign({ user_id: user._id, email }, "secretString", {
          expiresIn: "2h",
        });

        // Assign the token to the user
        user.token = token;

        // Save the updated user object with token
        await user.save(); // Save to the database

        return {
          id: user.id,
          ...user._doc,
        };
      } else {
        throw new ApolloError(
          "Incorrect email or password, please try again",
          "INCORRECT_PASSWORD"
        );
      }
    },
  },
};
