var countButtons = 0;
var buttonBombs = [];

const CONSTANTS = {
	MAX_TRS: 10,
	MAX_TDS: 10,
	MAX_BUTTONS: 10 * 10,
	MAX_BOMBS: 25,
	BUTTON_TEXT_UNKNOWN: '?',
	BUTTON_TEXT_BOMB: 'X',
	BUTTON_DATA_REF_BOMB: 'data-bomb',
	BUTTON_DATA_REF_BOMB_VALUE: 'true',
	BUTTON_CLASS_UNKNOWN: 'button inherited',
	BUTTON_CLASS_DISCOVERED: 'button green',
	BUTTON_CLASS_BOMB: 'button red'
}

window.onload = function () {
	startGame();
}

function startGame() {
	buildGame();
	setGame();
}

function buildGame() {
	getBody().appendChild(buildTable());
}

function getBody() {
	return document.getElementsByTagName('body')[0];
}

function buildTable() {
	var table = document.createElement('table');

	for (var i = 0; i < CONSTANTS.MAX_TRS ; i++) {
		table.appendChild(buildTr());
	}

	return table;
}

function buildTr() {
	var tr = document.createElement('tr');

	for (var i = 0; i < CONSTANTS.MAX_TDS; i++) {
		tr.appendChild(buildTd());
	}

	return tr;
}

function buildTd() {
	var td = document.createElement('td');

	td.appendChild(buildButton());

	return td;
}

function buildButton() {
	var button = document.createElement('button');

	button.textContent = CONSTANTS.BUTTON_TEXT_UNKNOWN;
	button.setAttribute('id', ++countButtons);
	button.setAttribute('class', CONSTANTS.BUTTON_CLASS_UNKNOWN);
	button.setAttribute('type', 'button');
	button.addEventListener('click', function() {
		if (isButtonBomb(this)) {
			gameOver();
		} else {
			setCountNeighborsBombs(this);
		}
	});

	return button;
}

function isButtonBomb(button) {
	return button.getAttribute(CONSTANTS.BUTTON_DATA_REF_BOMB) === CONSTANTS.BUTTON_DATA_REF_BOMB_VALUE;
}

function gameOver() {
	uncoverButtonBombs();
	displayGameOver();
}

function uncoverButtonBombs() {
	for (var i = 0; i < buttonBombs.length; i++) {
		buttonBombs[i].textContent = CONSTANTS.BUTTON_TEXT_BOMB;
		buttonBombs[i].setAttribute('class', CONSTANTS.BUTTON_CLASS_BOMB);
	}
}

function displayGameOver() {
	var node = getBody().childNodes[4];
	var p = document.createElement('p');
	
	p.textContent = "Game over... :-(";
	if (typeof(node) !== 'undefined' && node != null) {
		getBody().replaceChild(p, node);
	} else {
		getBody().appendChild(p);
	}
}

function setCountNeighborsBombs(button) {
	var neighbors = [];
	var count_neighbors_bombs = appendNeighbors(button, neighbors);

	button.textContent = count_neighbors_bombs;
	button.setAttribute('class', CONSTANTS.BUTTON_CLASS_DISCOVERED);
	button.setAttribute('disabled', 'disabled');

	if (count_neighbors_bombs === 0) {
		for (var i = 0; i < neighbors.length; i++) {
			setCountNeighborsBombs(neighbors[i]);
		}
	}
}

function appendNeighbors(button, array) {
	return appendBrothers(button, array) + appendAllCounsins(button, array);
}

function appendBrothers(button, array) {
	return appendBrother(button, array, true) + appendBrother(button, array, false);
}

function appendBrother(button, array, previous) {
	var sibling = previous ? button.parentNode.previousSibling : button.parentNode.nextSibling;

	if (typeof(sibling) !== 'undefinded' && sibling != null) {
		var brother = sibling.firstChild;

		if (brother.getAttribute('disabled') != 'disabled') {
			array.push(brother);
		}

		return isButtonBomb(brother) ? 1 : 0;
	}

	return 0;
}

function appendAllCounsins(button, array) {
	return appendCousins(button, array, true) + appendCousins(button, array, false);
}

function appendCousins(button, array, previous) {
	var cousinId = previous ? parseInt(button.getAttribute('id')) - CONSTANTS.MAX_TDS : parseInt(button.getAttribute('id')) + CONSTANTS.MAX_TDS;

	if (cousinId > 0 && cousinId <= countButtons) {
		var cousin = document.getElementById(cousinId);
		
		if (cousin.getAttribute('disabled') != 'disabled') {
			array.push(cousin);
		}

		return isButtonBomb(cousin) ? appendBrothers(cousin, array) + 1 : appendBrothers(cousin, array);
	}

	return 0;
}

function setGame() {
	setButtonsBombs();
}

function setButtonsBombs() {
	var id;
	var ids = [];
	var button;

	for (var i = 0; i < CONSTANTS.MAX_BOMBS; i++) {
		do {
			id = getRandomInt(0, CONSTANTS.MAX_BUTTONS) + 1;
		} while (arrayContainsInt(ids, id));

		button = document.getElementById(id);

		button.setAttribute(CONSTANTS.BUTTON_DATA_REF_BOMB, CONSTANTS.BUTTON_DATA_REF_BOMB_VALUE);
		buttonBombs.push(button);
		ids.push(id);
	}
}

function getRandomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);

	return Math.floor(Math.random() * (max - min)) + min;
}

function arrayContainsInt(array, value) {
	if (array != null && array.length > 0) {
		for (var i = 0; i < array.length; i++) {
			if (value === array[i]) {
				return true;
			}
		}
	}

	return false;
}