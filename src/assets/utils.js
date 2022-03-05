// courtesies of StackOverflow
// https://stackoverflow.com/a/12646864
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
  return array
}
// https://stackoverflow.com/a/20762713
function mode(array){
  return array.sort((a, b) =>
        array.filter(v => v === a).length
      - array.filter(v => v === b).length
  ).pop()
}

function drawFrom(deckArray, random=false) {
  if (!random) {
    return deckArray.pop()
  }
  const index = Math.floor(Math.random() * deckArray.length)
  return deckArray.splice(index, 1)[0]
}

export { shuffle, mode, drawFrom }
