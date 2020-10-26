const express = require("express");
const cors = require("cors");
const { v4: uuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  const { title } = request.query

  const result = title
    ? repositories.filter(repository => repository.title.includes(title))
    : repositories
  return response.json(result)

});

app.post("/repositories", (request, response) => {
  const { title, techs, url } = request.body

  const repositorie = { id: uuid(), title, url, techs, likes: 0 }


  repositories.push(repositorie)

  return response.json(repositorie)

});

app.put("/repositories/:id", (request, response) => {
  const { title, techs, url } = request.body

  const { id } = request.params

  const repositorieIndex = repositories.findIndex(repo => repo.id === id);
  console.log(repositorieIndex)
  if (repositorieIndex < 0) {
    return response.status(400).json({ error: "Repository not find" })
  }
  if (request.body.likes) {
    return response.status(400).json({ likes: repositories[repositorieIndex].likes })
  }
  const repository = { id, title, techs, url }
  repositories[repositorieIndex] = repository

  return response.json(repository)

});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params

  const repositorieIndex = repositories.findIndex(repo => repo.id === id);

  if (repositorieIndex < 0) {
    return response.status(400).json({ error: "Repository not find" });
  }

  repositories.splice(repositorieIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params
  const repositorieIndex = repositories.findIndex(repo => repo.id === id);

  if (repositorieIndex < 0) {
    return response.status(400).json({ error: "Repository not find" });
  }
  repositories[repositorieIndex].likes = (repositories[repositorieIndex].likes + 1)
  return response.json(repositories[repositorieIndex])
});

module.exports = app;
