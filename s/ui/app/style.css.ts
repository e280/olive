
import {css} from "lit"
export default css`

:host {
	display: block;
	position: relative;
	overflow: hidden;
	--anim: 250ms;
}

nav { z-index: 2; }
.blanket { z-index: 1; }

nav {
	position: absolute;
	left: 0;
	width: 85%;
	user-select: none;

	will-change: transform;
	transform: translateX(0);
	transition: transform var(--anim) ease;

	> button {
		position: absolute;
		z-index: 1;
		left: 100%;
		top: 0;
		padding: 0.2em;
		color: inherit;
		svg {
			width: 3em;
			height: 3em;
		}
	}

	> .navplate {
		font-size: 1.5em;
		background: #0004;
		border-bottom-right-radius: 1em;
		overflow: hidden;

		header {
			display: flex;
			align-items: center;
			gap: 1em;
			padding: 1em;
			background: #fff4;

			img {
				width: 4em;
				max-width: 20%;
				height: auto;
			}

			small {
				position: relative;
				bottom: 0.2em;
				font-weight: normal;
				font-size: 0.5em;
				color: var(--special);
			}
		}

		.links {
			display: flex;
			flex-direction: column;
			align-items: start;
			gap: 1em;
			padding: 1em 20%;
		}
	}

	&:not([data-open]) {
		transform: translateX(-100%);
	}
}

main {
	padding-top: 4em;
	height: 100%;
}

.blanket {
	pointer-events: none;
	position: absolute;
	inset: 0;

	will-change: background, backdrop-filter;
	transition:
		background var(--anim) linear,
		backdrop-filter var(--anim) linear;


	&[data-active] {
		pointer-events: all;
		backdrop-filter: blur(1em);
		background: #0004;
	}
}

`

