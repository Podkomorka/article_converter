const input = document.getElementById('input')
const output = document.getElementById('output')
const submit = document.getElementById('submit')

submit.addEventListener('click', convertArticle)

async function convertArticle() {
  // Clear output textarea
  output.value = ''

  // New output array
  const outputArray = []

  // Turn input into array split by newline
  const inputArray = input.value.trimEnd().split(/\r?\n/)

  // For each section in article
  for(let i = 0; i < inputArray.length; i++) {
    // Name current section
    let text = inputArray[i]

    // Check if a section is a header or a paragraph
    if(text.substring(0,2) === '##') {
      // Remove markup, wrap with tags, and push
      outputArray.push(wrap(text.substring(2), 'h2'))
    } else {
      // Convert cards with markup into links
      text = await convertCards(text)

      // Convert links
      text = convertLinks(text)

      // Wrap with tags and push
      outputArray.push(wrap(text, 'p'))
    }
  }
  
  // Put converted article into output textarea
  for(let i = 0; i < outputArray.length; i++) {
    output.value = output.value + outputArray[i] + '\n'
  }
}

// Helper function to wrap content in an html tag
function wrap(content, tag) {
  return `<${tag}>${content}</${tag}>`
}

async function convertCards(text) {
  // For each card with markup
  while(text.search(/\[\[/) > -1) {
    // Get card location in text
    const start = text.search(/\[\[/)
    const end = text.search(/\]\]/)

    // Save card name with markup "[[Card Name]]"
    const cardMarkup = text.substring(start, end+2)

    // Save card name without markup
    const cardName = text.substring(start+2, end)

    // Fetch the Scryfall URL for that cards image
    const cardURL = await getCard(cardName)

    // Replace the markup with a link to that card's image
    text = text.replace(cardMarkup, `<a href=\"${cardURL}\" target=\"_blank\">${cardName}</a>`)
  }
  
  return text
}

function convertLinks(text) {
  // For each link with markup "(link text)[link url]"
  while(text.search(/\]\(/) > -1) {
    const markupMiddle = text.search(/\]\(/)
    let markupStart
    let markupEnd

    // Get start of markup
    for(let i = markupMiddle; text[i] !== '['; i--) {
      markupStart = i - 1
    }

    // Get end of markup
    for(let i = markupMiddle; text[i] !== ')'; i++) {
      markupEnd = i + 1
    }
    
    // Get entire markup value
    const entireMarkup = text.substring(markupStart, markupEnd+1)

    // Get link text value
    const linkText = text.substring(markupStart+1, markupMiddle)
    
    // Get link url value
    const url = text.substring(markupMiddle+2, markupEnd)

    // Replace markup value with template literal for a link
    text = text.replace(entireMarkup, `<a href="${url}" target="_blank">${linkText}</a>`)
  }
  
  return text
}

async function getCard(cardName) {
  const urlCardName = cardName.replace(/\s+/g, '+')
  const url = `https://api.scryfall.com/cards/named?fuzzy=${urlCardName}`
  const res = await fetch(url)
  if(res.ok) {
    const { image_uris: { large }} = await res.json()
    return large
  } else {
    return '#'
  }
}
