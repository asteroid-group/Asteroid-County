// Function to change the image based on the diameter
function changeImage(diameter) {

    const imageElement = document.getElementById("asteroid-image");
    if (diameter >= 1 && diameter <= 20) {
        imageElement.src = "./images/frame0000.png";
    } else if (diameter >= 21 && diameter <= 40) {
        imageElement.src = "./images/frame0001.png";
    } else if (diameter >= 41 && diameter <= 60) {
        imageElement.src = "./images/frame0002.png";
    } else if (diameter >= 61 && diameter <= 80) {
        imageElement.src = "./images/frame0003.png";
    } else if (diameter >= 81 && diameter <= 100) {
        imageElement.src = "./images/frame0004.png";
    } else if (diameter >= 101 && diameter <= 200) {
        imageElement.src = "./images/frame0005.png";
    } else if (diameter >= 201 && diameter <= 300) {
        imageElement.src = "./images/frame0006.png";
    } else if (diameter >= 301 && diameter <= 400) {
        imageElement.src = "./images/frame0007.png";
    } else if (diameter >= 401 && diameter <= 500) {
        imageElement.src = "./images/frame0008.png";
    } else if (diameter >= 501 && diameter <= 600) {
        imageElement.src = "./images/frame0009.png";
    } else if (diameter >= 601 && diameter <= 700) {
        imageElement.src = "./images/frame0010.png";
    } else if (diameter >= 701 && diameter <= 800) {
        imageElement.src = "./images/frame0011.png";
    } else if (diameter >= 801 && diameter <= 900) {
        imageElement.src = "./images/frame0012.png";
    } else if (diameter >= 901 && diameter <= 1000) {
        imageElement.src = "./images/frame0013.png";
    } else if (diameter >= 1001 && diameter <= 1100) {
        imageElement.src = "./images/frame0014.png";
    } else if (diameter >= 1101 && diameter <= 1200) {
        imageElement.src = "./images/frame0015.png";
    } else if (diameter >= 1201 && diameter <= 1300) {
        imageElement.src = "./images/frame0016.png";
    } else if (diameter >= 1301 && diameter <= 1400) {
        imageElement.src = "./images/frame0017.png";
    } else if (diameter >= 1401 && diameter <= 1500) {
        imageElement.src = "./images/frame0018.png";
    } else if (diameter >= 1501 && diameter <= 1600) {
        imageElement.src = "./images/frame0019.png";
    } else if (diameter >= 1601 && diameter <= 1700) {
        imageElement.src = "./images/frame0020.png";
    } else if (diameter >= 1701 && diameter <= 1800) {
        imageElement.src = "./images/frame0021.png";
    } else if (diameter >= 1801 && diameter <= 1900) {
        imageElement.src = "./images/frame0022.png";
    } else if (diameter >= 1901 && diameter <= 2000) {
        imageElement.src = "./images/frame0023.png";
    } else {
        imageElement.src = "./images/frame0024.png";
    }
}
