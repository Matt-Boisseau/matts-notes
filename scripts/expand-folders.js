function expandFolders() {

	var folders = document.querySelectorAll('nav li');

	for (var i = 0; i < folders.length; i++) {
	
		// check if this 'nav li' is actually a folder
		folder = folders[i];
		if (folder.lastElementChild.className == 'ulist') {
	
			// add click event to expand/collapse this folder
			folder.firstElementChild.addEventListener('click', function() {
				this.parentElement.classList.toggle('collapsed');
				this.parentElement.classList.toggle('expanded');
			});
	
			// check if the current doc is in this folder
			var containsOpenDoc = false;
			folder.querySelectorAll('a').forEach(o => {
				if (o.getAttribute('href').includes('"' + window.location.pathname + '')) { // quotes block false positives
					containsOpenDoc = true;
				}
			});
	
			// if the current doc is in this folder, it should start expanded, instead of collapsed
			if (containsOpenDoc) {
				folder.classList.toggle('expanded');
			}
			else {
				folder.classList.toggle('collapsed');
			}
		}
	};
}
