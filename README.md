# Article Converter

I made this tool to help save time converting articles into HTML for the [PDH Home Base website](https://www.pdhhomebase.com/articles). This tool allows writers to make card image links simply by wrapping card names in brackets, saving them the hassle of finding hundreds of different URLs manually. The converter makes use of asynchronous functions that make fetch requests to the Scryfall API.

## Use Cases
* Wrap all paragraphs with paragraph tags
* Identify custom header markup and wrap with header tags. For example, ```##Header``` converts to ```<h2>Header</h2>```
* Identify custom hyperlink markup and convert into an HTML link. For example, ```[my website](www.website.com)``` converts to ```<a href="www.website.com" target="_blank">my website</a>```
* Identify custom markup for Magic the Gathering card names, make a fetch request to a Magic the Gathering card API to get a URL for that card's image, then convert the card name into a link to that URL. For example, ```[[Elvish Mystic]]``` converts to ```<a href="https://cards.scryfall.io/large/front/e/d/ed7a0227-ac70-40fb-8198-a55eacf913fa.jpg?1631234818" target="_blank">Elvish Mystic</a>```
