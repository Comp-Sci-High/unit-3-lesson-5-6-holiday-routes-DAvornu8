const express = require("express")
const app = express()

app.use(express.static(__dirname + "/public"))

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
})

app.get("/gratitude", (req, res) => {
  res.sendFile(__dirname + "/public/gratitude.html");
})

app.get("/recipes", (req, res) => {
  res.sendFile(__dirname + "/public/recipes.html");
})

app.get("/quiz", (req, res) => {
  res.sendFile(__dirname + "/public/quiz.html");
})

// Health check
app.get('/health', (req, res) => res.json({status: 'ok'}))

const PORT = process.env.PORT || 4000
const HOST = process.env.HOST || '0.0.0.0'
const server = app.listen(PORT, HOST, () => {
  console.log(`Holiday Server is running at http://${HOST === '0.0.0.0' ? 'localhost' : HOST}:${PORT}`)
})

server.on('error', (err) => {
  if (err && err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Perhaps another server is running.`)
  } else {
    console.error('Server error:', err)
  }
  process.exit(1)
})

process.on('unhandledRejection', (err) => { console.error('Unhandled Rejection:', err) })
process.on('uncaughtException', (err) => { console.error('Uncaught Exception:', err) })
