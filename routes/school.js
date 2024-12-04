
const express = require('express');
const router = express.Router();
const db = require('../db');

// Helper function to calculate distance
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const toRad = (value) => (value * Math.PI) / 180;
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in kilometers
};

// Add School API
router.post('/addSchool', (req, res) => {
  const { name, address, latitude, longitude } = req.body;

  // Validate input data
  if (!name || !address || typeof latitude !== 'number' || typeof longitude !== 'number') {
    return res.status(400).json({ message: 'Invalid input data' });
  }

  const query = 'INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)';
  db.query(query, [name, address, latitude, longitude], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err });
    }
    res.status(201).json({ message: 'School added successfully', id: results.insertId });
  });
});

// List Schools API
router.get('/listSchools', (req, res) => {
  const { latitude, longitude } = req.query;

  // Validate input data
  if (typeof latitude === 'undefined' || typeof longitude === 'undefined') {
    return res.status(400).json({ message: 'Latitude and longitude are required' });
  }

  const userLat = parseFloat(latitude);
  const userLon = parseFloat(longitude);

  if (isNaN(userLat) || isNaN(userLon)) {
    return res.status(400).json({ message: 'Invalid latitude or longitude' });
  }

  const query = 'SELECT * FROM schools';
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err });
    }

    const sortedSchools = results.map((school) => {
      const distance = calculateDistance(userLat, userLon, school.latitude, school.longitude);
      return { ...school, distance };
    }).sort((a, b) => a.distance - b.distance);

    res.status(200).json(sortedSchools);
  });
});

module.exports = router;
