const express = require("express");

// Import the database to acess 
const db = require("../data/db");

const router = express.Router();

// ******************************************************************
// GET  /api/posts
// Returns an array of all the post objects contained in the database.
router.get("/", (req,res)=>{
  // console.log("This is req in GET /api/posts :",req);
  db.find()
    .then(posts=>{
      res.status(200).json(posts);
    })
    .catch(err=>{
      console.log("Error in db.find in GET /api/posts");
      res.status(500)
        .json({error: "The posts information could not be retrieved."});
    });
})


// ******************************************************************
// GET  /api/posts/:id
// Returns the post object with the specified id.
router.get("/:id",(req,res)=>{
  const id = req.params.id;
  
  db.findById(id)
    .then(post=>{
      // console.log("This is posts in db.findById in GET /api/posts/:id >",post);

      if(post.length===0) {
        res.status(404)
          .json({message: "The post with the specified ID does not exist."});
      }
      else {
        res.status(200).json(post);
      }

    })
    .catch(err=>{
      console.log("Error in db.findById in GET /api/posts/:id");
      res.status(500)
        .json({error: "The post information could not be retrieved."});
    });
})



module.exports = router;