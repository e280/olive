
import {css} from "lit"
import {cssReset} from "@e280/sly"
export default css`

${cssReset}

* {
	padding: 0;
	margin: 0;
	box-sizing: border-box;
}

::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: #333; border-radius: 1em; }
::-webkit-scrollbar-thumb:hover { background: #444; }
* {
	scrollbar-width: thin;
	scrollbar-color: #333 transparent;
}

a {
	color: var(--link);
	text-decoration: none;

	&:visited {
		color: color-mix(in srgb, var(--link), purple 30%);
	}

	&:is(:hover, :focus-visible) {
		color: color-mix(in srgb, var(--link), white 10%);
		text-decoration: underline;
	}

	&:active {
		color: color-mix(in srgb, var(--link), white 50%);
	}
}

button[theme="icon"] {
	background: transparent;
	border: none;
	color: inherit;

	cursor: pointer;
	opacity: 0.5;

	&:is(:hover, :focus-visible) {
		opacity: 1;
	}
}

`

