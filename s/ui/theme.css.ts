
import {css} from "lit"
import {cssReset} from "@e280/sly"
export default css`

${cssReset}

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


