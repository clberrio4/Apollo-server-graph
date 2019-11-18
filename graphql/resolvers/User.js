import { pipe, __ } from "ramda";
import Reset from "../controller/password-reset/passwordResetController";
import handleError from "../usefull/errorHandler";

export default {
  Query: {
    getUsers: async (root, args, { models }) => {
      try {
        return await models.User.getUsers();
      } catch (error) {
        console.log(error);
        return { error };
      }
    },
    getUser: async (root, { id }, { models }) => {
      try {
        return await models.User.getUser({ _id: id });
      } catch (error) {
        return handleError.serverError();
      }
    },

    getMe: async (root, args, { models, me }, info) => {
      try {
        if (typeof me === "undefined" || !me) {
          return handleError.authenticationError();
        }
        console.log(me.id);
        return await models.User.getUser({ _id: me.id });
      } catch (error) {
        // console.log(error);
        return handleError.serverError();
      }
    }
  },

  Mutation: {
    createUser: async (root, { input }, { models, pubSub }) => {
      try {
        const user = await models.User.createUser(input);

        pubSub.publish("userAdd", {
          newUser: user
        });

        return user;
      } catch (error) {
        return { error };
      }
    },
    updateUser: async (root, { input }, { models, me, pubSub }) => {
      try {
        if (typeof me === "undefined" || !me) {
          return handleError.authenticationError();
        }
        const user = await models.User.updateUser(me.id, input);
        pubSub.publish("user", { updatedUser: user });
        return user;
      } catch (error) {
        return { status: false, error };
      }
    },

    signin: async (root, { input }, { models }) => {
      try {
        return await models.User.login(input);
      } catch (error) {
        return handleError.serverError();
      }
    },
    SendEmailToRecoverPassword: async (root, email, { models }) => {
      try {
        return await models.User.sendEmailToRecoverPassword(email);
      } catch (error) {
        return handleError.serverError();
      }
    },
    recoverPassword: async (root, { input }, { models }, info) => {
      try {
        return await models.User.updatePasswordRecover(input);
      } catch (error) {
        console.log(error);
        return handleError.serverError();
      }
    },
    updatePassword: async (root, { input }, { models, me }, info) => {
      try {
        if (typeof me === "undefined" || me === {}) {
          return handleError.authenticationError();
        }
        const ok = await models.User.updatePassword(me.id, input);
        console.log(ok);
        return ok;
      } catch (error) {
        return handleError.serverError();
      }
    }
  },
  Subscription: {
    newUser: {
      subscribe(parent, { user_id }, { models, pubSub }, info) {
        console.log(user_id);
        // console.log(await models.User.getUser({ _id: user_id }));
        return pubSub.asyncIterator("userAdd");
      }
    },
    updatedUser: {
      subscribe(parent, { user_id }, { models, pubSub }, info) {
        console.log(user_id);
        return pubSub.asyncIterator("user");
      }
    }
  },
  User: {
    resetPassword: async ({ id }) => {
      try {
        const resetPassword = await Reset.getResetPassword(id);
        return resetPassword;
      } catch (error) {
        return error;
      }
    }
  }
};
