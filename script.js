var tung = ""

var topToggle = false
function TopToggle(show = null) {
  topToggle = show === null ? !topToggle : show
  
  if (topToggle) {
    $('#tung').show()
  } else {
    $('#tung').hide()
  }
  layout()
}

const sfx = new Audio('sfx-click.ogg')

$(document).ready(() => {
  if (localStorage.getItem('tung') === null || localStorage.getItem('tung') == "") {
    tung = "201C 2014 00D7 00B0 00B7 2022 221E 00B1 2023 201D"
    localStorage.setItem('tung', tung)
  }
  else {
    tung = localStorage.getItem('tung')
  }
  $('#tung').html(tung)
  layout()

  // persistent text
  if (localStorage.getItem('text') === null || localStorage.getItem('text') == "") {
    localStorage.setItem('text', "")
  }
  else {
    $('#text').html(localStorage.getItem('text'))
  }


  // $('body').on('keydown', '[contenteditable]', function(e) {
  //   if (e.keyCode === 13) {
  //     e.preventDefault() // prevent the default newline insertion
  //     var range = window.getSelection().getRangeAt(0) // get the current selection range
  //     var newline = document.createTextNode("\n") // create a new text node with the newline character
  //     range.insertNode(newline) // insert the new text node at the current cursor position
  //     range.setStartAfter(newline) // set the cursor after the new text node
  //     range.setEndAfter(newline) // set the end of the selection after the new text node
  //     window.getSelection().removeAllRanges() // remove the old selection
  //     window.getSelection().addRange(range) // set the new selection to the updated range
  //     layout()
  //   }
  //   console.log(e.keyCode)
  // });


  let url = '/tungs.txt'
  $.get(url, function (data) {
    lines = data.split('\n')
    nav()
  })
})

var lines = null
var indexPath = [ 0 ]

function indentation(line) {
  let lineIndent = 0
  while (line.charAt(lineIndent) == '\t') { lineIndent++ }
  return lineIndent
}

function nav() {
  let rootIndex = indexPath[indexPath.length - 1]
  let root = lines[rootIndex]
  let rootIndent = indentation(root)
  
  let html = ``
  for (let i = rootIndex; i < lines.length; i++) {
    let line = lines[i]
    let lineIndent = indentation(line)

    if (lineIndent < rootIndent) {
      break
    }

    if (lineIndent > rootIndent) {
      continue
    }

    let option = line.trim()
    let pick   = false
    if (option.includes(':')) {
      option = option.split(':')[0].trim()
      pick   = true
    }

    let disabled = false
    // if next line has doesn't have a greater indent, disable the option and make it gray
    if (!pick && i + 1 < lines.length) {
      let nextLineIndent = indentation(lines[i + 1])
      if (nextLineIndent <= rootIndent) {
        disabled = true
      }
    }

    let classes = `class="option 
      ${disabled ? 'disabled' : ''} 
      ${pick ? 'pick' : ''} 
      ${(selected != null && i == selected) ? 'selected' : ''} 
    "`
    let click   = `${disabled ? '' : `onclick="select(${i}, ${pick})"`}`

    html += `<div ${classes} ${click}>${option}</div>`
  }
  
  let top = indexPath.length < 2
  let from = top ? 'tungs' : lines[rootIndex - 1].trim()
  let back = `
  <div class="option back" onclick="back()">
    <div style="">
      <img class="icon-btn" src="icons/back.svg" style="margin: 0; transform: rotate(${top ? 45 : 0}deg);">
      <div style="margin-top: 16px; font-size: 24px; font-weight: bold;">${from}</div>
    </div>
    <div><a href="https://github.com/spatialfree/tung-tap">contribute</a></div>
  </div>`

  let head = `
  <div style="display: flex; justify-content: space-around; align-items: center; padding: 0 10px; height: 36px; background-color: #ffb5dd; color: #fff;">
    <div style="font-weight: bold;">tung-tap</div>
		<img onclick="$('#nav').toggle()" class="icon-btn" src="icons/tungs.svg">    
  </div>`

  let links = `
  <div id="links" style="
    padding: 10px 20px;
    margin: 0px;
    font-size: 14px;
    background-color: #ff79a1;
    color: #79394f;
  ">
    Find more character codes in 
    <a target="_blank" href="https://unicode.org/charts/">unicode.org</a>
    reference charts  
    or sketching in <a target="_blank" href="https://shapecatcher.com/">shapecatcher.com</a>
    drawbox search!
  </div>`

  $('#nav').html(links + back + html)
}

function back() {
  if (indexPath.length == 1) {
    $('#nav').toggle()
    return
  }
  indexPath.pop()
  nav()
}

var selected = null
function select(index, pick) {
  let line = lines[index]
  if (pick) {
    $('#tung').html(line.split(':')[1].trim())
    layout()
    selected = index
  } else {
    indexPath.push(index + 1)
  }
  nav()
}

function getLines(divId) {
  var div = document.getElementById(divId)
  var lineHeight = parseInt(window.getComputedStyle(div).getPropertyValue('line-height'))
  var height = div.getBoundingClientRect().height
  var lineCount = Math.floor(height / lineHeight)
  var newLines = []
  for (var i = 0; i < lineCount; i++) {
      // var lineTop = i * lineHeight
      // var lineBottom = (i + 1) * lineHeight
      var lineText = div.innerText.substring(
        div.getClientRects()[i].left - div.getClientRects()[0].left,
        div.getClientRects()[i].right - div.getClientRects()[0].left
      )
      newLines.push(lineText)
  }
  return newLines
}

function layout() {
  // keymap (tung is the proprietary name)
  let tungText = $('#tung').html()  //.replace('\r\n', '\n')
  tungText = tungText.replace(/<div>/g, '\n').replace(/<\/div>/g, '')
  if (tung != tungText) {
    tung = tungText
    localStorage.setItem('tung', tung)
  }

  // console.log(tungText)
  
  let html = ``
  let rows = tung.split('\n')
  rows.forEach(row => {
    row = row.trim()
    if (row.length > 0) {
      html += `<div class="row">\n`
      let keys = row.split(' ')
      keys.forEach(key => {
        // print the newkey string
        // and the unicode character
        html += `<div class="key" charcode="${key}" ${topToggle ? `style="position: relative; padding-top: 10px;` : ``}">
          <span style="
            font-family: 'DM Mono', monospace;
            font-size: 12px; 
            line-height: 12px;
            position: absolute;
            top: 2px; left: 0; right: 0;
            color: #aaa;
            ${topToggle ? `` : `display: none;`}
          ">${key}</span>
          ${String.fromCharCode("0x" + key)}
          </div>\n`
        })
      html += `</div>\n`
    }
  })

  $('#keyboard').html(html)

  $('.key').click(key => {
    // override default behavior
    key.preventDefault()

    // if text is not focused then set the cursor to the end of $('#text')
    let textEl = $('#text')
    if (document.activeElement != textEl[0] && window.getSelection().rangeCount == 0) {
      let selection = window.getSelection()
      let range = document.createRange()
      range.selectNodeContents(textEl[0])
      range.collapse(false)
      selection.removeAllRanges()
      selection.addRange(range)
    }
    textEl.focus()
  
    // insert key character into contenteditable div $('#text') at cursor position
    let char = String.fromCharCode("0x" + $(key.target).attr('charcode'))
    insertTextAtCursor(char)
  

    
    // navigator.vibrate(20);
    // sfx.play()
  })
}




function insertTextAtCursor(text) {  
  let selection = window.getSelection()
  let range = selection.getRangeAt(0)
  range.deleteContents()
  let node = document.createTextNode(text)
  range.insertNode(node)
  range.setStartAfter(node)
  range.setEndAfter(node)
  selection.removeAllRanges()
  selection.addRange(range)
}

function copyToClipboard(id) {
  var textEl = $(id)

  // select all the text on the contenteditable div textEl to show it was copied
  let selection = window.getSelection()
  let range = document.createRange()
  range.selectNodeContents(textEl[0])
  selection.removeAllRanges()
  selection.addRange(range)

  if (!navigator.clipboard) {
    console.error('Clipboard API not supported');
    return;
  }
  navigator.clipboard.writeText(textEl.html())
    .then(() => {
      console.log('Text copied to clipboard')
    })
    .catch((err) => {
      console.error('Failed to copy text: ', err)
    })
}


// const newPosition = toolbar.getBoundingClientRect().top
// 	toolbar.classList.add('down')


function getVisibleHeight() {
  var pixelRatio = window.devicePixelRatio || 1
  var viewportHeight = window.visualViewport.height * pixelRatio
  var windowHeight = window.innerHeight * pixelRatio
  var keyboardHeight = viewportHeight - windowHeight
  // $('#tung').html(`viewport ${viewportHeight}px | window ${windowHeight}px | keyboard ${keyboardHeight}px`)
  
  return Math.abs(keyboardHeight) / pixelRatio || 0
}



var out = 400;
function loop(timestamp) {
  var delta = timestamp - lastRender
  time += delta

  let height = getVisibleHeight()

  // use the bottom of the #tung element position to use for the body top
  // to be able to toggle the top of the page
  let top = $('#tung').outerHeight(true) //+ $('#links').outerHeight(true) // + $('#home').outerHeight(true)

  if (topToggle)
    top *= 0

  // lerp out to top
  if (time > 100) {
    out = lerp(out, top, 0.01 * delta)
  }
  

  // 'bottom': height + 'px',
  // $('body').css({
  //   'top': -out + 'px'
  // })




  // $('#keyboard').css({
  //   'bottom': height + 'px',
  // })


  // check if need to backup the text
  let text = $('#text').html()
  if (text != lastText) {
    localStorage.setItem('text', text)
    lastText = text
  }



	lastRender = timestamp
	window.requestAnimationFrame(loop)
}
var lastText = ''
var lastRender = 0
var time = 0
window.requestAnimationFrame(loop)





let ua = navigator.userAgent.toLowerCase()
let safari = ua.indexOf('safari') != -1 && !(ua.indexOf('chrome') > -1)

// dev toggle override
// safari = !safari

$('html').css('--bg', safari ? '214, 216, 221' : '16, 16, 16')
$('html').css('--fg', safari ? '214, 216, 221' : '240, 240, 240')
$('html').css('--key', safari ? '255, 255, 255' : '48, 48, 48')
$('html').css('--key-height', safari ? '40px' : '48px')
$('html').css('--key-radius', safari ? '5px' : '8px')
$('html').css('--txt', safari ? '0, 0, 0' : '255, 255, 255')
$('html').css('--txt-size', safari ? '22px' : '26px')
$('html').css('--field', safari ? '255, 255, 255' : '0, 0, 0')
$('html').css('--gap', safari ? '6px' : '5px')

window.addEventListener("beforeinstallprompt", (e) => {
  console.log('beforeinstallprompt')
  // // Prevent Chrome 67 and earlier from automatically showing the prompt
  // e.preventDefault()
  // // Stash the event so it can be triggered later.
  // deferredPrompt = e
  // // // Update UI to notify the user they can add to home screen
  // // addBtn.style.display = "block"

  // // addBtn.addEventListener("click", (e) => {
  // // 	// hide our user interface that shows our A2HS button
  // // 	addBtn.style.display = "none"
  // // })
  // // Show the prompt
  // deferredPrompt.prompt()
  // // Wait for the user to respond to the prompt
  // deferredPrompt.userChoice.then((choiceResult) => {
  // 	if (choiceResult.outcome === "accepted") {
  // 		console.log("User accepted the A2HS prompt")
  // 	} else {
  // 		console.log("User dismissed the A2HS prompt")
  // 	}
  // 	deferredPrompt = null
  // })
})



function lerp(a, b, n) {
  return (1 - n) * a + n * b
}