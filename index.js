// server.js
const express = require("express");
const mongoose = require("mongoose");
const { ObjectId } = require('mongoose').Types;
const app = express();
const port = 3001;
const bodyParser = require("body-parser");
const cors = require("cors");
app.use(bodyParser.json());
app.use(cors());

// MongoDB Connection URL
const mongoUrl = "mongodb://localhost:27017/NodesDataBase";

// Connect to MongoDB using Mongoose
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

db.on("error", (error) => {
  console.error("Error connecting to MongoDB:", error);
});

db.once("open", () => {
  console.log("Connected to MongoDB");

  // Define a Mongoose schema

  // Define the Mongoose schema for a node

  const mongoose = require("mongoose");

  const nodeSchema = new mongoose.Schema({
    id: String,
    type: String,
    data: {
      label: String,
    },
    position: {
      x: Number,
      y: Number,
    },
    sourcePosition: String,
    targetPosition: String,
  });

  const edgeSchema = new mongoose.Schema({
    source: String,
    sourceHandle: String,
    target: String,
    targetHandle: String,
    id: String,
  });

  const graphSchema = new mongoose.Schema({
    graphId: String,
    nodes: [nodeSchema],
    edges: [edgeSchema],
  });

  const GraphModel = mongoose.model("Graph", graphSchema);

  // Express routes
  app.post("/api/nodes", async (req, res) => {
    try {
      const graphId = req.body.graphId;
      const graphData = req.body;

      // Update the existing document

      console.log("GRAPHHHHHH" , graphId)
      const updatedGraph = await GraphModel.findByIdAndUpdate(
        { _id: new ObjectId(graphId) },
        { $set: graphData },
        { new: true, upsert: true }
      );

      res.json(updatedGraph);
    } catch (error) {
      console.error("Error updating graph:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  // Add a route to get all nodes
  app.get("/api/nodes", async (req, res) => {
    try {
      const graphModels = await GraphModel.find();
  
      // Collect nodes from all documents
      const allNodes = graphModels.flatMap((model) => model.nodes);
      const allEdges = graphModels.flatMap((model)=>model.edges)
  
      res.json([...allNodes , ...allEdges]);
    } catch (error) {
      console.error("Error fetching nodes:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  // Add a route to update a node by id
  app.put("/api/nodes/:id", async (req, res) => {
    const nodeId = req.params.id;

    try {
      const updatedNode = await GraphModel.findOneAndUpdate(
        { id: nodeId },
        { $set: req.body },
        { new: true }
      );

      if (updatedNode) {
        res.json(updatedNode);
      } else {
        res.status(404).json({ error: "Node not found" });
      }
    } catch (error) {
      console.error("Error updating node:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  // Start the Express server
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
});
