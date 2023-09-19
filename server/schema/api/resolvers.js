const { User } = require("../models");
const { AuthenticationError } = require("apollo-server-express");
const { signToken } = require("../utils/auth");


const resolvers = {

    Query: {

        getSingleUser: async (_, args) => {
            await User.findOne({ email: args.email })
        },

        // Uses the ID stored in context to find logged-in user
        me: async (_, args, context) => {
            if (context.user) {
                return User.findOne({ _id: context.user._id }).select("-__v -password");
            } else {
                throw new AuthenticationError("Must be logged in");
            }
        }
    },


    Mutation: {

        createUser: async (_, args) => {
            const user = await User.create(args);
            const token = signToken(user);
            return { token, user };
        },

        login: async (_, { email, password }) => {
            const user = await User.findOne({ email: email });
            // If user email isn't found, throw auth error
            if (!user) {
                throw new AuthenticationError("Login failed. Try again");
            }
            // Check password
            const correctPassword = await user.isCorrectPassword(password);
            // If incorrect password, throw auth error
            if (!correctPassword) {
                throw new AuthenticationError("Login failed. Try again");
            }
            const token = signToken(user);
            return { token, user };
        },

        saveBook: async (_, args, context) => {
            if (context.user) {
                const user = await User.findByIdAndUpdate({ _id: context.user._id }, { $push: { savedBooks: args.bookToSave } }, { new: true });
                return user;
            } else {
                throw new AuthenticationError("Must be logged in");
            }
        },

        deleteBook: async (_, args, context) => {
            if (context.user) {
                const user = await User.findByIdAndUpdate({ _id: context.user._id }, { $pull: { savedBooks: { bookId: args.bookToDelete } } }, { new: true });
                return user;
            } else {
                throw new AuthenticationError("Must be logged in");
            }
        }
    }

};

module.exports = resolvers;