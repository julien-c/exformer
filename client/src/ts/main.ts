import { MainGraphic } from './vis/attentionVis'

import "!file-loader?name=exBERT.html!../exBERT.html";
import "!file-loader?name=index.html!../index.html";
import "../css/main.scss"

window.onload = () => {
    const base = document.getElementById('attention-vis')
    //@ts-ignore
    const mainVis = new MainGraphic(base)
    console.log("Done loading window");
}
