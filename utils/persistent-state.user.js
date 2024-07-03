// ==UserScript==
// @name         persistent-state
// @description  simple state manager based on Vue3.reactive and localStorage
// @namespace    http://tampermonkey.net/
// @author       smartacephale
// @license      MIT
// @version      1.3
// @match        *://*/*
// @downloadURL https://update.greasyfork.org/scripts/494207/persistent-state.user.js
// @updateURL https://update.greasyfork.org/scripts/494207/persistent-state.meta.js
// ==/UserScript==
/* globals reactive watch parseIntegerOr */

class PersistentState {
    constructor(state, key = "state_acephale") {
        this.key = key;
        this.state = reactive(state);
        this.sync();
        this.watchPersistence();
    }

    sync() {
        this.trySetFromLocalStorage();
        window.addEventListener('focus', this.trySetFromLocalStorage);
    }

    watchPersistence() {
        watch(this.state, (value) => {
            this.saveToLocalStorage(this.key, value);
        });
    }

    saveToLocalStorage(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    }

    trySetFromLocalStorage = () => {
        const localStorageValue = localStorage.getItem(this.key);
        if (localStorageValue !== null) {
            const prevState = JSON.parse(localStorageValue);
            for (const prop of Object.keys(prevState)) {
                this.state[prop] = prevState[prop];
            }
        }
    }
}


class DefaultState {
    DEFAULT_STATE = {
        filterExcludeWords: "",
        filterExclude: false,
        filterIncludeWords: "",
        filterInclude: false,
        infiniteScrollEnabled: true,
        uiEnabled: true,
    };

    OPTIONAL_FILTERS = {
        DURATION_FILTER: {
            filterDurationFrom: 0,
            filterDurationTo: 600,
            filterDuration: false
        },
        PRIVACY_FILTER: {
            filterPrivate: false,
            filterPublic: false
        }
    }

    DEFAULT_OPTIONS = {
        PRIVACY_FILTER: false,
        DURATION_FILTER: true
    }

    constructor(options = this.DEFAULT_OPTIONS, custom = {}) {
        const opted = Object.assign(this.DEFAULT_OPTIONS, options);
        Object.keys(opted).forEach(key => {
            if (opted[key]) {
                Object.assign(this.DEFAULT_STATE, this.OPTIONAL_FILTERS[key]);
            }
        });

        Object.assign(this.DEFAULT_STATE, { custom });
        const { state } = new PersistentState(this.DEFAULT_STATE);

        this.state = state;

        this.stateLocale = reactive({
            pagIndexLast: 1,
            pagIndexCur: 1,
            filterOptions: opted
        });
    }

    setWatchers(applyFilter) {
        const { state, stateLocale } = this;

        if (stateLocale.filterOptions.PRIVACY_FILTER) {
            watch(() => state.filterPrivate, () => applyFilter({ filterPrivate: true }));
            watch(() => state.filterPublic, () => applyFilter({ filterPublic: true }));
        }

        if (stateLocale.filterOptions.DURATION_FILTER) {
            watch([() => state.filterDurationFrom, () => state.filterDurationTo], (a, b) => {
                state.filterDurationFrom = parseIntegerOr(a[0], b[0]);
                state.filterDurationTo = parseIntegerOr(a[1], b[1]);
                if (state.filterDuration) applyFilter({ filterDuration: true });
            });
            watch(() => state.filterDuration, () => applyFilter({ filterDuration: true }));
        }

        watch(() => state.filterExclude, () => applyFilter({ filterExclude: true }));
        watch(() => state.filterExcludeWords, () => {
            if (state.filterExclude) applyFilter({ filterExclude: true });
        }, { deep: true });

        watch(() => state.filterInclude, () => applyFilter({ filterInclude: true }));
        watch(() => state.filterIncludeWords, () => {
            if (state.filterInclude) applyFilter({ filterInclude: true });
        }, { deep: true });
    }
}
