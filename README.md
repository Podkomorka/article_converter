# Article-Converter

This is a tool I made to help me quickly convert articles into HTML for the [PDH Home Base website](https://www.pdhhomebase.com/articles).

## Use Cases
* Wrap all paragraphs with paragraph tags
* Identify custom header markup and wrap with header tags. For example, ```##Header``` converts to ```<h2>Header</h2>```
* Identify custom hyperlink markup and convert into an HTML link. For example, ```[my website](www.website.com)``` converts to ```<a href="www.website.com">my website</a>```
* Identify custom markup for Magic the Gathering card names, make a fetch request to a Magic the Gathering card API to get a url for that card's image, then convert the card name into a link to that url
