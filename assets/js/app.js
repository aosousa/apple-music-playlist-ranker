let songsJSON;
let counter = 0;

// constant - lower value means the rating is changed by a smaller fraction
// higher value means the changes in the rating will be more significant
let K = 30;

let totalVotesSpan = document.getElementById("totalVotes");
let ranking = document.getElementById("ranking");

/**
 * Load JSON from a local file
 */
function loadJSON() {   
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', './assets/data/weekndInfo.json', false);
    xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == "200") {
            songsJSON = JSON.parse(xobj.responseText);
        }
    };
    xobj.send(null);
}

/**
 * Sort songs by their rating
 * @param {object} a Object A
 * @param {object} b Object B
 */
function sortSongsByRating(a, b) {
    if (a.rating < b.rating) {
        return 1;
    }

    if (a.rating > b.rating) {
        return -1;
    }

    return 0;
}

/**
 * Update a song's elo rating and the top 25 rating list
 * @param {object} songA Song A
 * @param {object} songB Song B
 */
function updateSongRating(songA, songB) {
    Pa = elo(songA.id, songB.id);
    Pb = elo(songB.id, songA.id);

    Ra = songA.rating + K * (1 - Pa);
    Rb = songB.rating + K * (0 - Pb);

    songA.rating = Ra;
    songB.rating = Rb;

    var sortedSongs = songsJSON.sort(sortSongsByRating);
    ranking.innerHTML = "";
    
    // top 25 maximum
    if (sortedSongs.length >= 25) {
        for (var j = 0; j < 25; j++) {
            var li = document.createElement("li");
            li.appendChild(document.createTextNode(`${sortedSongs[j].name} - ${sortedSongs[j].rating.toFixed(0)}`));
            ranking.appendChild(li);
        }
    } else {
        for (var j = 0; j < sortedSongs.length; j++) {
            var li = document.createElement("li");
            li.appendChild(document.createTextNode(`${sortedSongs[j].name} - ${sortedSongs[j].rating.toFixed(0)}`));
            ranking.appendChild(li);
        }
    }

    counter++;
    totalVotesSpan.innerText = counter;
}

/**
 * Calculate ELO
 * @param {object} a Object A
 * @param {object} b Object B
 */
function elo(a, b) {
    return 1 / (1 + Math.pow(10, (b - a) / 400))
}

/**
 * Load pair of songs information to display in the page
 */
function loadPair() {
    let validSongs = songsJSON;

    let leftRandom = Math.floor(Math.random() * validSongs.length); 
    let rightRandom = Math.floor(Math.random() * validSongs.length);

    // guarantee two different songs
    while (rightRandom == leftRandom) {
        rightRandom = Math.floor(Math.random() * validSongs.length);
    }

    // load artwork and name for the song on the left
    document.getElementById("leftArtwork").setAttribute("src", songsJSON[leftRandom].imageSrc);
    document.getElementById("leftArtwork").setAttribute("height", "400"); // force height in case of missing artwork
    document.getElementById("leftArtwork").setAttribute("width", "400"); // force width in case of missing artwork
    document.getElementById("leftArtwork").onclick = function() {
        updateSongRating(songsJSON[leftRandom], songsJSON[rightRandom]);
        loadPair();
    };
    document.getElementById("leftName").innerText = songsJSON[leftRandom].name;

    // load artwork and name for the song on the right
    document.getElementById("rightArtwork").setAttribute("src", songsJSON[rightRandom].imageSrc);
    document.getElementById("rightArtwork").setAttribute("height", "400"); // force height in case of missing artwork
    document.getElementById("rightArtwork").setAttribute("width", "400"); // force width in case of missing artwork
    document.getElementById("rightArtwork").onclick = function() {
        updateSongRating(songsJSON[rightRandom], songsJSON[leftRandom]);
        loadPair();
    };
    document.getElementById("rightName").innerText = songsJSON[rightRandom].name;
}

loadJSON();
loadPair();