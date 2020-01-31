// set up AsciiDoctorJS
const asciidoctor = Asciidoctor();
const convertOptions = {
	safe: 'safe', // allows `include::` syntax in `asciidoctor.convert()`
	'attributes': {
		'showtitle': true, // enables h1 from converted docs
		'icons': 'font' // enables icon font (TODO: not currently working)
	}
};

// sections to load on the initial onload
//NOTE: adocPath is relative to the adoc root, not the site root
const sections = [

	// main section (loaded based on URL)
	{
		tagName: 'main',
		adocPath: window.location.pathname
	},

	// sidebar sections
	{
		tagName: 'header',
		adocPath: 'header'
	},
	{
		tagName: 'nav',
		adocPath: 'nav'
	},
	{
		tagName: 'footer',
		adocPath: 'footer'
	}
]

// look for an adoc at adocPath, convert it to HTML, and insert it into tagName
function loadAdocToElement(tagName, adocPath, setState = false) {

	// catch "404s" and redirect to home
	//TODO: catch all URLs with no adoc content
	if (adocPath == '/404.html') {
		adocPath = '/home';
		setState = true;
	}

	// set context to root, so file paths will be correct
	var url = window.location.pathname;
	if (setState) {
		url = adocPath;
	}
	window.history.pushState('root', '', '/');

	// select tag by tagName and fill with converted adoc content found at adocPath
	var element = document.querySelector(tagName);
	var html = asciidoctor.convert('include::adocs/' + adocPath + '.adoc[]', convertOptions);
	element.innerHTML = html;

	// update the state to match window.location, so reloading and bookmarking work
	window.history.pushState(url, url, url);
}

// wait for onload before doing anything related to the body
window.onload = function() {

	// load all sections
	sections.forEach(o => {
		loadAdocToElement(o.tagName, o.adocPath);
	});
	
	// optimize internal links by loading just the main section (instead of the whole page)
	document.querySelectorAll('a').forEach(o => {

		// check if it's an internal link (it will begin with '/')
		var linkPath = o.getAttribute('href');
		if (linkPath.substring(0, 1) == '/') {

			// overwrite the link with a call to loadAdocToElement
			o.setAttribute('href', 'javascript:loadAdocToElement("main", "' + linkPath + '", true);');
		}
	});

	//TODO: move this out of adoc-renderer.js
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
				if (o.getAttribute('href').includes(window.location.pathname)) {
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
