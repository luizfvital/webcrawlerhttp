const { JSDOM } = require('jsdom')

function getURLsFromHTML(htmlBody, baseURL) {
  const urls = []
  const dom = new JSDOM(htmlBody)
  const linkElements = dom.window.document.querySelectorAll('a')

  for (const linkElement of linkElements) {
    const href = linkElement.href
    const isAbsoluteURL = href.startsWith('http')
    const isValidURL = href.startsWith('http') || href.startsWith('/')

    if(!isValidURL) return urls

    if(!isAbsoluteURL) {
      urls.push(`${baseURL}${href}`)
    } else {
      urls.push(href)
    }

  }

  return urls
}

function normalizeURL(urlString) {
  const urlObj = new URL(urlString)
  
  let hostPath = `${urlObj.hostname}${urlObj.pathname}`

  if(hostPath.length > 0 && hostPath.slice(-1) === '/') {
    hostPath = hostPath.slice(0, -1)
  }

  return hostPath.toLowerCase()
}

module.exports = {
  normalizeURL,
  getURLsFromHTML
}