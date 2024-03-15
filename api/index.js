console.log('Server is running...');

const express = require('express');
const cors = require('cors'); //import the cors middleware
const { PrismaClient } = require('../generated/client');

//for testing
//responseURL = 'http://localhost:4001';
responseURL = '';

const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 4001;
const POSTGRES_URL = process.env.POSTGRES_URL;

//use the cors middleware
app.use(cors());

app.use(express.json());


app.get("/api", (req, res) => res.send("Express on Vercel"));


app.get('/api/asteroids/byName/:name', async (req, res) => {
    try {
      const { name } = req.params;
      console.log('Decoded Name:', decodeURIComponent(name));
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




//function to remove time and GMT offset from the date
function removeTimeAndOffset(dateString) {
  return dateString.split(' ').slice(0, 4).join(' ');
}

//add a new endpoint to fetch asteroids by date
app.get('/api/asteroids/byDate/:date', async (req, res) => {
  try {
      const { date } = req.params;

      //convert date string to a JavaScript Date object
      const targetDate = new Date(date);

      //format the target date to match the expected format without time and GMT offset
      const formattedTargetDate = removeTimeAndOffset(formatDate(targetDate));

      //calculate the start and end of the day for the date range
      const startDate = new Date(`${formattedTargetDate}T00:00:00Z`);
      const endDate = new Date(`${formattedTargetDate}T23:59:59Z`);


      console.log(startDate);
      console.log(endDate);
      //use Prisma to find all asteroids with the specified date
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

//route for calling the NASA API
app.get('/api/nasaCall', async (req, res) => {
  try {
      await nasaAPICall(); // Call the nasaAPICall function
      res.json({ message: 'Nasa API call successful.' });
  } catch (error) {
      console.error("Error fetching data:", error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

module.exports = app;

//api call functions
function formatDate(date) {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

async function nasaAPICall() {

  try {
     
      //save each asteroid in the current 24 hrs to the Prisma database
      const today = new Date();
      const todayFormattedDash = formatDate(today);
      const apiKey = "CwyJtXtFTiCZ8iBbx58gRuSxSvlBUTj543CCgc97";
      const URL = `https://api.nasa.gov/neo/rest/v1/feed?start_date=${todayFormattedDash}&end_date=${todayFormattedDash}&api_key=${apiKey}`;
      
      const result = await fetch(URL);
      const data = await result.json();

      const asteroidsArray = Object.values(data.near_earth_objects).flat();
      for (const asteroid of asteroidsArray) {
          await saveAsteroidToDatabase(asteroid);
      }
      
      //deleteAllAsteroids()
      

  } catch (error) {
      console.error("Error fetching data:", error);
  }


}


async function saveAsteroidToDatabase(asteroid) {
  try {
      // Check if the asteroid with the same name already exists in the database
      //console.log(`${responseURL}/api/asteroids/${encodeURIComponent(asteroid.name)}`);


      const checkResponse = await fetch(`${responseURL}/api/asteroids/byName/${decodeURIComponent(asteroid.name)}`);

      console.log(checkResponse);
      const existingAsteroids = await checkResponse.json();
      console.log(existingAsteroids);

      if (existingAsteroids.error === 'Asteroid not found.') {
          // If the asteroid doesn't exist, save it to the database
          const response = await fetch(`${responseURL}/api/asteroids`, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                  name: asteroid.name,
                  closeApproachDate: new Date(asteroid.close_approach_data[0].close_approach_date_full),
                  diameterMin: asteroid.estimated_diameter.meters.estimated_diameter_min,
                  diameterMax: asteroid.estimated_diameter.meters.estimated_diameter_max,
                  potentiallyHazardous: asteroid.is_potentially_hazardous_asteroid,
                  velocity: parseFloat(asteroid.close_approach_data[0].relative_velocity.kilometers_per_hour), // convert to float
              }),
          });

          if (!response.ok) {
              console.error('Failed to save asteroid data:', response.statusText);
          } else {
              console.log('Asteroid data saved successfully!');
          }
      } else {
          console.log(`Asteroid with name ${asteroid.name} already exists in the database. Skipped saving.`);
      }
  } catch (error) {
      console.error('Error saving asteroid data:', error);
  }
}