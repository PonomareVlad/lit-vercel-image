import {css, isServer, LitElement} from "lit";
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

    get local() {
        return isServer ? process?.env?.VERCEL_URL : location?.host;
    }

    get url() {
        const {
            src,
            width,
            local,
            host = local,
            quality = 100,
            cdn = host
        } = this;
        if (
            local === "localhost" ||
            ![src, cdn, host, width, quality].every(Boolean)
        ) return src;
        const srcURL = new URL(src, `https://${host}/`);
        const cdnURL = new URL(`https://${cdn}/_vercel/image`);
        const url = srcURL.host === cdn ? srcURL.pathname : srcURL.href;
        cdnURL.searchParams.set("q", String(quality));
        cdnURL.searchParams.set("w", String(width));
        cdnURL.searchParams.set("url", url);
        return cdnURL.href;
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
