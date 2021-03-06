import {D3Sel} from "../etc/Util";
import * as d3 from "d3";

export function createStaticSkeleton(base: D3Sel) {

    // ---- TEMPLATE -----
    // language=HTML
    function template() {
        return `
            <!--        <div id="attention-vis">-->
            <div>
                <div id="model-selection">
                    <label for="model-options"
                           style="width:150px;margin-bottom: 5px;">Select
                        model</label><select id="model-option-selector"
                                             name="model-options">

                </select>
                </div>
            </div>
            <div id="sentence-input">
                <form>
                    <div class="form-group">
                        <label for="form-sentence-a"
                               style="width: 150px; display: inline-block;vertical-align: middle;">Input
                            Sentence</label>
                        <input id="form-sentence-a" type="text"
                               name="sent-a-input"
                               placeholder="Enter new sentence to analyze"
                               value="The girl ran to a local pub to escape the din of her city."
                               style="width: calc(100% - 240px); display: inline-block;vertical-align: middle;"
                        >
                        <button class="btn btn-primary" id="update-sentence"
                                type="button"
                                style="width:70px;display: inline-block;padding: 3px 3px;">
                            Update
                        </button>
                    </div>
                </form>
                <!--                <div class="padding"></div>-->

            </div>

            <div>
                <div style="display: inline-block; width:150px;"><b>Filters</b>
                </div>
                <div id="cls-toggle" style="display: inline-block;">
                    <!--                    <div class="input-description">-->
                    Hide Special Tokens
                    <!--                    </div>-->
                    <label class="switch" style="vertical-align: middle;">
                        <input type="checkbox" checked="checked">
                        <span class="short-slider round"></span>
                    </label>
                </div>
                <div style="margin-left: 25px;display: inline-block;">
                    Show top <span id="my-range-value">70</span>% of att:
                </div>

                <div class="slide-container"
                     style="display: inline-block;margin-left: 5px;width:calc(100% - 550px);">
                    <!--                    <label for="my-range">-->

                    <!--                    </label>-->
                    <input
                            type="range" min="0" max="100" value="70"
                            class="slider" id="my-range"
                            style="vertical-align: middle;display: inline-block;">
                </div>
            </div>

            <div id="layer-selection" style="margin-top: 10px;">
                <div class="input-description"
                     style="display: inline-block; width: 150px;vertical-align: top;">
                    Layer
                </div>
                <div class="layer-select btn-group btn-group-toggle"
                     data-toggle="buttons" id="layer-select"
                     style="vertical-align: top;">

                </div>
            </div>

            <div id="selected-head-display">
                <div class="input-description" style="display: inline-block; width: 150px;vertical-align: top;">
                    Selected heads:
                </div>
                <div id="selected-heads" style="display:inline-block;vertical-align: top;">

                </div>
            </div>

            <div id="connector-container">
                <div id="connector-controls">
                    <div class="left-control-half">


                        <!--                        <div id="layer-selection">-->
                        <!--                            <div class="input-description">-->
                        <!--                                Layer:-->
                        <!--                            </div>-->
                        <!--                            <div class="layer-select btn-group btn-group-toggle"-->
                        <!--                                 data-toggle="buttons" id="layer-select">-->

                        <!--                            </div>-->
                        <!--                        </div>-->

                    </div>
                    <div class="right-control-half head-control">
<!--                        <div id="selected-head-display">-->
<!--                            <div class="input-description">-->
<!--                                Selected heads:-->
<!--                            </div>-->
<!--                            <div id="selected-heads">-->

<!--                            </div>-->
<!--                        </div>-->
                        <div class="select-input" id="head-all-or-none">
                            <button id="select-all-heads">Select all heads
                            </button>
                            <button id="select-no-heads">Unselect all heads
                            </button>
                        </div>
                        <div id="usage-info">
                            <p>
                                You focus on one token by <b>click</b>.
                                You can mask any token by <b>double click</b>.
                            </p>
                            <p>
                                You can select and de-select a head by a
                                <b>click</b>
                                on the heatmap columns
                            </p>
                        </div>
                    </div>
                </div>
                <div id="atn-container" class="text-center">
                    <div id="head-info-box"
                         class="mat-hover-display text-center"
                         style="width: 70px; height: 30px; visibility: hidden; left: 929px; top: 670px; border-radius: 8px 8px 8px 1px;">
                    </div>
                    <svg id="left-att-heads" width="182" height="442"></svg>
                    <div id="left-tokens"></div>
                    <svg id="atn-display" height="442" width="200"></svg>
                    <div id="right-tokens"></div>
                    <svg id="right-att-heads" width="182" height="442"></svg>
                </div>
                <div id="vis-break"></div>
            </div>
            <!--        </div>-->
        `
    }

    base.html(template);

    // ---- TEMPLATE.end -----


    /**
     * Top level sections
     */
    const sentenceInput = base.select("#sentence-input");
    const connectorContainer = base.select('#connector-container');
    const atnControls = base.select('#connector-controls');
    const atnContainer = base.select('#atn-container');

    /**
     * Sentence Input
     */

    const sentenceA = base.select('#form-sentence-a');
    const formButton = base.select('#update-sentence');

    /**
     * Connector Controls
     */

    const modelSelector = base.select('#model-option-selector')
    const threshSlider = base.select('#my-range');
    const layerCheckboxes = base.select('#layer-select');
    const clsToggle = base.select('#cls-toggle');
    const selectedHeads = base.select('#selected-heads');
    const headSelectAll = base.select('#select-all-heads');
    const headSelectNone = base.select('#select-no-heads');

    /**
     * For main attention vis
     */

    const headInfoBox = base.select('#head-info-box');
    const headBoxLeft = base.select('#left-att-heads');
    const tokensLeft = base.select('#left-tokens');
    const atnDisplay = base.select('#atn-display');
    const tokensRight = base.select('#right-tokens');
    const headBoxRight = base.select('#right-att-heads');

    /**
     * Return an object that provides handles to the important parts here
     */

    return {
        body: d3.select('body'),
        atnContainer: atnContainer,
        atnDisplay: atnDisplay,
        atnHeads: {
            left: headBoxLeft,
            right: headBoxRight,
            headInfo: headInfoBox
        },
        form: {
            sentenceA: sentenceA,
            button: formButton
        },
        tokens: {
            left: tokensLeft,
            right: tokensRight
        },
        modelSelector: modelSelector,
        clsToggle: clsToggle,
        layerCheckboxes: layerCheckboxes,
        selectedHeads: selectedHeads,
        headSelectAll: headSelectAll,
        headSelectNone: headSelectNone,
        threshSlider: threshSlider,
    }
}
