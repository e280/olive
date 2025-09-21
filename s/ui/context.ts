
export class Context {
	readonly version = document.head
		.querySelector(`meta[content="app-version"]`)!
		.getAttribute("value")!
}

