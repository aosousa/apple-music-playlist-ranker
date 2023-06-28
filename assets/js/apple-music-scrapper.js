var songs = [];
var songElements = document.getElementsByClassName('songs-list-row');

for (var i = 0; i < songElements.length; i++) {
	var e = songElements[i];

	var songNameDiv = e.getElementsByClassName("songs-list__col--song")[0];
	var songWrapper = songNameDiv.getElementsByClassName("songs-list-row__song-container")[0].getElementsByClassName("songs-list-row__song-wrapper")[0];
	var songName = "";

	// Apple Music has different classes depending on whether a song has an explicit language warning
	if (songWrapper.children[0].classList.contains("songs-list-row__song-name-wrapper--explicit")) {
		songName = songWrapper.getElementsByClassName("songs-list-row__song-name-wrapper")[0].getElementsByClassName("songs-list-row__explicit-wrapper");
	} else {
		songName = songWrapper.getElementsByClassName("songs-list-row__song-name-wrapper")[0].getElementsByClassName("songs-list-row__song-name");
	}

	var songInfo = {
		id: i,
		name: songName[0].innerText, 
		imageSrc: e.getElementsByClassName('songs-list-row__artwork-wrapper')[0].children[0].children[0].children[0].srcset.split(',')[0].slice(0, -4).replace('40x40bb.webp', '400x400bb.webp'),
		rating: 1400
	};
	songs.push(songInfo);
}

copy(songs);