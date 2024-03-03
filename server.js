const express = require('express');
const cors = require('cors'); // Import the cors middleware
const { PrismaClient } = require('./generated/client');

const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 3001;
const POSTGRES_URL = process.env.POSTGRES_URL;

// Use the cors middleware
app.use(cors());

app.use(express.json());


app.get('/api/asteroids/:name', async (req, res) => {
    try {
      const { name } = req.params;
      //console.log('Decoded Name:', decodeURIComponent(name));
      const asteroid = await prisma.asteroid.findFirst({
        where: {
          name: {
            equals: decodeURIComponent(name),
          },
        },
      });
  
      if (!asteroid) {
        return res.status(404).json({ error: 'Asteroid not found.' });
      }
  
      return res.json(asteroid);
    } catch (error) {
      console.error('Error retrieving asteroid:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  });


  function formatDate(date) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// Function to remove time and GMT offset from the date
function removeTimeAndOffset(dateString) {
    return dateString.split(' ').slice(0, 4).join(' ');
}


// Function to remove time and GMT offset from the date
function removeTimeAndOffset(dateString) {
  return dateString.split(' ').slice(0, 4).join(' ');
}

// Add a new endpoint to fetch asteroids by date
app.get('/api/asteroids/byDate/:date', async (req, res) => {
  try {
      const { date } = req.params;

      // Convert date string to a JavaScript Date object
      const targetDate = new Date(date);

      // Format the target date to match the expected format without time and GMT offset
      const formattedTargetDate = removeTimeAndOffset(formatDate(targetDate));

      // Calculate the start and end of the day for the date range
      const startDate = new Date(`${formattedTargetDate}T00:00:00Z`);
      const endDate = new Date(`${formattedTargetDate}T23:59:59Z`);


      console.log(startDate);
      console.log(endDate);
      // Use Prisma to find all asteroids with the specified date
      const asteroids = await prisma.asteroid.findMany({
          where: {
              closeApproachDate: {
                  gte: startDate,
                  lt: endDate,
              },
          },
      });

      res.json(asteroids);
  } catch (error) {
      console.error('Error retrieving asteroids by date:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});
  
app.post('/api/asteroids', async (req, res) => {
  const asteroid = req.body;
  try {
    const createdAsteroid = await prisma.asteroid.create({ data: asteroid });
    res.json(createdAsteroid);
  } catch (error) {
    console.error('Error saving asteroid data:', error);
    res.status(500).json({ error: 'Error saving asteroid data' });
  }
});
app.delete('/api/asteroids', async (req, res) => {
    try {
      //clear all data in the 'asteroid' table
      await prisma.asteroid.deleteMany();
      
      res.status(200).json({ message: 'All asteroid entries deleted successfully.' });
    } catch (error) {
      console.error('Error deleting asteroids:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  if (!POSTGRES_URL) {
    console.error('Missing POSTGRES_URL environment variable. Make sure to set it.');
  }

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
