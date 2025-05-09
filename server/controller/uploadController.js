
import fileModel from "../model/fileModel.js";
import path from "path";
import dotenv from "dotenv";
import bcrypt from 'bcrypt';
import User from '../model/userModel.js';


dotenv.config();

const backendUrl = process.env.BACKEND_URL;

export const UploadController = async (req, res) => {
  try {
    console.log("from upload controller");

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded." });
    }

    const fileObject = {
      path: req.file.path,
      name: req.file.originalname,
    };

    const file = await fileModel.create(fileObject);
    console.log("Saved file:", file);

    return res.status(200).json({
      path: `${backendUrl}/files/${file._id}`,
    });

  } catch (err) {
    console.error("Upload error:", err);
    return res.status(500).json({ message: err.message });
  }
};

export const DownloadController = async (req, res) => {
  try {
    const file = await fileModel.findById(req.params.fileId);

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    return res.download(file.path, file.name);

  } catch (error) {
    console.error("Download error:", error);
    return res.status(500).json({ message: error.message });
  }
};

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    
    const existingUser = await User.findOne({ email });
    console.log({existingUser,email} );
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

  
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error registering user', error: err.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found!' });
    }

    console.log(user, password);
    
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: 'Invalid password!' });
    }

    res.status(200).json({ message: 'Login successful' });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
};


export const logoutUser = async (req, res) => {
  try {
    res.status(200).json({ message: "Logout successful" });
  } catch (err) {
    res.status(500).json({ message: "Logout failed", error: err.message });
  }
};


