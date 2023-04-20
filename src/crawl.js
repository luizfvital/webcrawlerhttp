const { JSDOM } = require('jsdom')

async function crawlPage(currentURL) {
  try {
    const resp = await fetch(currentURL)

    if(resp.status > 399) throw new Error(`Error trying to fetch page \"${currentURL}\": ${resp.status}`)

    const contentType = resp.headers.get('content-type')

    if(!contentType.includes('text/html')) throw new Error(`Content type is not html`)

    console.log(contentType)
    // console.log(await resp.text())
    
  } catch (error) { 
    console.log(error.message)
  }
}

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
  getURLsFromHTML,
  crawlPage
}