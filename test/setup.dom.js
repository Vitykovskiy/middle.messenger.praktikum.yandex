import { JSDOM } from 'jsdom';

const { window } = new JSDOM('', { url: 'http://localhost' });

globalThis.window = window;
globalThis.FormData = window.FormData;
globalThis.document = window.document;
globalThis.XMLHttpRequest = window.XMLHttpRequest;
globalThis.HTMLElement = window.HTMLElement;
globalThis.HTMLInputElement = window.HTMLInputElement;
