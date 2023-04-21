const { JSDOM } = require('jsdom')

async function crawlPage(baseURL, currentURL, pages) {
  try {
    const baseURLObj = new URL(baseURL)
    const currentURLObj = new URL(currentURL)

    if(baseURLObj.hostname !== currentURLObj.hostname) return pages

    const normalizedCurrentURL = normalizeURL(currentURL)

    if(pages[normalizedCurrentURL] > 0) {
      pages[normalizedCurrentURL] += 1

      return pages
    }

    pages[normalizedCurrentURL] = 1

    console.log(`currently crawling: ${currentURL}`)

    const resp = await fetch(currentURL)

    if(resp.status > 399) throw new Error(`Error trying to fetch page \"${currentURL}\": ${resp.status}`)

    const contentType = resp.headers.get('content-type')

    if(!contentType.includes('text/html')) throw new Error(`Content type is not text/html`)


    const htmlText = await resp.text()

    const nextURLs = getURLsFromHTML(htmlText, baseURL)

    for (const nextURL of nextURLs) {
      pages = crawlPage(baseURL, nextURL, pages)
    }
    
  } catch (error) { 
    console.log(error.message)

    return pages
  }

  return pages
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