const fs = require("fs"); //módulo para lidar com manipulação de arquivos
const path = require("path");
const uploadConfig = require("../configs/upload");

class DiskStorage {
  async saveFile(file) {
    await fs.promises.rename(
      //função para mover o arquivo
      //Onde o arquivo está agora
      path.resolve(uploadConfig.TMP_FOLDER, file),
      //Para onde o arquivo vai
      path.resolve(uploadConfig.UPLOADS_FOLDER, file)
    );

    return file;
  }

  async deleteFile(file) {
    const filePath = path.resolve(uploadConfig.UPLOADS_FOLDER, file);

    try {
      await fs.promises.stat(filePath); //stat é uma função que deleta o arquivo
    } catch (error) {
      return false;
    }

    await fs.promises.unlink(filePath); //unlink é uma função que remove o arquivo
  }
}

module.exports = DiskStorage;
