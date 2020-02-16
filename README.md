# YuGiOh Deck Tool

> A tool to view deck prices, share and edit decks, create random decks and much more

## Introduction

A tool to view deck prices, share and edit decks, create random decks and much more.

Live version: <https://ygoprodeck.com/card-database/deck-prices/>.

## Development

### Directory Structure

- `src` Vue app source code.
- `public` Static Vue files.
- `api` PHP based backend for serving JSON data files as well as handling price requests.
- `convert` A Node.js script for ygoprodeck.com to convert the SQL dumps of the card database to JSON data files.
- `ygoprodeck.com` Files used on ygoprodeck.com, e.g. the WordPress template the app is accessed by.
