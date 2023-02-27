const express = require('express');
const router = express.Router();

// GET all users
router.get('/', async (req, res) => {
    const allUsers = await User.findAll();
    res.json(allUsers);
  })
  
  // GET one user
  router.get('/:id', async (req, res) => {
    const id = req.params.id;
    const getUser = await User.findByPk(id);
    res.json(getUser);
  })
  
  // GET all shows watched by a user
  router.get('/:id/shows', async (req, res) => {
    const id = req.params.id;
    const getShows = await User.findByPk(id, {
      include: {
        model: Show,
        as: 'shows'
      }
    })
    res.json(getShows.shows);
  })
  
  // PUT update and add a show if a user has watched it
  router.put('/:id/shows', async (req, res) => {
    const id = req.params.id;
    const { title, status, rating } = req.body;
    
    if (!title || title.trim() === '') {
      return res.status(400).json({ message: 'Title is required' });
    }
    
    if (!status || status.trim() === '') {
      return res.status(400).json({ message: 'Status is required' });
    }
    
    if (status.trim().length < 5 || status.trim().length > 25) {
      return res.status(400).json({ message: 'Status must be between 5 and 25 characters' });
    }
    
    if (!rating || rating.trim() === '') {
      return res.status(400).json({ message: 'Rating is required' });
    }
  
    try {
      let user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      let show = await Show.findOne({ where: { title } });
      if (!show) {
        show = await Show.create({ title });
      }
      await user.addShow(show, { through: { status, rating } });
      user = await User.findByPk(id, {
        include: {
          model: Show,
          as: 'shows'
        }
      })
      res.json(user.shows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server Error' });
    }
  })
  

module.exports = router;
