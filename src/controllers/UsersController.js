const AppError = require("../utils/AppError");

const knex = require("../database/knex");

const { hash, compare } = require("bcryptjs");

class UsersController {
  async create(req, res) {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      throw new AppError("Informe todos os dados necessários");
    }

    const userAlreadyExists = await knex("users").where({ email }).first();

    if (userAlreadyExists) {
      throw new AppError("E-mail já cadastrado");
    }

    const hashedPassword = await hash(password, 8);

    await knex("users").insert({
      name,
      email,
      password: hashedPassword,
    });

    return res.status(201).json({ message: "Usuário cadastrado com sucesso" });
  }

  async update(req, res) {
    const { name, email, password, oldPassword } = req.body;
    const user_id = req.user.id;

    const user = await knex("users").where({ id: user_id }).first();
    const userWithUpdatedEmail = await knex("users").where({ email }).first();
    //Tratando usuários
    if (!user) {
      throw new AppError("Usuário não existe");
    }

    //Tratando email
    if (userWithUpdatedEmail && userWithUpdatedEmail.id !== user.id) {
      throw new AppError("E-mail já cadastrado");
    }
    user.name = name ?? user.name;
    user.email = email ?? user.email;

    //Tratando senha
    if (password && oldPassword) {
      const checkOldPassword = await compare(oldPassword, user.password);

      if (!checkOldPassword) {
        throw new AppError("A senha antiga não confere");
      }
    }

    if (password && !oldPassword) {
      throw new AppError("Informe a senha antiga para definir a nova senha");
    }
    try {
      user.password = await hash(password, 8);
    } catch (error) {}
    await knex("users").where({ id: user_id }).update({
      name: user.name,
      email: user.email,
      password: user.password,
      updated_at: knex.fn.now(),
    });

    return res.status(200).json();
  }
}
module.exports = UsersController;
