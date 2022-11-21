const input = document.getElementById('input')
const output = document.getElementById('output')
const submit = document.getElementById('submit')

submit.addEventListener('click', convertArticle)

function convertArticle() {
  // Clear output textarea
  output.value = ''
  // Make array of sections split by newline
  const inputSplit = input.value.trimEnd().split(/\r?\n/)

  inputSplit.forEach(text => {
    // Check if a section has markup to be a header
    if(text.substring(0,2) === '**') {
      convertHeader(text)
    } else {
      convertParagraph(text)
    }
  })
}

function convertHeader(h) {
  // Remove markup
  const headerText = h.substring(2)
  // Wrap with h2 tags
  const headerCode = `<h2>${headerText}</h2>`
  // Add to output textarea
  output.value = output.value + headerCode
}

async function convertParagraph(p) {
  const cards = []

  // Get all card names from [[card name]]'s
  p = p.replace(/\[\[(.*?)\]\]/g, card => {
    const cardName = card.slice(2,-2)

    cards.push(cardName)
  
    return `[[${cardName}]]`
  })

  // Get the scryfall image URL for each card and replace the [[card name]] with an link tag
  for(let i = 0; i < cards.length; i++) {
    const cardURL = await getCard(cards[i])
    p = p.replace(/\[\[(.*?)\]\]/, () => {
      return `<a href=\"${cardURL}\" target=\"_blank\">${cards[i]}</a>`
    })
  }


  // Repeat above process for [link text](URL) markup



  // Wrap converted paragraph in p tags
  const paragraphCode = `<p>${p}</p>`
  // Add to output textarea
  output.value = output.value + paragraphCode
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