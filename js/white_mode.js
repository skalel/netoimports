function toggleClass(elementId, classA, classB) {
	const element = document.getElementById(elementId);
	element.className = element.className === classA ? classB : classA;
}

function toggleImageSource(imageId, srcA, srcB) {
	const image = document.getElementById(imageId);
	image.src = image.src.includes(srcA) ? srcB : srcA;
}

function toggleStyle(elementId, styleProperty, valueA, valueB) {
	const element = document.getElementById(elementId);
	element.style[styleProperty] = element.style[styleProperty] === valueA ? valueB : valueA;
}

function setWhiteMode() {
	toggleImageSource("mainlogo", "../img/logo_white.png", "../img/logo_blk.png");
	toggleImageSource("imgWhiteMode", "../img/light_mode.png", "../img/dark_mode.png");

	toggleStyle("bodycolor", "backgroundColor", "rgb(0, 0, 0)", "rgb(255, 255, 255)");
	toggleStyle("titleColor", "color", "rgb(255, 255, 255)", "rgb(0, 0, 0)");

	const elementsToToggle = [
			"valCompra",
			"valEntrada",
			"tableHead",
			"fin_deb",
			"fin_1x",
			"fin_2x",
			"fin_3x",
			"fin_4x",
			"fin_5x",
			"fin_6x",
			"fin_7x",
			"fin_8x",
			"fin_9x",
			"fin_10x",
			"fin_11x",
			"fin_12x"
	];

	elementsToToggle.forEach(id => toggleClass(id, "allWhite", "allBlack"));
}
