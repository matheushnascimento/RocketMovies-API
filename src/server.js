require("express-async-errors");

const cors = require("cors");
const express = require("express");
const routes = require("./routes");
const AppError = require("./utils/AppError");
const uploadConfig = require("./configs/upload");

const app = express();
app.use(cors());
const PORT = 3333;

app.use(express.json());

app.use("/files", express.static(uploadConfig.UPLOADS_FOLDER));

app.use(routes);

//Configuração de tratamento de erro
app.use((error, request, response, next) => {
  if (error instanceof AppError) {
    //erro do cliente
    return response.status(error.statusCode).json({
      status: "error",
      message: error.message,
    });
  }

  console.log(error);

  return response.status(500).json({
    status: "error",
    message: "internal server error",
  });
});

app.listen(PORT, () => console.log(`API running at PORT ${PORT}`));
