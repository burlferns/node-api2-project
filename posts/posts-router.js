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


// ******************************************************************
// GET  /api/posts/:id/comments
// Returns an array of all the comment objects associated with the post with the specified id
router.get("/:id/comments",(req,res)=>{
  const id = req.params.id;
  
  db.findPostComments(id)
    .then(comments=>{
      // console.log("This is comments in db.findPostComments in GET /api/posts/:id/comments >",comments);

      if(comments.length===0) {
        res.status(404)
          .json({message: "The post with the specified ID does not exist."});
      }
      else {
        res.status(200).json(comments);
      }

    })
    .catch(err=>{
      console.log("Error in db.findPostComments in GET /api/posts/:id/comments");
      res.status(500)
        .json({error: "The comments information could not be retrieved."});
    });
})


// ******************************************************************
// POST  /api/posts
// Creates a post using the information sent inside the request body.
router.post("/",(req,res)=>{
  const body = req.body;

  if(!body.title || !body.contents) {
    res.status(400)
      .json({ errorMessage: "Please provide title and contents for the post." });
  }
  else {
    db.insert(body)
      .then(posted=>{
        // console.log("This is posted in db.insert in POST /api/posts >",post);

        db.findById(posted.id)
          .then(post=>{
            // console.log("This is posts in db.findById in POST /api/posts >",post);
      
            if(post.length===0) {
              res.status(500)
                .json({error: "Post saved into database but error encountered when retriving it again"});
            }
            else {
              res.status(201).json(post);
            }
      
          })
          .catch(err=>{
            console.log("Error in db.findById in POST /api/posts");
            res.status(500)
              .json({error: "Post saved into database but error encountered when retriving it again"});
          });

      })
      .catch(err=>{
        console.log("Error in db.insert in POST /api/posts");
        res.status(500)
          .json({error: "There was an error while saving the post to the database"});
      });
  }
})


// ******************************************************************
// POST  /api/posts/:id/comments
// Creates a comment for the post with the specified id using information sent inside of the request body
router.post("/:id/comments",(req,res)=>{
  const body = req.body;
  const id = req.params.id;

  if(!body.text) {
    res.status(400)
      .json({ errorMessage: "Please provide text for the comment." });
  }
  else {
    // Check if post with id is there in database, otherwise return error message that post of id not found

    db.findById(id)
      .then(post=>{
  
        if(post.length===0) {
          res.status(404)
            .json({message: "The post with the specified ID does not exist."});
        }
        else {          
          db.insertComment({...body,post_id:id})
            .then(idReturn=>{

              db.findCommentById(idReturn.id)
                .then(comment=>{
                  res.status(201).json(comment);
                })
                .catch(err=>{
                  console.log("Error in db.findById in POST /api/posts/:id/comments");
                  res.status(500)
                    .json({error: "Comment was saved into database, but there was an error retreving it afterwards"});
                });


            })
            .catch(err=>{
              console.log("Error in db.insertComment in POST /api/posts/:id/comments");
              res.status(500)
                .json({error: "There was an error while saving the comment to the database"});
            });
        }
  
      })
      .catch(err=>{
        console.log("Error in db.findById in POST /api/posts/:id/comments");
        res.status(500)
          .json({error: "There was an error while saving the comment to the database"});
      });



  }










})







module.exports = router;