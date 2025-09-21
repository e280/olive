
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
		background: var(--plate);
		box-shadow: 0.3em 0.4em 1em #0006;
		border-bottom-right-radius: 1em;
		overflow: hidden;

		header {
			display: flex;
			align-items: center;
			gap: 1em;
			padding: 1em;
			background: #0004;

			img {
				width: 3em;
				max-width: 16%;
				height: auto;
				filter: drop-shadow(0.1em 0.1em 0.2em #0004);
			}

			h1 {
				font-size: 1em;
				strong {
					font-size: 1.5em;
					font-weight: bold;
				}
				small {
					position: relative;
					bottom: 0.2em;
					font-weight: normal;
					color: var(--special);
				}
			}
		}

		.links {
			display: flex;
			flex-direction: column;
			gap: 0.5em;

			a {
				color: var(--prime);
				font-weight: bold;
				font-size: 1.5em;
				border-left: 0.2em solid #fff2;
				padding: 0.3em 1em;
				background: #fff1;

				&:is(:hover, :focus-visible) {
					color: color-mix(in oklab, var(--prime), white 20%);
					border-left-color: #fff4;
					background: #fff2;
				}

				&[data-active] {
					color: white;
					border-left-color: color-mix(in oklab, var(--prime), white 50%);
					background: #fff3;
				}
			}
		}
	}

	&:not([data-open]) {
		transform: translateX(-100%);
		.navplate { box-shadow: none; }
	}
}

main {
	padding-top: 4em;
	height: 100%;
	overflow-y: auto;
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
		background: color-mix(
			in oklab,
			color-mix(in oklab, var(--plate), var(--bg) 80%),
			transparent 10%
		);
	}
}

`

