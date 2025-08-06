import { RequestHandler } from "express";
import { UserModel } from "../domain/mongodb";
import { User } from "../domain";

interface FilterUserQuery {
  name?: RegExp | string;
  page?: number;
  size?: number;
}

const getUsers: RequestHandler = async (req, res) => {
  try {
    const { query } = req;
    const { name, page, size } = query;

    const filterObject: FilterUserQuery = {};

    if (name) {
      filterObject.name = new RegExp(String(name), "i");
    }

    const pageNumber = parseInt(String(page), 10) || 1;
    const pageSize = parseInt(String(size), 10) || 10;
    const skip = (pageNumber - 1) * pageSize;
    const limit = pageSize;

    const users = await UserModel.find(filterObject).skip(skip).limit(limit);

    const total = await UserModel.countDocuments(filterObject);

    res.status(200).json({
      users,
      page: pageNumber,
      size: pageSize,
      total: total,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal server error", details: error });
  }
};

const getUserById: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await UserModel.findById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    return res.status(500).json({ error: "Internal server error", details: error });
  }
};

const createUser: RequestHandler = async (req, res) => {
  try {
    const { body } = req;
    const { age, email, name } = body;

    if (!body || !body.name || !body.email) {
      return res.status(400).json({ error: "Name and email are required" });
    }

    const existingUser = await UserModel.findOne({ email: body.email });

    if (existingUser) {
      return res.status(400).json({ error: "User with this email already exists" });
    }

    const user = User.create({
      name: name,
      age: age || null,
      email: email,
    });

    const userModel = new UserModel({
      id: user.id(),
      name: user.name(),
      age: user.age(),
      email: user.email(),
    });

    await userModel.save();

    res.status(201).json({ message: "User created successfully", ...user.toJSON() });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error creating user:", error);
    if (error.name === "InvalidInputError") {
      return res.status(400).json({ error: error.message });
    }
    return res.status(500).json({ error: "Internal server error", details: error });
  }
};

const updateUser: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { body } = req;
    const { age, email, name } = body;

    if (!body || !body.name || !body.email) {
      return res.status(400).json({ error: "Name and email are required" });
    }

    const existingUser = await UserModel.findOne({ email: body.email });

    if (!existingUser) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = User.create(
      {
        name: name,
        age: age || existingUser.age,
        email: email,
      },
      id
    );

    await UserModel.findByIdAndUpdate(
      id,
      {
        id: user.id(),
        name: user.name(),
        age: user.age(),
        email: user.email(),
      },
      { new: true }
    );

    res.status(200).json({ message: "User updated successfully", ...user.toJSON() });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error updating user:", error);
    if (error.name === "InvalidInputError") {
      return res.status(400).json({ error: error.message });
    }
    return res.status(500).json({ error: "Internal server error", details: error });
  }
};

const deleteUser: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await UserModel.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    return res.status(500).json({ error: "Internal server error", details: error });
  }
};

export const usersController = {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  createUser,
};
