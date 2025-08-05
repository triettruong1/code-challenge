import { RequestHandler } from "express";
import { UserModel } from "../domain/mongodb";

interface FilterUserQuery {
  name?: RegExp | string;
  email?: RegExp | string;
  age?: number | string;
}

const getUsers: RequestHandler = async (req, res) => {
  try {
    const { query } = req;
    const { name, email, age } = query;

    const filterObject: FilterUserQuery = {};

    if (name) {
      filterObject.name = new RegExp(String(name), "i");
    }

    if (email) {
      filterObject.email = new RegExp(String(email), "i");
    }

    if (age) {
      filterObject.age = Number(age);
    }

    const users = await UserModel.find({
      ...filterObject,
    });

    res.render("index", { users });
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
  const { body } = req;

  if (!body || !body.name || !body.email) {
    return res.status(400).json({ error: "Name and email are required" });
  }

  const existingUser = await UserModel.findOne({ email: body.email });

  if (existingUser) {
    return res.status(400).json({ error: "User with this email already exists" });
  }

  const user = new UserModel({
    id: new Date().getTime().toString(), // Simple ID generation
    name: body.name,
    age: body.age || null, // Optional age
    email: body.email,
  });

  try {
    await user.save();
    res.status(201).json({ message: "User created successfully", user });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Internal server error", details: error });
  }
};

const updateUser: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { body } = req;

    if (!body || !body.name || !body.email) {
      return res.status(400).json({ error: "Name and email are required" });
    }

    const user = await UserModel.findByIdAndUpdate(
      id,
      {
        name: body.name,
        age: body.age || null, // Optional age
        email: body.email,
      },
      { new: true } // Return the updated user
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ message: "User updated successfully", user });
  } catch (error) {
    console.error("Error updating user:", error);
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
