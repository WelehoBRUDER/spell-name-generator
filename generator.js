const generateButton = document.querySelector(".generate");
generateButton.addEventListener("click", () => {
	generateSpell();
});
const descBtn = document.querySelector(".desc-btn");
const spellTitle = document.querySelector("h1");
const url = "https://fantasyname.lukewh.com";
const desc = document.querySelector(".desc");
let apiKey = getApiKey().then((r) => (apiKey = r));

async function getApiKey() {
	try {
		const key = await fetch("KEY.json");
		const res = await key.json();
		return res["API-KEY"];
	} catch {
		console.warn("No API key! You won't be able to use describe");
		descBtn.disabled = true;
	}
}

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

	init() {
		this.adj = createList(
			"https://gist.githubusercontent.com/hugsy/8910dc78d208e40de42deb29e62df913/raw/eec99c5597a73f6a9240cab26965a8609fa0f6ea/english-adjectives.txt"
		).then((res) => (this.adj = res));
		this.obj = createList("https://raw.githubusercontent.com/hugsy/stuff/refs/heads/main/random-word/english-nouns.txt").then(
			(res) => (this.obj = res)
		);
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
	desc.textContent = "";
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

async function createSpellDescription() {
	const data = {
		contents: [
			{
				parts: [
					{
						text: `Create a 5th edition DND spell description based on this title: "${spellTitle.textContent}"\nWrite the response in HTML format; do not show title of the spell;`,
					},
				],
			},
		],
	};
	const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(data),
	});

	const resData = await response.json();
	let message = resData.candidates[0].content.parts[0].text;
	message = message.split("```html")[1];
	desc.innerHTML = message;
}
