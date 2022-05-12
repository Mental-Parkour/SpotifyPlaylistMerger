import SpotifyWebApi from 'spotify-web-api-node';

const spotifyApi = new SpotifyWebApi({
	clientId: 'SpotifyClientId',
	clientSecret: 'SpotifyClientSceret',
	accessToken: 'AccessToken'
});

const playlistName = 'New Merged Playlist';

const playlistsToMerge = ['2omLUEB7U4UZcVg1u5qCZY','1yCETSMikEHnPokjzRmaJP'];

async function Sleep(ms: number = 0): Promise<void> {
    return await new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
	let offset = 0;

	const tracks1 = [];
	let tracks: any[] = [''];

	while(tracks.length) {

		const response = await spotifyApi.getPlaylistTracks(playlistsToMerge[0], {
			offset
		})

		offset+=100;

		tracks = response.body.items;
		tracks1.push(...tracks);
	}

	offset = 0;

	const tracks2 = [];
	tracks = [''];

	while(tracks.length) {

		const response = await spotifyApi.getPlaylistTracks(playlistsToMerge[1], {
			offset
		})

		offset+=100;

		tracks = response.body.items;
		tracks2.push(...tracks);
	}

	const ids1 = tracks1.map(track => track.track?.id);
	const ids2 = tracks2.map(track => track.track?.id);
	
	const songNames1 = tracks1.map(track => track.track?.name);
	const songNames2 = tracks2.map(track => track.track?.name);

	const similarities = ids1.filter(id1 => ids2.includes(id1));
	const similaritiesName = songNames1.filter(id1 => songNames2.includes(id1));

	console.log('similarities', similaritiesName);
	
	const newPlaylist = await spotifyApi.createPlaylist(playlistName, {
		collaborative: false,
		description: 'New Merged Playlist',
		public: true
	});

	console.log('New playlist: https://open.spotify.com/playlist/', newPlaylist.body.id);

	console.log('Total:', similarities.length);

	const totalReq = Math.ceil(similarities.length/100);
	console.log('TotalReq', totalReq);

	for (let i = 0; i < totalReq; i++) {
		await Sleep((i+1)*1000);
		const current = similarities.splice(0, 100);
		spotifyApi.addTracksToPlaylist(newPlaylist.body.id, current.map(cur => `spotify:track:${cur}`));
	}
}

main();