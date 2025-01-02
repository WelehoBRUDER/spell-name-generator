const generateButton = document.querySelector(".generate");
generateButton.addEventListener("click", () => {
	generateSpell();
});
const spellTitle = document.querySelector("h1");
const url = "https://fantasyname.lukewh.com";

async function createList(url) {
	const res = await fetch(url);
	const list = await res.text();
	return list.split("\n");
}

class Subjects {
	constructor() {
		this.adj = [];
		this.obj = [];

		this.init();
	}

	async init() {
		this.adj = await createList(
			"https://gist.githubusercontent.com/hugsy/8910dc78d208e40de42deb29e62df913/raw/eec99c5597a73f6a9240cab26965a8609fa0f6ea/english-adjectives.txt"
		);
		this.obj = await createList("https://raw.githubusercontent.com/hugsy/stuff/refs/heads/main/random-word/english-nouns.txt");
	}

	getAdj() {
		const random = Math.floor(Math.random() * this.adj.length);
		return this.adj[random];
	}

	getObj() {
		const random = Math.floor(Math.random() * this.obj.length);
		return this.obj[random];
	}
}

const subjects = new Subjects();

async function generateSpell() {
	let name = "";
	await fetch(url).then(async (response) => {
		const res = await response.text();
		name = res;
	});
	name += "'s";
	name += ` ${subjects.getAdj()} `;
	name += ` ${subjects.getObj()} `;
	spellTitle.textContent = name;
}
