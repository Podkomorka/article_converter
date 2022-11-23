const input = document.getElementById('input')
const output = document.getElementById('output')
const submit = document.getElementById('submit')

submit.addEventListener('click', convertArticle)

async function convertArticle() {
  // Clear output textarea
  output.value = ''

  // Make array of sections split by newline
  const inputSplit = input.value.trimEnd().split(/\r?\n/)


  for(let i = 0; i < inputSplit.length; i++) {
    // Check if a section is a header or a paragraph
    if(inputSplit[i].substring(0,2) === '**') {
      convertHeader(inputSplit[i])
    } else {
      await convertParagraph(inputSplit[i])
    }
  }
}

function convertHeader(h) {
  // Remove markup
  const headerText = h.substring(2)

  // Add to output textarea
  output.value = output.value + `<h2>${headerText}</h2>`
}

async function convertParagraph(p) {

  const cards = []

  while(p.search(/\[\[/) > -1) {
    p = p.replace(/\[\[(.*?)\]\]/, card => {
      const cardName = card.slice(2,-2)
      cards.push(cardName)
      return `${cardName}`
    })
  }

  for(let i = 0; i < cards.length; i++) {
    const cardURL = await getCard(cards[i])
    p = p.replace(cards[i], () => {
      return `<a href=\"${cardURL}\" target=\"_blank\">${cards[i]}</a>`
    })
  }

  // Repeat above process for [link text](URL) markup

  // Add to output textarea
  output.value = output.value + `<p>${p}</p>`
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