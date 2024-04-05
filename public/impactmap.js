let map;
let userLocationCircle;

async function initMap() {
  const { Map, Circle } = await google.maps.importLibrary("maps");

  map = new Map(document.getElementById("map"), {
    zoom: 8,
    center: { lat: -25.344, lng: 131.036 }, //default location in Australia for no reason
    mapId: "ec6fca8dcb15bcb7"
  });

  //try HTML5 geolocation
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        map.setCenter(pos);
        addRadius(pos);
      },
      () => {
        //if user denies or if geolocation fails keep the default location
        map.setCenter({ lat: -25.344, lng: 131.036 });
      }
    );
  } else {
     //again, if user denies or if geolocation fails keep the default location
    map.setCenter({ lat: -25.344, lng: 131.036 });
  }
}

function addRadius(center) {
  userLocationCircle = new google.maps.Circle({
    strokeColor: "#FF0000",
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: "#FF0000",
    fillOpacity: 0.35,
    map: map,
    center: center,
    radius: 10000, // Set the radius in meters (e.g., 10000 meters = 10 kilometers)
  });
}

initMap();


function makeAstro()
{
  document.getElementById('pick_route').style.display = 'none';
  document.getElementById('make_Astro').style.display = 'block';
}

function pickAstro()
{
  document.getElementById('pick_route').style.display = 'none';
  document.getElementById('pick_Astro').style.display = 'block';
}
document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('createAstro').addEventListener('submit', function(event) {
      event.preventDefault(); 
      
      var adiameter = parseInt(document.getElementById('diameter').value);
      var aspeed = parseInt(document.getElementById('speed').value);
      var aangle = parseInt(document.getElementById('angle').value);
      var asteroidClass = document.getElementById('astro_class').value;
      var density = 0;

      if (asteroidClass === "c")
      {
        density = 1.38;
      }
      else if (asteroidClass === "s")
      {
        density = 2.71;
      }
      else if(asteroidClass === "m")
      {
        density = 5.32;
      }
    
      
      simulateImpact(adiameter, aspeed, aangle, density);
      
      this.reset();
  });
});

function simulateImpact(adiameter, aspeed, aangle, density)
{
  var astroElement = document.getElementById('astroresults');

  astroElement.innerHTML = `<p>Chosen:<br> Diameter: ${adiameter} meters <br> Speed: ${aspeed} km/s<br>Angle: ${aangle} degrees <br>Density: ${density} g/cm^3` 

 // math goes here ~  tbd
}
