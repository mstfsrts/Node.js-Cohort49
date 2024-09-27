const express = require("express");
const fs = require("fs");
const app = express();
const port = 3000;

app.use(express.json());

// Home route
app.get("/", (req, res) => {
    res.send("Welcome to the Blog API!");
});

// 1. Create a new blog post (Create)
app.post("/blogs", (req, res) => {
    const { title, content } = req.body;
    if (title && content) {
        fs.writeFileSync(`${title}.txt`, content);
        res.send("Blog post created successfully.");
    } else {
        res.status(400).send("Title and content are required.");
    }
});

// 2. Read a single blog post (Read one)
app.get("/blogs/:title", (req, res) => {
    const { title } = req.params;
    if (fs.existsSync(`${title}.txt`)) {
        const content = fs.readFileSync(`${title}.txt`, "utf8");
        res.send(content);
    } else {
        res.status(404).send("This post does not exist.");
    }
});

// 3. Update an existing blog post (Update)
app.put("/posts/:title", (req, res) => {
    const { title } = req.params;
    const { content } = req.body;
    if (fs.existsSync(`${title}.txt`)) {
        fs.writeFileSync(`${title}.txt`, content);
        res.send("Post updated successfully.");
    } else {
        res.status(404).send("This post does not exist.");
    }
});

// 4. Delete a blog post (Delete)
app.delete("/blogs/:title", (req, res) => {
    const { title } = req.params;
    if (fs.existsSync(`${title}.txt`)) {
        fs.unlinkSync(`${title}.txt`);
        res.send("Post deleted successfully.");
    } else {
        res.status(404).send("This post does not exist.");
    }
});

// 5. Read all blog posts (Read all)
app.get("/blogs", (req, res) => {
    const files = fs.readdirSync("./"); // Reads all files in the current directory
    const blogs = files.filter(file => file.endsWith(".txt")).map(file => ({ title: file.replace(".txt", "") }));

    res.send(blogs);
});

// Start the server
app.listen(port, () => {
    console.log(`Blog API listening at http://localhost:${port}`);
});
