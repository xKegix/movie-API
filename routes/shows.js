const express = require('express');
const router = express.Router();

const {show} = require('../models/index');
const {db} = require('../db');
const {check, validationResult} = require("express-validator");


// GET all shows
router.get('/', async (req, res) => { // Defines a route for handling GET requests to the root path of the "shows" endpoint.
    const allShows = await Show.findAll(); // Retrieves all shows from the database using the findAll() method of the Show model. This method returns a Promise that resolves to an array of show objects.
    res.json(allShows); // sends the array of show objects as a JSON response.
})

// GET one show
router.get('/:id', async (req, res) => {
    const id = req.params.id;
    const getShow = await Show.findByPk(id);
    res.json(getShow);
})

// GET shows of a particular genre
router.get('/genre/:genre', async (req, res) => {
  const genre = req.params.genre;
  const getShows = await Show.findAll({where: {genre: genre}});
  res.json(getShows);
})

// PUT update rating of a show that has been watched
router.put('/:id/rating', async (req, res) => { // define route for handling update requests. Show id in url, rating in request body.
  const id = req.params.id; // get show id.
  const {rating} = req.body; // get rating from request body.

  // validate rating.
  if (!rating || !rating.trim()) { // check rating valid, not empty or whitespace only.
        return res.status(400).json({message: 'No Rating: Rating is required!'});
  }

  // update show with rating.
  const show = await Show.findByPk(id); 
  if (!show) {
    return res.status(404).json({message: 'Show does not exist!'});
  }
  show.rating = rating;
  await show.save();

  res,join(show);
})

// PUT update the status of a show
router.put('/:id/status', async (req, res) => {
    const id = req.params.id;
    const status = req.body.status.trim(); // trim any whitespace from the status field
  
    // server side validation
    if (!status) {
      return res.status(400).json({ message: 'Status cannot be empty' });
    }
    if (status.length < 5 || status.length > 25) {
      return res.status(400).json({ message: 'Status must be between 5 and 25 characters' });
    }
  
    try {
      const show = await Show.findByPk(id);
      if (!show) {
        return res.status(404).json({ message: 'Show not found' });
      }
      show.status = status; // update the status field of the show object
      await show.save(); // save the changes to the database
      res.json(show);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server Error' });
    }
  })
  

// DELETE a show
router.delete('/:id', async (req, res) => {
    const id = req.params.id;
  
    try {
      const show = await Show.findByPk(id);
      if (!show) {
        return res.status(404).json({ message: 'Show not found' });
      }
      await show.destroy(); // delete the show object from the database
      res.json({ message: 'Show deleted successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server Error' });
    }
  })
  

module.exports = router;
