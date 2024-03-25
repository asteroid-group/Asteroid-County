let map;

async function initMap() {
  const { Map } = await google.maps.importLibrary("maps");

  map = new Map(document.getElementById("map"), {
    center: { lat: -34.397, lng: 150.644 },
    zoom: 8,
    mapId: "ec6fca8dcb15bcb7"
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
