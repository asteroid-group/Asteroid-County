let map;
let userLocationCircle;


async function initMap() {
  const { Map, Circle } = await google.maps.importLibrary("maps");

  map = new Map(document.getElementById("map"), {
    zoom: 12, //made the zoom closer becaause it was hard to see
    center: { lat: -25.344, lng: 131.036 },
    mapId: "ec6fca8dcb15bcb7"
  });

  // HTML5 geolocation
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
        map.setCenter({ lat: -25.344, lng: 131.036 });
      }
    );
  } else {
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
    radius: 0, //measured in meters
  });
}

initMap();

function updateRadius(radius) {
  userLocationCircle.setRadius(radius);
}

function makeAstro() {
  document.getElementById('pick_route').style.display = 'none';
  document.getElementById('make_Astro').style.display = 'block';
}

function pickAstro() {
  document.getElementById('pick_route').style.display = 'none';
  document.getElementById('pick_Astro').style.display = 'block';
}

function goback() {
  document.getElementById('pick_route').style.display = 'block';
  document.getElementById('pick_Astro').style.display = 'none';
  document.getElementById('make_Astro').style.display = 'none';
}

document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('createAstro').addEventListener('submit', function(event) {
    event.preventDefault();

    var adiameter = parseInt(document.getElementById('diameter').value);
    var aspeed = parseInt(document.getElementById('speed').value);
    var aangle = parseInt(document.getElementById('angle').value);
    var asteroidClass = document.getElementById('astro_class').value;
    var density = 0;

    if (asteroidClass === "c") {
      density = 1.38;
    } else if (asteroidClass === "s") {
      density = 2.71;
    } else if (asteroidClass === "m") {
      density = 5.32;
    }

    simulateImpact(adiameter, aspeed, aangle, density);
    
    
    //seems better if it doesn't reset so you can play with values
    //this.reset();
  });
});



function simulateImpact(adiameter, aspeed, aangle, density) {
  var astroElement = document.getElementById('astroresults');
  document.getElementById('asteroids-info').style.display='none';

  // Constants
  var pi = 2600; // Density of Earth's crust in kg/m³
  var gE = 9.8; // Gravity on Earth in m/s²
  var constant = 1.161; // Constant for solid rock targets

  // Convert density to kg/m³
  density = density / 1000; // Convert g/m³ to kg/m³


  // Calculate diameter in meters
  var L = adiameter * Math.sin(aangle); // Diameter after entering atmosphere
  var D = constant * Math.pow((pi * density * L * Math.pow(aspeed, 2) * Math.pow(gE, -0.22) * Math.sin(aangle)), 1/3);


  // Update the radius in meters
  var drawRadius = D / 2;
  updateRadius(drawRadius);
  returnDiameter(D);
}

function returnDiameter(Dia)
{
  const diameter = Dia;
  const resultingDiameter = document.getElementById("impactDia");
  resultingDiameter.innerHTML = `<h4><b>Impact Diameter</b>: ${diameter} meters</h4>`;
  if(diameter>=0 && diameter < 21){
    resultingDiameter.innerHTML += `<h4>You made an <b><i>Asteroid Garden!</i></b></h4>`
  } else if (diameter >= 21 && diameter < 41) {
    resultingDiameter.innerHTML += `<h4>You made an <b><i>Asteroid Home!</i></b></h4>`
  }
  else if (diameter >= 41 && diameter < 71) {
    resultingDiameter.innerHTML += `<h4>You made an <b><i>Asteroid Mansion!</i></b></h4>`
  }
  else if (diameter >= 71 && diameter < 520) {
    resultingDiameter.innerHTML += `<h4>You made an <b><i>Asteroid Block!</i></b></h4>`
  }
  else if (diameter >= 520 && diameter < 1060) {
    resultingDiameter.innerHTML += `<h4>You made an <b><i>Asteroid Neighborhood!</i></b></h4>`
  }
  else if (diameter >= 1060 && diameter < 6000) {
    resultingDiameter.innerHTML += `<h4>You made an <b><i>Asteroid Town!</i></b></h4>`
  }
  else if (diameter >= 6000 && diameter < 10001) {
    resultingDiameter.innerHTML += `<h4>You made an <b><i>Asteroid City!</i></b></h4>`
  }
  else {
    resultingDiameter.innerHTML += `<h4>You made an <b><i>Asteroid County!</i></b></h4>`
  }



  

}

function toggleText() {
  var content = document.getElementById("expandable-content");
  if (content.style.display === "none") {
      content.style.display = "block";
  } else {
      content.style.display = "none";
  }
}

