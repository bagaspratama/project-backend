import Users from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const index = (req, res) => {
  res.send("Hallo World");
};

export const Login = async (req, res) => {
  try {
    const user = await Users.findAll({
      where: {
        email: req.body.email,
      },
    });

    const match = await bcrypt.compare(req.body.password, user["0"].password);

    if (!match) {
      return res.status(404).json({ msg: "Password tidak ditemukan" });
    }

    const userId = user["0"].id;
    const uuid = user["0"].uuid;
    const name = user["0"].name;
    const email = user["0"].email;
    const role = user["0"].role;

    const token = jwt.sign(
      { userId, uuid, name, email, role },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "1d",
      }
    );
    await Users.update(
      { token: token },
      {
        where: {
          id: userId,
        },
      }
    );
    res.status(200).json({
      msg: "Login berhasil",
      data: {
        token: token,
        userId: userId,
        uuid: uuid,
        name: name,
        email: email,
        role: role,
      },
    });
  } catch (error) {
    res.status(404).json({ msg: " Email tidak ditemukan " });
  }
};
