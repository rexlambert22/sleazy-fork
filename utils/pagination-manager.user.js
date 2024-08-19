// ==UserScript==
// @name         pagination-manager
// @namespace    http://tampermonkey.net/
// @version      1.1.6
// @license      MIT
// @description  infinite scroll
// @author       smartacephale
// @match        *://*/*
// @downloadURL https://update.greasyfork.org/scripts/494205/pagination-manager.user.js
// @updateURL https://update.greasyfork.org/scripts/494205/pagination-manager.meta.js
// ==/UserScript==
/* globals Observer fetchHtml */

class PaginationManager {
    /**
     * @param {Vue.reactive} state
     * @param {Vue.reactive} stateLocale
     * @param {Rules} rules - WEBSITE_RULES class which have to implement methods:
     * - URL_DATA { iteratable_url, offset },
     * - PAGINATION_LAST
     * @param {Function} handleHtmlCallback
     * @param {number} delay - milliseconds
     */
    constructor(state, stateLocale, rules, handleHtmlCallback, delay) {
        this.state = state;
        this.stateLocale = stateLocale;
        this.rules = rules;
        this.handleHtmlCallback = handleHtmlCallback;

        this.stateLocale.pagIndexLast = this.rules.PAGINATION_LAST;
        this.paginationGenerator = this.createNextPageGenerator();
        this.paginationObserver = Observer.observeWhile(
            this.rules.INTERSECTION_OBSERVABLE || this.rules.PAGINATION, this.generatorConsume, delay);
    }

    generatorConsume = async () => {
        if (!this.state.infiniteScrollEnabled) return;
        const { value: { url, offset } = {}, done } = await this.paginationGenerator.next();
        if (!done) {
            console.log(url);
            const nextPageHTML = await fetchHtml(url);
            const prevScrollPos = document.documentElement.scrollTop;
            this.handleHtmlCallback(nextPageHTML);
            this.stateLocale.pagIndexCur = offset;
            window.scrollTo(0, prevScrollPos);
        }
        return !done;
    }

    createNextPageGenerator() {
        const { offset, iteratable_url } = this.rules.URL_DATA();
        const { PAGINATION_LAST } = this.rules;
        this.stateLocale.pagIndexCur = offset;
        function* nextPageGenerator() {
            for (let c = offset + 1; c <= PAGINATION_LAST; c++) {
                const url = iteratable_url(c);
                yield { url, offset: c };
            }
        }
        return nextPageGenerator();
    }
}
