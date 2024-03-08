const knex = require("../database/knex");
const AppError = require("../utils/AppError");
class NotesController {
  async create(req, res) {
    const user_id = req.user.id;
    const { title, description, rating, tags } = req.body;

    //Salva a nota no banco de dados
    const [note_id] = await knex("notes").insert({
      title,
      description,
      rating,
      user_id,
    });

    //Será criado um novo objeto para cada tag informada na na lista ao criar a nota
    const tagsInsert = tags.map(name => {
      return {
        note_id,
        name,
        user_id,
      };
    });

    await knex("tags").insert(tagsInsert);
    return res.status(201).json({});
  }

  async show(req, res) {
    const { id } = req.params;

    const note = await knex("notes").where({ id }).first();

    if (typeof note == "undefined") {
      throw new AppError("Filme não encontrado");
    }

    const tags = await knex("tags").where({ note_id: id });

    return res.json({
      ...note,
      tags,
    });
  }

  async delete(req, res) {
    const { id } = req.params;
    console.log(id);
    await knex("notes").where({ id }).delete();

    return res.status(204).json();
  }

  async index(request, response) {
    const { title, tags } = request.query;

    const user_id = request.user.id;

    let notes;

    if (tags) {
      const filterTags = tags.split(",").map(tag => tag.trim());

      notes = await knex("tags")
        .select(["notes.id", "notes.title", "notes.user_id"])
        .where("notes.user_id", user_id)
        .whereLike("notes.title", `%${title}%`)
        .whereIn("name", filterTags)
        .innerJoin("notes", "notes.id", "tags.note_id")
        .orderBy("notes.title");
    } else {
      notes = await knex("notes")
        .where({ user_id })
        .whereLike("title", `%${title}%`)
        .orderBy("title");
    }

    const userTags = await knex("tags").where({ user_id });
    const notesWithTags = notes.map(note => {
      const noteTags = userTags.filter(tag => tag.note_id === note.id);

      return {
        ...note,
        tags: noteTags,
      };
    });

    return response.json(notesWithTags);
  }
}
module.exports = NotesController;
