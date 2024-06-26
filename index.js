const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const puppeteer = require('puppeteer');
const fs = require('fs');
const app = express();
const path = require('path');
const port = 5000;
app.use(bodyParser.json());

// Middleware for parsing URL-encoded data
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware for handling CORS
app.use(cors());

// Start the Express server
app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});


async function convertHtmlToPdf(html) {
  // Launch a new browser instance
  const browser = await puppeteer.launch();

  // Create a new page
  const page = await browser.newPage();

  // Set the HTML content on the page
  await page.setContent(html, { waitUntil: 'networkidle0' });

  // Wait for the page to load
  await page.waitForSelector('body');

  // Generate the PDF
  const pdfBuffer = await page.pdf({
    format: 'A4',
    printBackground: true,
  });

  // Close the browser instance
  await browser.close();

  return pdfBuffer;
}


// Example HTML code
function getHtmlCode(body) {
  return `
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
  <style>

    @import 'https://fonts.googleapis.com/css?family=Reenie+Beanie';

    body {
      margin: 0;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, '.SFNSText-Regular',
        sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      background: #fff;
      padding: 0 20px;
    }

    header {
      max-width: 580px;
      margin: auto;
      position: relative;
      display: flex;
      justify-content: center;
    }
    .ContentEditable__root {
      border: 0;
      font-size: 15px;
      display: block;
      position: relative;
      outline: 0;
      padding:20px;
    }
    header a {
      max-width: 220px;
      margin: 20px 0 0 0;
      display: block;
    }

    header img {
      display: block;
      height: 100%;
      width: 100%;
    }

    header h1 {
      text-align: left;
      color: #333;
      display: inline-block;
      margin: 20px 0 0 0;
    }

    .editor-shell {
      margin: 20px auto;
      border-radius: 2px;
      max-width: 1100px;
      color: #000;
      position: relative;
      line-height: 1.7;
      font-weight: 400;
    }

    .editor-container {
      width: 21cm;
      /* Width of A4 paper in centimeters */
      height: 29.7cm;
      overflow: hidden;
      border: 1px solid #ccc;
      background: #fff;
      position: relative;
    }

    .editor-shell .editor-container {
      background: #fff;
      position: relative;
      display: block;
      border-bottom-left-radius: 10px;
      border-bottom-right-radius: 10px;
    }

    .editor-shell .editor-container.tree-view {
      border-radius: 0;
    }

    .editor-shell .editor-container.plain-text {
      border-top-left-radius: 10px;
      border-top-right-radius: 10px;
    }

    .editor-scroller {
      min-height: 150px;
      border: 0;
      display: flex;
      position: relative;
      outline: 0;
      z-index: 0;
      overflow: auto;
      resize: vertical;
    }

    .editor {
      flex: auto;
      position: relative;
      resize: vertical;
      z-index: -1;
    }

    .test-recorder-output {
      margin: 20px auto 20px auto;
      width: 100%;
    }

    pre {
      line-height: 1.1;
      background: #222;
      color: #fff;
      margin: 0;
      padding: 10px;
      font-size: 12px;
      overflow: auto;
      max-height: 400px;
    }

    .tree-view-output {
      display: block;
      background: #222;
      color: #fff;
      padding: 0;
      font-size: 12px;
      margin: 1px auto 10px auto;
      position: relative;
      overflow: hidden;
      border-bottom-left-radius: 10px;
      border-bottom-right-radius: 10px;
    }

    pre::-webkit-scrollbar {
      background: transparent;
      width: 10px;
    }

    pre::-webkit-scrollbar-thumb {
      background: #999;
    }

    .editor-dev-button {
      position: relative;
      display: block;
      width: 40px;
      height: 40px;
      font-size: 12px;
      border-radius: 20px;
      border: none;
      cursor: pointer;
      outline: none;
      box-shadow: 0px 1px 10px rgba(0, 0, 0, 0.3);
      background-color: #444;
    }

    .editor-dev-button::after {
      content: '';
      position: absolute;
      top: 10px;
      right: 10px;
      bottom: 10px;
      left: 10px;
      display: block;
      background-size: contain;
      filter: invert(1);
    }

    .editor-dev-button:hover {
      background-color: #555;
    }

    .editor-dev-button.active {
      background-color: rgb(233, 35, 35);
    }

    .test-recorder-toolbar {
      display: flex;
    }

    .test-recorder-button {
      position: relative;
      display: block;
      width: 32px;
      height: 32px;
      font-size: 10px;
      padding: 6px 6px;
      border-radius: 4px;
      border: none;
      cursor: pointer;
      outline: none;
      box-shadow: 1px 2px 2px rgba(0, 0, 0, 0.4);
      background-color: #222;
      transition: box-shadow 50ms ease-out;
    }

    .test-recorder-button:active {
      box-shadow: 1px 2px 4px rgba(0, 0, 0, 0.4);
    }

    .test-recorder-button+.test-recorder-button {
      margin-left: 4px;
    }

    .test-recorder-button::after {
      content: '';
      position: absolute;
      top: 8px;
      right: 8px;
      bottom: 8px;
      left: 8px;
      display: block;
      background-size: contain;
      filter: invert(1);
    }

    #options-button {
      position: fixed;
      left: 20px;
      bottom: 20px;
    }

    #test-recorder-button {
      position: fixed;
      left: 70px;
      bottom: 20px;
    }

    #paste-log-button {
      position: fixed;
      left: 120px;
      bottom: 20px;
    }

    #docs-button {
      position: fixed;
      left: 170px;
      bottom: 20px;
    }

    #options-button::after {
      background-image: url(images/icons/gear.svg);
    }

    #test-recorder-button::after {
      background-image: url(images/icons/journal-code.svg);
    }

    #paste-log-button::after {
      background-image: url(images/icons/clipboard.svg);
    }

    #docs-button::after {
      background-image: url(images/icons/file-earmark-text.svg);
    }

    #test-recorder-button-snapshot {
      margin-right: auto;
    }

    #test-recorder-button-snapshot::after {
      background-image: url(images/icons/camera.svg);
    }

    #test-recorder-button-copy::after {
      background-image: url(images/icons/clipboard.svg);
    }

    #test-recorder-button-download::after {
      background-image: url(images/icons/download.svg);
    }

    .typeahead-popover {
      background: #fff;
      box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.3);
      border-radius: 8px;
      position: fixed;
    }

    .typeahead-popover ul {
      padding: 0;
      list-style: none;
      margin: 0;
      border-radius: 8px;
      max-height: 200px;
      overflow-y: scroll;
    }

    .typeahead-popover ul::-webkit-scrollbar {
      display: none;
    }

    .typeahead-popover ul {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }

    .typeahead-popover ul li {
      margin: 0;
      min-width: 180px;
      font-size: 14px;
      outline: none;
      cursor: pointer;
      border-radius: 8px;
    }

    .typeahead-popover ul li.selected {
      background: #eee;
    }

    .typeahead-popover li {
      margin: 0 8px 0 8px;
      padding: 8px;
      color: #050505;
      cursor: pointer;
      line-height: 16px;
      font-size: 15px;
      display: flex;
      align-content: center;
      flex-direction: row;
      flex-shrink: 0;
      background-color: #fff;
      border-radius: 8px;
      border: 0;
    }

    .typeahead-popover li.active {
      display: flex;
      width: 20px;
      height: 20px;
      background-size: contain;
    }

    .typeahead-popover li:first-child {
      border-radius: 8px 8px 0px 0px;
    }

    .typeahead-popover li:last-child {
      border-radius: 0px 0px 8px 8px;
    }

    .typeahead-popover li:hover {
      background-color: #eee;
    }

    .typeahead-popover li .text {
      display: flex;
      line-height: 20px;
      flex-grow: 1;
      min-width: 150px;
    }

    .typeahead-popover li .icon {
      display: flex;
      width: 20px;
      height: 20px;
      user-select: none;
      margin-right: 8px;
      line-height: 16px;
      background-size: contain;
      background-repeat: no-repeat;
      background-position: center;
    }

    .component-picker-menu {
      width: 200px;
    }

    .mentions-menu {
      width: 250px;
    }

    .auto-embed-menu {
      width: 150px;
    }

    .emoji-menu {
      width: 200px;
    }

    i.palette {
      background-image: url(images/icons/palette.svg);
    }

    i.bucket {
      background-image: url(images/icons/paint-bucket.svg);
    }

    i.bold {
      background-image: url(images/icons/type-bold.svg);
    }

    i.italic {
      background-image: url(images/icons/type-italic.svg);
    }

    i.clear {
      background-image: url(images/icons/trash.svg);
    }

    i.code {
      background-image: url(images/icons/code.svg);
    }

    i.underline {
      background-image: url(images/icons/type-underline.svg);
    }

    i.strikethrough {
      background-image: url(images/icons/type-strikethrough.svg);
    }

    i.subscript {
      background-image: url(images/icons/type-subscript.svg);
    }

    i.superscript {
      background-image: url(images/icons/type-superscript.svg);
    }

    i.link {
      background-image: url(images/icons/link.svg);
    }

    i.horizontal-rule {
      background-image: url(images/icons/horizontal-rule.svg);
    }

    .icon.plus {
      background-image: url(images/icons/plus.svg);
    }

    .icon.caret-right {
      background-image: url(images/icons/caret-right-fill.svg);
    }

    .icon.dropdown-more {
      background-image: url(images/icons/dropdown-more.svg);
    }

    .icon.font-color {
      background-image: url(images/icons/font-color.svg);
    }

    .icon.font-family {
      background-image: url(images/icons/font-family.svg);
    }

    .icon.bg-color {
      background-image: url(images/icons/bg-color.svg);
    }

    .icon.table {
      background-color: #6c757d;
      mask-image: url(images/icons/table.svg);
      -webkit-mask-image: url(images/icons/table.svg);
      mask-repeat: no-repeat;
      -webkit-mask-repeat: no-repeat;
      mask-size: contain;
      -webkit-mask-size: contain;
    }

    i.image {
      background-image: url(images/icons/file-image.svg);
    }

    i.table {
      background-image: url(images/icons/table.svg);
    }

    i.close {
      background-image: url(images/icons/close.svg);
    }

    i.figma {
      background-image: url(images/icons/figma.svg);
    }

    i.poll {
      background-image: url(images/icons/card-checklist.svg);
    }

    i.columns {
      background-image: url(images/icons/3-columns.svg);
    }

    i.tweet {
      background-image: url(images/icons/tweet.svg);
    }

    i.youtube {
      background-image: url(images/icons/youtube.svg);
    }

    .icon.left-align,
    i.left-align {
      background-image: url(images/icons/text-left.svg);
    }

    .icon.center-align,
    i.center-align {
      background-image: url(images/icons/text-center.svg);
    }

    .icon.right-align,
    i.right-align {
      background-image: url(images/icons/text-right.svg);
    }

    .icon.justify-align,
    i.justify-align {
      background-image: url(images/icons/justify.svg);
    }

    i.indent {
      background-image: url(images/icons/indent.svg);
    }

    i.markdown {
      background-image: url(images/icons/markdown.svg);
    }

    i.outdent {
      background-image: url(images/icons/outdent.svg);
    }

    i.undo {
      background-image: url(images/icons/arrow-counterclockwise.svg);
    }

    i.redo {
      background-image: url(images/icons/arrow-clockwise.svg);
    }

    i.sticky {
      background-image: url(images/icons/sticky.svg);
    }

    i.mic {
      background-image: url(images/icons/mic.svg);
    }

    i.import {
      background-image: url(images/icons/upload.svg);
    }

    i.export {
      background-image: url(images/icons/download.svg);
    }

    i.diagram-2 {
      background-image: url(images/icons/diagram-2.svg);
    }

    i.user {
      background-image: url(images/icons/user.svg);
    }

    i.equation {
      background-image: url(images/icons/plus-slash-minus.svg);
    }

    i.gif {
      background-image: url(images/icons/filetype-gif.svg);
    }

    i.copy {
      background-image: url(images/icons/copy.svg);
    }

    i.success {
      background-image: url(images/icons/success.svg);
    }

    i.prettier {
      background-image: url(images/icons/prettier.svg);
    }

    i.prettier-error {
      background-image: url(images/icons/prettier-error.svg);
    }

    i.page-break,
    .icon.page-break {
      background-image: url(images/icons/scissors.svg);
    }

    .link-editor .button.active,
    .toolbar .button.active {
      background-color: rgb(223, 232, 250);
    }

    .link-editor .link-input {
      display: block;
      width: calc(100% - 75px);
      box-sizing: border-box;
      margin: 12px 12px;
      padding: 8px 12px;
      border-radius: 15px;
      background-color: #eee;
      font-size: 15px;
      color: rgb(5, 5, 5);
      border: 0;
      outline: 0;
      position: relative;
      font-family: inherit;
    }

    .link-editor .link-view {
      display: block;
      width: calc(100% - 24px);
      margin: 8px 12px;
      padding: 8px 12px;
      border-radius: 15px;
      font-size: 15px;
      color: rgb(5, 5, 5);
      border: 0;
      outline: 0;
      position: relative;
      font-family: inherit;
    }

    .link-editor .link-view a {
      display: block;
      word-break: break-word;
      width: calc(100% - 33px);
    }

    .link-editor div.link-edit {
      background-image: url(images/icons/pencil-fill.svg);
      background-size: 16px;
      background-position: center;
      background-repeat: no-repeat;
      width: 35px;
      vertical-align: -0.25em;
      position: absolute;
      right: 30px;
      top: 0;
      bottom: 0;
      cursor: pointer;
    }

    .link-editor div.link-trash {
      background-image: url(images/icons/trash.svg);
      background-size: 16px;
      background-position: center;
      background-repeat: no-repeat;
      width: 35px;
      vertical-align: -0.25em;
      position: absolute;
      right: 0;
      top: 0;
      bottom: 0;
      cursor: pointer;
    }

    .link-editor div.link-cancel {
      background-image: url(images/icons/close.svg);
      background-size: 16px;
      background-position: center;
      background-repeat: no-repeat;
      width: 35px;
      vertical-align: -0.25em;
      margin-right: 28px;
      position: absolute;
      right: 0;
      top: 0;
      bottom: 0;
      cursor: pointer;
    }

    .link-editor div.link-confirm {
      background-image: url(images/icons/success-alt.svg);
      background-size: 16px;
      background-position: center;
      background-repeat: no-repeat;
      width: 35px;
      vertical-align: -0.25em;
      margin-right: 2px;
      position: absolute;
      right: 0;
      top: 0;
      bottom: 0;
      cursor: pointer;
    }

    .link-editor .link-input a {
      color: rgb(33, 111, 219);
      text-decoration: underline;
      white-space: nowrap;
      overflow: hidden;
      margin-right: 30px;
      text-overflow: ellipsis;
    }

    .link-editor .link-input a:hover {
      text-decoration: underline;
    }

    .link-editor .font-size-wrapper,
    .link-editor .font-family-wrapper {
      display: flex;
      margin: 0 4px;
    }

    .link-editor select {
      padding: 6px;
      border: none;
      background-color: rgba(0, 0, 0, 0.075);
      border-radius: 4px;
    }

    .mention:focus {
      box-shadow: rgb(180 213 255) 0px 0px 0px 2px;
      outline: none;
    }

    .characters-limit {
      color: #888;
      font-size: 12px;
      text-align: right;
      display: block;
      position: absolute;
      left: 12px;
      bottom: 5px;
    }

    .characters-limit.characters-limit-exceeded {
      color: red;
    }

    .dropdown {
      z-index: 100;
      display: block;
      position: fixed;
      box-shadow: 0 12px 28px 0 rgba(0, 0, 0, 0.2), 0 2px 4px 0 rgba(0, 0, 0, 0.1),
        inset 0 0 0 1px rgba(255, 255, 255, 0.5);
      border-radius: 8px;
      min-height: 40px;
      background-color: #fff;
    }

    .dropdown .item {
      margin: 0 8px 0 8px;
      padding: 8px;
      color: #050505;
      cursor: pointer;
      line-height: 16px;
      font-size: 15px;
      display: flex;
      align-content: center;
      flex-direction: row;
      flex-shrink: 0;
      justify-content: space-between;
      background-color: #fff;
      border-radius: 8px;
      border: 0;
      max-width: 250px;
      min-width: 100px;
    }

    .dropdown .item.fontsize-item,
    .dropdown .item.fontsize-item .text {
      min-width: unset;
    }

    .dropdown .item .active {
      display: flex;
      width: 20px;
      height: 20px;
      background-size: contain;
    }

    .dropdown .item:first-child {
      margin-top: 8px;
    }

    .dropdown .item:last-child {
      margin-bottom: 8px;
    }

    .dropdown .item:hover {
      background-color: #eee;
    }

    .dropdown .item .text {
      display: flex;
      line-height: 20px;
      flex-grow: 1;
      min-width: 150px;
    }

    .dropdown .item .icon {
      display: flex;
      width: 20px;
      height: 20px;
      user-select: none;
      margin-right: 12px;
      line-height: 16px;
      background-size: contain;
      background-position: center;
      background-repeat: no-repeat;
    }

    .dropdown .divider {
      width: auto;
      background-color: #eee;
      margin: 4px 8px;
      height: 1px;
    }

    @media screen and (max-width: 1100px) {
      .dropdown-button-text {
        display: none !important;
      }

      .dialog-dropdown>.dropdown-button-text {
        display: flex !important;
      }

      .font-size .dropdown-button-text {
        display: flex !important;
      }

      .code-language .dropdown-button-text {
        display: flex !important;
      }
    }

    .icon.paragraph {
      background-image: url(images/icons/text-paragraph.svg);
    }

    .icon.h1 {
      background-image: url(images/icons/type-h1.svg);
    }

    .icon.h2 {
      background-image: url(images/icons/type-h2.svg);
    }

    .icon.h3 {
      background-image: url(images/icons/type-h3.svg);
    }

    .icon.h4 {
      background-image: url(images/icons/type-h4.svg);
    }

    .icon.h5 {
      background-image: url(images/icons/type-h5.svg);
    }

    .icon.h6 {
      background-image: url(images/icons/type-h6.svg);
    }

    .icon.bullet-list,
    .icon.bullet {
      background-image: url(images/icons/list-ul.svg);
    }

    .icon.check-list,
    .icon.check {
      background-image: url(images/icons/square-check.svg);
    }

    .icon.numbered-list,
    .icon.number {
      background-image: url(images/icons/list-ol.svg);
    }

    .icon.quote {
      background-image: url(images/icons/chat-square-quote.svg);
    }

    .icon.code {
      background-image: url(images/icons/code.svg);
    }

    .switches {
      z-index: 6;
      position: fixed;
      left: 10px;
      bottom: 70px;
      animation: slide-in 0.4s ease;
    }

    @keyframes slide-in {
      0% {
        opacity: 0;
        transform: translateX(-200px);
      }

      100% {
        opacity: 1;
        transform: translateX(0);
      }
    }

    .switch {
      display: block;
      color: #444;
      margin: 5px 0;
      background-color: rgba(238, 238, 238, 0.7);
      padding: 5px 10px;
      border-radius: 10px;
    }

    #rich-text-switch {
      right: 0;
    }

    #character-count-switch {
      right: 130px;
    }

    .switch label {
      margin-right: 5px;
      line-height: 24px;
      width: 100px;
      font-size: 14px;
      display: inline-block;
      vertical-align: middle;
    }

    .switch button {
      background-color: rgb(206, 208, 212);
      height: 24px;
      box-sizing: border-box;
      border-radius: 12px;
      width: 44px;
      display: inline-block;
      vertical-align: middle;
      position: relative;
      outline: none;
      cursor: pointer;
      transition: background-color 0.1s;
      border: 2px solid transparent;
    }

    .switch button:focus-visible {
      border-color: blue;
    }

    .switch button span {
      top: 0px;
      left: 0px;
      display: block;
      position: absolute;
      width: 20px;
      height: 20px;
      border-radius: 12px;
      background-color: white;
      transition: transform 0.2s;
    }

    .switch button[aria-checked='true'] {
      background-color: rgb(24, 119, 242);
    }

    .switch button[aria-checked='true'] span {
      transform: translateX(20px);
    }

    .editor-shell span.editor-image {
      cursor: default;
      display: inline-block;
      position: relative;
      user-select: none;
    }

    .editor-shell .editor-image img {
      max-width: 100%;
      cursor: default;
    }

    .editor-shell .editor-image img.focused {
      outline: 2px solid rgb(60, 132, 244);
      user-select: none;
    }

    .editor-shell .editor-image img.focused.draggable {
      cursor: grab;
    }

    .editor-shell .editor-image img.focused.draggable:active {
      cursor: grabbing;
    }

    .editor-shell .editor-image .image-caption-container .tree-view-output {
      margin: 0;
      border-radius: 0;
    }

    .editor-shell .editor-image .image-caption-container {
      display: block;
      position: absolute;
      bottom: 4px;
      left: 0;
      right: 0;
      padding: 0;
      margin: 0;
      border-top: 1px solid #fff;
      background-color: rgba(255, 255, 255, 0.9);
      min-width: 100px;
      color: #000;
      overflow: hidden;
    }

    .editor-shell .editor-image .image-caption-button {
      display: block;
      position: absolute;
      bottom: 20px;
      left: 0;
      right: 0;
      width: 30%;
      padding: 10px;
      margin: 0 auto;
      border: 1px solid rgba(255, 255, 255, 0.3);
      border-radius: 5px;
      background-color: rgba(0, 0, 0, 0.5);
      min-width: 100px;
      color: #fff;
      cursor: pointer;
      user-select: none;
    }

    .editor-shell .editor-image .image-caption-button:hover {
      background-color: rgba(60, 132, 244, 0.5);
    }

    .editor-shell .editor-image .image-edit-button {
      border: 1px solid rgba(0, 0, 0, 0.3);
      border-radius: 5px;
      background-image: url(/src/images/icons/pencil-fill.svg);
      background-size: 16px;
      background-position: center;
      background-repeat: no-repeat;
      width: 35px;
      height: 35px;
      vertical-align: -0.25em;
      position: absolute;
      right: 4px;
      top: 4px;
      cursor: pointer;
      user-select: none;
    }

    .editor-shell .editor-image .image-edit-button:hover {
      background-color: rgba(60, 132, 244, 0.1);
    }

    .editor-shell .editor-image .image-resizer {
      display: block;
      width: 7px;
      height: 7px;
      position: absolute;
      background-color: rgb(60, 132, 244);
      border: 1px solid #fff;
    }

    .editor-shell .editor-image .image-resizer.image-resizer-n {
      top: -6px;
      left: 48%;
      cursor: n-resize;
    }

    .editor-shell .editor-image .image-resizer.image-resizer-ne {
      top: -6px;
      right: -6px;
      cursor: ne-resize;
    }

    .editor-shell .editor-image .image-resizer.image-resizer-e {
      bottom: 48%;
      right: -6px;
      cursor: e-resize;
    }

    .editor-shell .editor-image .image-resizer.image-resizer-se {
      bottom: -2px;
      right: -6px;
      cursor: nwse-resize;
    }

    .editor-shell .editor-image .image-resizer.image-resizer-s {
      bottom: -2px;
      left: 48%;
      cursor: s-resize;
    }

    .editor-shell .editor-image .image-resizer.image-resizer-sw {
      bottom: -2px;
      left: -6px;
      cursor: sw-resize;
    }

    .editor-shell .editor-image .image-resizer.image-resizer-w {
      bottom: 48%;
      left: -6px;
      cursor: w-resize;
    }

    .editor-shell .editor-image .image-resizer.image-resizer-nw {
      top: -6px;
      left: -6px;
      cursor: nw-resize;
    }

    .editor-shell span.inline-editor-image {
      cursor: default;
      display: inline-block;
      position: relative;
      z-index: 1;
    }

    .editor-shell .inline-editor-image img {
      max-width: 100%;
      cursor: default;
    }

    .editor-shell .inline-editor-image img.focused {
      outline: 2px solid rgb(60, 132, 244);
    }

    .editor-shell .inline-editor-image img.focused.draggable {
      cursor: grab;
    }

    .editor-shell .inline-editor-image img.focused.draggable:active {
      cursor: grabbing;
    }

    .editor-shell .inline-editor-image .image-caption-container .tree-view-output {
      margin: 0;
      border-radius: 0;
    }

    .editor-shell .inline-editor-image.position-full {
      margin: 1em 0 1em 0;
    }

    .editor-shell .inline-editor-image.position-left {
      float: left;
      width: 50%;
      margin: 1em 1em 0 0;
    }

    .editor-shell .inline-editor-image.position-right {
      float: right;
      width: 50%;
      margin: 1em 0 0 1em;
    }

    .editor-shell .inline-editor-image .image-edit-button {
      display: block;
      position: absolute;
      top: 12px;
      right: 12px;
      padding: 6px 8px;
      margin: 0 auto;
      border: 1px solid rgba(255, 255, 255, 0.3);
      border-radius: 5px;
      background-color: rgba(0, 0, 0, 0.5);
      min-width: 60px;
      color: #fff;
      cursor: pointer;
      user-select: none;
    }

    .editor-shell .inline-editor-image .image-edit-button:hover {
      background-color: rgba(60, 132, 244, 0.5);
    }

    .editor-shell .inline-editor-image .image-caption-container {
      display: block;
      background-color: #f4f4f4;
      min-width: 100%;
      color: #000;
      overflow: hidden;
    }

    .emoji {
      color: transparent;
      caret-color: rgb(5, 5, 5);
      background-size: 16px 16px;
      background-position: center;
      background-repeat: no-repeat;
      vertical-align: middle;
      margin: 0 -1px;
    }

    .emoji-inner {
      padding: 0 0.15em;
    }

    .emoji-inner::selection {
      color: transparent;
      background-color: rgba(150, 150, 150, 0.4);
    }

    .emoji-inner::moz-selection {
      color: transparent;
      background-color: rgba(150, 150, 150, 0.4);
    }

    .emoji.happysmile {
      background-image: url(images/emoji/1F642.png);
    }

    .emoji.veryhappysmile {
      background-image: url(images/emoji/1F600.png);
    }

    .emoji.unhappysmile {
      background-image: url(images/emoji/1F641.png);
    }

    .emoji.heart {
      background-image: url(images/emoji/2764.png);
    }

    .keyword {
      color: rgb(241, 118, 94);
      font-weight: bold;
    }

    .actions {
      position: absolute;
      text-align: right;
      margin: 10px;
      bottom: 0;
      right: 0;
    }

    .actions.tree-view {
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
    }

    .actions i {
      background-size: contain;
      display: inline-block;
      height: 15px;
      width: 15px;
      vertical-align: -0.25em;
    }

    .actions i.indent {
      background-image: url(images/icons/indent.svg);
    }

    .actions i.outdent {
      background-image: url(images/icons/outdent.svg);
    }

    .actions i.lock {
      background-image: url(images/icons/lock-fill.svg);
    }

    .actions i.image {
      background-image: url(images/icons/file-image.svg);
    }

    .actions i.table {
      background-image: url(images/icons/table.svg);
    }

    .actions i.unlock {
      background-image: url(images/icons/lock.svg);
    }

    .actions i.left-align {
      background-image: url(images/icons/text-left.svg);
    }

    .actions i.center-align {
      background-image: url(images/icons/text-center.svg);
    }

    .actions i.right-align {
      background-image: url(images/icons/text-right.svg);
    }

    .actions i.justify-align {
      background-image: url(images/icons/justify.svg);
    }

    .actions i.disconnect {
      background-image: url(images/icons/plug.svg);
    }

    .actions i.connect {
      background-image: url(images/icons/plug-fill.svg);
    }

    .table-cell-action-button-container {
      position: absolute;
      top: 0;
      left: 0;
      will-change: transform;
    }

    .table-cell-action-button {
      background-color: none;
      display: flex;
      justify-content: center;
      align-items: center;
      border: 0;
      position: relative;
      border-radius: 15px;
      color: #222;
      display: inline-block;
      cursor: pointer;
    }

    i.chevron-down {
      background-color: transparent;
      background-size: contain;
      display: inline-block;
      height: 8px;
      width: 8px;
      background-image: url(images/icons/chevron-down.svg);
    }

    .action-button {
      background-color: #eee;
      border: 0;
      padding: 8px 12px;
      position: relative;
      margin-left: 5px;
      border-radius: 15px;
      color: #222;
      display: inline-block;
      cursor: pointer;
    }

    .action-button:hover {
      background-color: #ddd;
      color: #000;
    }

    .action-button-mic.active {
      animation: mic-pulsate-color 3s infinite;
    }

    button.action-button:disabled {
      opacity: 0.6;
      background: #eee;
      cursor: not-allowed;
    }

    @keyframes mic-pulsate-color {
      0% {
        background-color: #ffdcdc;
      }

      50% {
        background-color: #ff8585;
      }

      100% {
        background-color: #ffdcdc;
      }
    }

    .debug-timetravel-panel {
      overflow: hidden;
      padding: 0 0 10px 0;
      margin: auto;
      display: flex;
    }

    .debug-timetravel-panel-slider {
      padding: 0;
      flex: 8;
    }

    .debug-timetravel-panel-button {
      padding: 0;
      border: 0;
      background: none;
      flex: 1;
      color: #fff;
      font-size: 12px;
    }

    .debug-timetravel-panel-button:hover {
      text-decoration: underline;
    }

    .debug-timetravel-button {
      border: 0;
      padding: 0;
      font-size: 12px;
      top: 10px;
      right: 15px;
      position: absolute;
      background: none;
      color: #fff;
    }

    .debug-timetravel-button:hover {
      text-decoration: underline;
    }

    .debug-treetype-button {
      border: 0;
      padding: 0;
      font-size: 12px;
      top: 10px;
      right: 85px;
      position: absolute;
      background: none;
      color: #fff;
    }

    .debug-treetype-button:hover {
      text-decoration: underline;
    }

    .connecting {
      font-size: 15px;
      color: #999;
      overflow: hidden;
      position: absolute;
      text-overflow: ellipsis;
      top: 10px;
      left: 10px;
      user-select: none;
      white-space: nowrap;
      display: inline-block;
      pointer-events: none;
    }

    .ltr {
      text-align: left;
    }

    .rtl {
      text-align: right;
    }

    .toolbar {
      display: flex;
      margin-bottom: 1px;
      background: #fff;
      padding: 4px;
      border-top-left-radius: 10px;
      border-top-right-radius: 10px;
      vertical-align: middle;
      overflow: auto;
      height: 36px;
      position: sticky;
      top: 0;
      z-index: 2;
    }

    button.toolbar-item {
      border: 0;
      display: flex;
      background: none;
      border-radius: 10px;
      padding: 8px;
      cursor: pointer;
      vertical-align: middle;
      flex-shrink: 0;
      align-items: center;
      justify-content: space-between;
    }

    button.toolbar-item:disabled {
      cursor: not-allowed;
    }

    button.toolbar-item.spaced {
      margin-right: 2px;
    }

    button.toolbar-item i.format {
      background-size: contain;
      display: inline-block;
      height: 18px;
      width: 18px;
      vertical-align: -0.25em;
      display: flex;
      opacity: 0.6;
    }

    button.toolbar-item:disabled .icon,
    button.toolbar-item:disabled .text,
    button.toolbar-item:disabled i.format,
    button.toolbar-item:disabled .chevron-down {
      opacity: 0.2;
    }

    button.toolbar-item.active {
      background-color: rgba(223, 232, 250, 0.3);
    }

    button.toolbar-item.active i {
      opacity: 1;
    }

    .toolbar-item:hover:not([disabled]) {
      background-color: #eee;
    }

    .toolbar-item.font-family .text {
      display: block;
      max-width: 40px;
    }

    .toolbar .code-language {
      width: 150px;
    }

    .toolbar .toolbar-item .text {
      display: flex;
      line-height: 20px;
      vertical-align: middle;
      font-size: 14px;
      color: #777;
      text-overflow: ellipsis;
      overflow: hidden;
      height: 20px;
      text-align: left;
      padding-right: 10px;
    }

    .toolbar .toolbar-item .icon {
      display: flex;
      width: 20px;
      height: 20px;
      user-select: none;
      margin-right: 8px;
      line-height: 16px;
      background-size: contain;
    }

    .toolbar i.chevron-down,
    .toolbar-item i.chevron-down {
      margin-top: 3px;
      width: 16px;
      height: 16px;
      display: flex;
      user-select: none;
    }

    .toolbar i.chevron-down.inside {
      width: 16px;
      height: 16px;
      display: flex;
      margin-left: -25px;
      margin-top: 11px;
      margin-right: 10px;
      pointer-events: none;
    }

    .toolbar .divider {
      width: 1px;
      background-color: #eee;
      margin: 0 4px;
    }

    .sticky-note-container {
      position: absolute;
      z-index: 9;
      width: 120px;
      display: inline-block;
    }

    .sticky-note {
      line-height: 1;
      text-align: left;
      width: 120px;
      margin: 25px;
      padding: 20px 10px;
      position: relative;
      border: 1px solid #e8e8e8;
      font-family: 'Reenie Beanie';
      font-size: 24px;
      border-bottom-right-radius: 60px 5px;
      display: block;
      cursor: move;
    }

    .sticky-note:after {
      content: '';
      position: absolute;
      z-index: -1;
      right: -0px;
      bottom: 20px;
      width: 120px;
      height: 25px;
      background: rgba(0, 0, 0, 0.2);
      box-shadow: 2px 15px 5px rgba(0, 0, 0, 0.4);
      transform: matrix(-1, -0.1, 0, 1, 0, 0);
    }

    .sticky-note.yellow {
      border-top: 1px solid #fdfd86;
      background: linear-gradient(135deg,
          #ffff88 81%,
          #ffff88 82%,
          #ffff88 82%,
          #ffffc6 100%);
    }

    .sticky-note.pink {
      border-top: 1px solid #e7d1e4;
      background: linear-gradient(135deg,
          #f7cbe8 81%,
          #f7cbe8 82%,
          #f7cbe8 82%,
          #e7bfe1 100%);
    }

    .sticky-note-container.dragging {
      transition: none !important;
    }

    .sticky-note div {
      cursor: text;
    }

    .sticky-note .delete {
      border: 0;
      background: none;
      position: absolute;
      top: 8px;
      right: 10px;
      font-size: 10px;
      cursor: pointer;
      opacity: 0.5;
    }

    .sticky-note .delete:hover {
      font-weight: bold;
      opacity: 1;
    }

    .sticky-note .color {
      border: 0;
      background: none;
      position: absolute;
      top: 8px;
      right: 25px;
      cursor: pointer;
      opacity: 0.5;
    }

    .sticky-note .color:hover {
      opacity: 1;
    }

    .sticky-note .color i {
      display: block;
      width: 12px;
      height: 12px;
      background-size: contain;
    }

    .excalidraw-button {
      border: 0;
      padding: 0;
      margin: 0;
      background-color: transparent;
    }

    .excalidraw-button.selected {
      outline: 2px solid rgb(60, 132, 244);
      user-select: none;
    }

    .github-corner:hover .octo-arm {
      animation: octocat-wave 560ms ease-in-out;
    }

    @keyframes octocat-wave {

      0%,
      100% {
        transform: rotate(0);
      }

      20%,
      60% {
        transform: rotate(-25deg);
      }

      40%,
      80% {
        transform: rotate(10deg);
      }
    }

    @media (max-width: 500px) {
      .github-corner:hover .octo-arm {
        animation: none;
      }

      .github-corner .octo-arm {
        animation: octocat-wave 560ms ease-in-out;
      }
    }

    .spacer {
      letter-spacing: -2px;
    }

    .editor-equation {
      cursor: default;
      user-select: none;
    }

    .editor-equation.focused {
      outline: 2px solid rgb(60, 132, 244);
    }

    button.item i {
      opacity: 0.6;
    }

    button.item.dropdown-item-active {
      background-color: rgba(223, 232, 250, 0.3);
    }

    button.item.dropdown-item-active i {
      opacity: 1;
    }

    hr {
      padding: 2px 2px;
      border: none;
      margin: 1em 0;
      cursor: pointer;
    }

    hr:after {
      content: '';
      display: block;
      height: 2px;
      background-color: #ccc;
      line-height: 2px;
    }

    hr.selected {
      outline: 2px solid rgb(60, 132, 244);
      user-select: none;
    }

    .TableNode__contentEditable {
      min-height: 20px;
      border: 0px;
      resize: none;
      cursor: text;
      display: block;
      position: relative;
      outline: 0px;
      padding: 0;
      user-select: text;
      font-size: 15px;
      white-space: pre-wrap;
      word-break: break-word;
      z-index: 3;
    }

    .PlaygroundEditorTheme__blockCursor {
      display: block;
      pointer-events: none;
      position: absolute;
    }

    .PlaygroundEditorTheme__blockCursor:after {
      content: '';
      display: block;
      position: absolute;
      top: -2px;
      width: 20px;
      border-top: 1px solid black;
      animation: CursorBlink 1.1s steps(2, start) infinite;
    }

    @keyframes CursorBlink {
      to {
        visibility: hidden;
      }
    }

    .dialog-dropdown {
      background-color: #eee !important;
      margin-bottom: 10px;
      width: 100%;
    }

    .PlaygroundEditorTheme__table {
      width: 100%;
      pointer-events: none;
    }
    /**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *
 */
.PlaygroundEditorTheme__ltr {
  text-align: left;
}
.PlaygroundEditorTheme__rtl {
  text-align: right;
}
.PlaygroundEditorTheme__paragraph {
  margin: 0;
  position: relative;
}
.PlaygroundEditorTheme__quote {
  margin: 0;
  margin-left: 20px;
  margin-bottom: 10px;
  font-size: 15px;
  color: rgb(101, 103, 107);
  border-left-color: rgb(206, 208, 212);
  border-left-width: 4px;
  border-left-style: solid;
  padding-left: 16px;
}
.PlaygroundEditorTheme__h1 {
  font-size: 24px;
  color: rgb(5, 5, 5);
  font-weight: 400;
  margin: 0;
}
.PlaygroundEditorTheme__h2 {
  font-size: 15px;
  color: rgb(101, 103, 107);
  font-weight: 700;
  margin: 0;
  text-transform: uppercase;
}
.PlaygroundEditorTheme__h3 {
  font-size: 12px;
  margin: 0;
  text-transform: uppercase;
}
.PlaygroundEditorTheme__indent {
  --lexical-indent-base-value: 40px;
}
.PlaygroundEditorTheme__textBold {
  font-weight: bold;
}
.PlaygroundEditorTheme__textItalic {
  font-style: italic;
}
.PlaygroundEditorTheme__textUnderline {
  text-decoration: underline;
}
.PlaygroundEditorTheme__textStrikethrough {
  text-decoration: line-through;
}
.PlaygroundEditorTheme__textUnderlineStrikethrough {
  text-decoration: underline line-through;
}
.PlaygroundEditorTheme__textSubscript {
  font-size: 0.8em;
  vertical-align: sub !important;
}
.PlaygroundEditorTheme__textSuperscript {
  font-size: 0.8em;
  vertical-align: super;
}
.PlaygroundEditorTheme__textCode {
  background-color: rgb(240, 242, 245);
  padding: 1px 0.25rem;
  font-family: Menlo, Consolas, Monaco, monospace;
  font-size: 94%;
}
.PlaygroundEditorTheme__hashtag {
  background-color: rgba(88, 144, 255, 0.15);
  border-bottom: 1px solid rgba(88, 144, 255, 0.3);
}
.PlaygroundEditorTheme__link {
  color: rgb(33, 111, 219);
  text-decoration: none;
}
.PlaygroundEditorTheme__link:hover {
  cursor: pointer;
}
.PlaygroundEditorTheme__code {
  background-color: rgb(240, 242, 245);
  font-family: Menlo, Consolas, Monaco, monospace;
  display: block;
  padding: 8px 8px 8px 52px;
  line-height: 1.53;
  font-size: 13px;
  margin: 0;
  margin-top: 8px;
  margin-bottom: 8px;
  overflow-x: auto;
  position: relative;
  tab-size: 2;
}
.PlaygroundEditorTheme__code:before {
  content: attr(data-gutter);
  position: absolute;
  background-color: #eee;
  left: 0;
  top: 0;
  border-right: 1px solid #ccc;
  padding: 8px;
  color: #777;
  white-space: pre-wrap;
  text-align: right;
  min-width: 25px;
}
.PlaygroundEditorTheme__table {
  border-collapse: collapse;
  border-spacing: 0;
  overflow-y: scroll;
  overflow-x: scroll;
  table-layout: fixed;
  width: max-content;
  margin: 30px 0;
}
.PlaygroundEditorTheme__tableSelection *::selection {
  background-color: transparent;
}
.PlaygroundEditorTheme__tableSelected {
  outline: 2px solid rgb(60, 132, 244);
}
.PlaygroundEditorTheme__tableCell {
  border: 1px solid #bbb !important;
  width: 75px;
  min-width: 75px;
  vertical-align: top;
  text-align: start;
  padding: 6px 8px;
  position: relative;
  outline: none;
}
.PlaygroundEditorTheme__tableCellSortedIndicator {
  display: block;
  opacity: 0.5;
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background-color: #999;
}
.PlaygroundEditorTheme__tableCellResizer {
  position: absolute;
  right: -4px;
  height: 100%;
  width: 8px;
  cursor: ew-resize;
  z-index: 10;
  top: 0;
}
.PlaygroundEditorTheme__tableCellHeader {
  background-color: #f2f3f5;
  text-align: start;
}
.PlaygroundEditorTheme__tableCellSelected {
  background-color: #c9dbf0;
}
.PlaygroundEditorTheme__tableCellPrimarySelected {
  border: 2px solid rgb(60, 132, 244);
  display: block;
  height: calc(100% - 2px);
  position: absolute;
  width: calc(100% - 2px);
  left: -1px;
  top: -1px;
  z-index: 2;
}
.PlaygroundEditorTheme__tableCellEditing {
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.4);
  border-radius: 3px;
}
.PlaygroundEditorTheme__tableAddColumns {
  position: absolute;
  top: 0;
  width: 20px;
  background-color: #eee;
  height: 100%;
  right: -25px;
  animation: table-controls 0.2s ease;
  border: 0;
  cursor: pointer;
}
.PlaygroundEditorTheme__tableAddColumns:after {
  background-image: url(../images/icons/plus.svg);
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  display: block;
  content: ' ';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0.4;
}
.PlaygroundEditorTheme__tableAddColumns:hover {
  background-color: #c9dbf0;
}
.PlaygroundEditorTheme__tableAddRows {
  position: absolute;
  bottom: -25px;
  width: calc(100% - 25px);
  background-color: #eee;
  height: 20px;
  left: 0;
  animation: table-controls 0.2s ease;
  border: 0;
  cursor: pointer;
}
.PlaygroundEditorTheme__tableAddRows:after {
  background-image: url(../images/icons/plus.svg);
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  display: block;
  content: ' ';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0.4;
}
.PlaygroundEditorTheme__tableAddRows:hover {
  background-color: #c9dbf0;
}
@keyframes table-controls {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
.PlaygroundEditorTheme__tableCellResizeRuler {
  display: block;
  position: absolute;
  width: 1px;
  background-color: rgb(60, 132, 244);
  height: 100%;
  top: 0;
}
.PlaygroundEditorTheme__tableCellActionButtonContainer {
  display: block;
  right: 5px;
  top: 6px;
  position: absolute;
  z-index: 4;
  width: 20px;
  height: 20px;
}
.PlaygroundEditorTheme__tableCellActionButton {
  background-color: #eee;
  display: block;
  border: 0;
  border-radius: 20px;
  width: 20px;
  height: 20px;
  color: #222;
  cursor: pointer;
}
.PlaygroundEditorTheme__tableCellActionButton:hover {
  background-color: #ddd;
}
.PlaygroundEditorTheme__characterLimit {
  display: inline;
  background-color: #ffbbbb !important;
}
.PlaygroundEditorTheme__ol1 {
  padding: 0;
  margin: 0;
  list-style-position: outside;
}
.PlaygroundEditorTheme__ol2 {
  padding: 0;
  margin: 0;
  list-style-type: upper-alpha;
  list-style-position: outside;
}
.PlaygroundEditorTheme__ol3 {
  padding: 0;
  margin: 0;
  list-style-type: lower-alpha;
  list-style-position: outside;
}
.PlaygroundEditorTheme__ol4 {
  padding: 0;
  margin: 0;
  list-style-type: upper-roman;
  list-style-position: outside;
}
.PlaygroundEditorTheme__ol5 {
  padding: 0;
  margin: 0;
  list-style-type: lower-roman;
  list-style-position: outside;
}
.PlaygroundEditorTheme__ul {
  padding: 0;
  margin: 0;
  list-style-position: outside;
}
.PlaygroundEditorTheme__listItem {
  margin: 0 32px;
}
.PlaygroundEditorTheme__listItemChecked,
.PlaygroundEditorTheme__listItemUnchecked {
  position: relative;
  margin-left: 8px;
  margin-right: 8px;
  padding-left: 24px;
  padding-right: 24px;
  list-style-type: none;
  outline: none;
}
.PlaygroundEditorTheme__listItemChecked {
  text-decoration: line-through;
}
.PlaygroundEditorTheme__listItemUnchecked:before,
.PlaygroundEditorTheme__listItemChecked:before {
  content: '';
  width: 16px;
  height: 16px;
  top: 2px;
  left: 0;
  cursor: pointer;
  display: block;
  background-size: cover;
  position: absolute;
}
.PlaygroundEditorTheme__listItemUnchecked[dir='rtl']:before,
.PlaygroundEditorTheme__listItemChecked[dir='rtl']:before {
  left: auto;
  right: 0;
}
.PlaygroundEditorTheme__listItemUnchecked:focus:before,
.PlaygroundEditorTheme__listItemChecked:focus:before {
  box-shadow: 0 0 0 2px #a6cdfe;
  border-radius: 2px;
}
.PlaygroundEditorTheme__listItemUnchecked:before {
  border: 1px solid #999;
  border-radius: 2px;
}
.PlaygroundEditorTheme__listItemChecked:before {
  border: 1px solid rgb(61, 135, 245);
  border-radius: 2px;
  background-color: #3d87f5;
  background-repeat: no-repeat;
}
.PlaygroundEditorTheme__listItemChecked:after {
  content: '';
  cursor: pointer;
  border-color: #fff;
  border-style: solid;
  position: absolute;
  display: block;
  top: 6px;
  width: 3px;
  left: 7px;
  right: 7px;
  height: 6px;
  transform: rotate(45deg);
  border-width: 0 2px 2px 0;
}
.PlaygroundEditorTheme__nestedListItem {
  list-style-type: none;
}
.PlaygroundEditorTheme__nestedListItem:before,
.PlaygroundEditorTheme__nestedListItem:after {
  display: none;
}
.PlaygroundEditorTheme__tokenComment {
  color: slategray;
}
.PlaygroundEditorTheme__tokenPunctuation {
  color: #999;
}
.PlaygroundEditorTheme__tokenProperty {
  color: #905;
}
.PlaygroundEditorTheme__tokenSelector {
  color: #690;
}
.PlaygroundEditorTheme__tokenOperator {
  color: #9a6e3a;
}
.PlaygroundEditorTheme__tokenAttr {
  color: #07a;
}
.PlaygroundEditorTheme__tokenVariable {
  color: #e90;
}
.PlaygroundEditorTheme__tokenFunction {
  color: #dd4a68;
}
.PlaygroundEditorTheme__mark {
  background: rgba(255, 212, 0, 0.14);
  border-bottom: 2px solid rgba(255, 212, 0, 0.3);
  padding-bottom: 2px;
}
.PlaygroundEditorTheme__markOverlap {
  background: rgba(255, 212, 0, 0.3);
  border-bottom: 2px solid rgba(255, 212, 0, 0.7);
}
.PlaygroundEditorTheme__mark.selected {
  background: rgba(255, 212, 0, 0.5);
  border-bottom: 2px solid rgba(255, 212, 0, 1);
}
.PlaygroundEditorTheme__markOverlap.selected {
  background: rgba(255, 212, 0, 0.7);
  border-bottom: 2px solid rgba(255, 212, 0, 0.7);
}
.PlaygroundEditorTheme__embedBlock {
  user-select: none;
}
.PlaygroundEditorTheme__embedBlockFocus {
  outline: 2px solid rgb(60, 132, 244);
}
.PlaygroundEditorTheme__layoutContainer {
  display: grid;
  gap: 10px;
  margin: 10px 0;
}
.PlaygroundEditorTheme__layoutItem {
  border: 1px dashed #ddd;
  padding: 8px 16px;
}

  </style>
</head>

<body>
  ${body}
</body>

</html>
`;
}



app.post('/generatepdf', (req, res) => {
  let pdfFilePath;
  const { htmlcode, html_in } = req.body;
  let html = getHtmlCode(htmlcode)
  if (html_in) {
    pdfFilePath = 'html.pdf';
  } else {
    pdfFilePath = 'tree.pdf';
  }

  convertHtmlToPdf(html)
    .then((pdfBuffer) => {
      // Save the PDF buffer to a file or do something else with it
      // console.log('PDF generated successfully');
      // fs.writeFileSync(pdfFilePath, pdfBuffer);
      console.log(`PDF saved successfully: ${pdfFilePath}`);
      // Set the appropriate headers for PDF response
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename="generated.pdf"');

      res.send(pdfBuffer);
      // fs.writeFile('code.html', html, (err) => {
      //   if (err) {
      //     console.error('Error writing HTML file:', err);
      //   } else {
      //     console.log('HTML file created successfully!');
      //   }
      // });
    })
    .catch((error) => {
      console.error('Error generating PDF:', error);
    });
});
