const knex = require("../database/knex");
const authConfig = require("../configs/auth");

const AppError = require("../utils/AppError");

const { compare } = require("bcryptjs");
const { sign } = require("jsonwebtoken");

class SessionsController {
  async create(req, res) {
    const { email, password } = req.body;

    const user = await knex("users").where({ email }).first();

    if (!user) {
      throw new AppError("e-mail ou senha incorretos");
    }

    const passwordsMatch = await compare(password, user.password);

    if (!passwordsMatch) {
      throw new AppError("e-mail ou senha incorretos");
    }

    const { secret, expiresIn } = authConfig.jwt;

    const token = sign({}, secret, {
      subject: String(user.id),
      expiresIn,
    });

    return res.json({ user, token });
  }
}

module.exports = SessionsController;
