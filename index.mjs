import {css, LitElement} from "lit";
import {VercelImageGenerator} from "./generator.mjs";
import {html, unsafeStatic} from "lit/static-html.js";
import {ifDefined} from "lit/directives/if-defined.js";

export class LitVercelImage extends LitElement {

    static styles = css`:host, slot {
      display: contents
    }`

    static properties = {
        src: {type: String},
        alt: {type: String},
        width: {type: Number},
        light: {type: Boolean},
        quality: {type: Number},
        cdn: {type: String, reflect: true},
        host: {type: String, reflect: true},
    }

    constructor() {
        super();
        this.cdn = this.host = this.local;
    }

    get url() {
        return this.generator.generate(this);
    }

    connectedCallback() {
        super.connectedCallback();
        this.generator = new VercelImageGenerator(this);
    }

    static define(tag = "lit-vercel-image") {
        customElements.define(tag, this);
    }

    renderLight() {
        return html`<img
                part="image"
                alt=${ifDefined(this.alt)}
                src="${unsafeStatic(this.url)}"
        />`
    }

    render() {
        return html`
            <slot>${this.renderLight()}</slot>`
    }

}
