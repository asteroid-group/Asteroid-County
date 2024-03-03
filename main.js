const responseURL='http://localhost:3001'

//'http://localhost:3000' for localhost testing
//'https://asteroid-county.vercel.app' for deployment

document.addEventListener('DOMContentLoaded', function() {



    //function to format the date as YYYY-MM-DD
    function formatDate(date) {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    //function to remove time from end of date for example: Sun Mar 03 2024 06:44:00 GMT-0800 (Pacific Standard Time) = Sun Mar 03 2024
    function splitDate(date) {
        const formattedDate = date.toString().split(' ').slice(0, 4).join(' ');
        console.log(formattedDate);
        return formattedDate;
    }


    //function to make API call
    async function databaseAPICall() {
        document.getElementById("loading-message").textContent = "Loading...";

        try {
           
            //Fetch asteroids by today's date from the server
            const today = new Date();
            const todayFormattedSplit = splitDate(today);
            const adata = await fetch(`${responseURL}/api/asteroids/byDate/${todayFormattedSplit}`);

            //console.log(adata);
            const asteroidsToday = await adata.json();

            //display
            displayAsteroidNames(asteroidsToday);

            //make nasa api call
            nasaAPICall();

        } catch (error) {
            console.error("Error fetching data:", error);
        }
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


            const checkResponse = await fetch(`${responseURL}/api/asteroids/${decodeURIComponent(asteroid.name)}`);

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

      async function deleteAllAsteroids() {
        try {
          const response = await fetch(`${responseURL}/api/asteroids`, {
            method: 'DELETE',
          });
      
          if (!response.ok) {
            console.error('Failed to delete asteroid entries:', response.statusText);
          } else {
            console.log('All asteroid entries deleted successfully!');
          }
        } catch (error) {
          console.error('Error deleting asteroid entries:', error);
        }
      }



 //function to display asteroid names
    function displayAsteroidNames(data) {
        document.getElementById("loading-message").style.display = "none";
        const asteroidButtons = document.getElementById("asteroid-buttons");

        const asteroidsArray = Object.values(data); // Flatten the data object

        for (const asteroid of asteroidsArray) {
            const button = document.createElement("button");
            button.classList.add("asteroid-button");
            button.textContent = asteroid.name;
            button.dataset.asteroidId = asteroid.id;
            button.addEventListener("click", function() {
                displayAsteroidInfo(asteroid);
            });
            asteroidButtons.appendChild(button);
        }
    }



    //function to display detailed asteroid information
    function displayAsteroidInfo(asteroid) {
        const asteroidsInfo = document.getElementById("asteroids-info");
        asteroidsInfo.innerHTML = `<p>Name: ${asteroid.name}<br>Close approach date and time:<br>${asteroid.close_approach_data[0].close_approach_date_full} <br>Diameter Min: ${asteroid.estimated_diameter.meters.estimated_diameter_min} meters<br>Diameter Max: ${asteroid.estimated_diameter.meters.estimated_diameter_max} meters<br>Potentially hazardous?: ${asteroid.is_potentially_hazardous_asteroid}<br>Velocity: ${asteroid.close_approach_data[0].relative_velocity.kilometers_per_hour} km per hour</p>`;
    }

    //execute the API call function after the page has loaded
    window.onload = databaseAPICall;
});
