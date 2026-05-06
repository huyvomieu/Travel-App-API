const { UserCreateModel, UserUpdateModel } = require("../models/user.model");
const { db } = require("../config/firebase");

const usersRef = db.ref("users");

const ObjectToArray = require("../helper/ObjectToArrray");
const pickProperties = require("../helper/pickProperties");
const search = require("../helper/search");

const normalizeUser = (user, key) => {
  if (!user) return null;

  const userKey = key || user.key || user.username || user.id;
  return {
    ...user,
    key: userKey,
    id: userKey,
    username: user.username || userKey,
  };
};

const getParamArray = (req, name) => {
  const raw = req.query[name] ?? req.query[`${name}[]`];
  if (!raw) return [];

  const values = Array.isArray(raw) ? raw : String(raw).split(",");
  return values.map((value) => String(value).trim()).filter(Boolean);
};

const getRequestedTypes = (req) => {
  const types = getParamArray(req, "type");
  if (!types.length) return [];

  const requiredKeys = ["key", "id", "username"];
  requiredKeys.forEach((key) => {
    if (!types.includes(key)) types.push(key);
  });

  return types;
};

const getUserKey = (req) => req.params.id || req.query.id || req.query.username;

class UserController {
  // [GET] api/user
  async get(req, res) {
    try {
      const key = getUserKey(req);
      if (key) {
        const snapshot = await usersRef.child(key).once("value");
        const user = normalizeUser(snapshot.val(), key);

        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }

        return res.json(user);
      }

      const snapshot = await usersRef.once("value");
      let result = ObjectToArray(snapshot.val()).map((user) =>
        normalizeUser(user, user.key)
      );

      if (req.query.q) {
        result = search.searchUser(result, req.query.q.toLowerCase().trim());
      }

      if (req.query.typeuser) {
        result = search.searchByTypeUser(result, req.query.typeuser);
      }

      const types = getRequestedTypes(req);
      if (types.length) {
        result = result.map((user) => pickProperties(user, types));
      }

      return res.json(result);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  // [POST] api/user
  async post(req, res) {
    try {
      const { error, value } = UserCreateModel.validate(req.body);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }

      const username = value.username;
      const userRef = usersRef.child(username);
      const snapshot = await userRef.once("value");
      if (snapshot.exists()) {
        return res.status(409).json({ error: "Username already exists" });
      }

      const user = {
        ...value,
        cartId: value.cartId || username,
      };

      delete user.id;
      delete user.key;

      await userRef.set(user);

      return res.status(201).json(normalizeUser(user, username));
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  // [PUT] api/user
  async put(req, res) {
    try {
      const key = getUserKey(req);
      if (!key) {
        return res.status(400).json({ error: "Missing user id" });
      }

      const snapshot = await usersRef.child(key).once("value");
      if (!snapshot.exists()) {
        return res.status(404).json({ error: "User not found" });
      }

      const { error, value } = UserUpdateModel.validate(req.body);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }

      if (value.username && value.username !== key) {
        return res.status(400).json({ error: "Username cannot be changed" });
      }

      const updateData = {
        ...value,
        username: key,
        cartId: value.cartId || key,
      };

      delete updateData.id;
      delete updateData.key;

      await usersRef.child(key).update(updateData);

      const updatedSnapshot = await usersRef.child(key).once("value");
      return res.status(200).json(normalizeUser(updatedSnapshot.val(), key));
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  // [DELETE] api/user
  async delete(req, res) {
    try {
      const ids = [
        ...getParamArray(req, "ids"),
        ...getParamArray(req, "id"),
      ];

      if (!ids.length) {
        return res.status(400).json({ error: "Missing user ids" });
      }

      const paths = {};
      ids.forEach((id) => {
        paths[id] = null;
      });

      await usersRef.update(paths);

      return res.status(200).json({
        message: "User deleted successfully",
        code: 200,
        deletedIds: ids,
      });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new UserController();
