const burger = $('#burger_menu');
const nav = $('#nav_menu');

if (nav && burger) {
	let enabled = true;

	burger.on('click', () => {
		if (enabled) {
			nav.animate({ top: '10vh' }, 600);
			enabled = false;
		} else {
			nav.animate({ top: '-100%' }, 600);
			enabled = true;
		}
	});
}
