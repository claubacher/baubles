var styles = [
  { name: "border-radius",
    class: "bord-rad" },
  {
    name: "box-shadow",
    class: "box-shad"
  },
  {
    name: "transform",
    class: "transform"
  }
]

window.onload = function () {
  addToc()
  addListeners()
  switchStyle()
}

window.onpopstate = function () {
  switchStyle("pop")
}

function addToc() {
  var toc = document.getElementById("toc")
  for (var i = 0, len = styles.length; i < len; i++) {
    var newStyle = styles[i]
    var content = document.createTextNode(newStyle.name)
    var elem = document.createElement("a")
    elem.href = '/nineboxes#/' + newStyle.name
    elem.appendChild(content)
    toc.appendChild(elem)
    elem.addEventListener("click", function () {
      switchStyle("link", this.text)
    })
  }
}

function addListeners() {
  document.getElementById("next")
    .addEventListener("click", function (e) {
      e.preventDefault()
      switchStyle("next")
    })

  document.getElementById("prev")
    .addEventListener("click", function (e) {
      e.preventDefault()
      switchStyle("prev")
    })
}

function switchStyle(sitch, param) {
  var currentIdx = getCurrentStyleIdx()
  switch (sitch) {
    case "pop":
      var boxes = document.getElementsByClassName("boxes")
      var currentStyle = { class: boxes[0].classList[1] }
      var newStyle = styles[currentIdx]
      break
    case "next":
      var currentStyle = styles[currentIdx]
      var newStyle = next(currentIdx, styles)
      updateAddress(newStyle)
      break
    case "prev":
      var currentStyle = styles[currentIdx]
      var newStyle = prev(currentIdx, styles)
      updateAddress(newStyle)
      break
    case "link":
      var currentStyle = styles[currentIdx]
      for (var i = 0, len = styles.length; i < len; i++) {
        if (param === styles[i].name) {
          var newStyle = styles[i]
        }
      }
      updateAddress(newStyle)
      break
    default:
      var currentStyle = styles[0]
      var newStyle = styles[currentIdx]
      break
  }
  updateStyle(currentStyle, newStyle)
}

function updateStyle(currentStyle, newStyle) {
  var boxes = document.getElementsByClassName("boxes")
  boxes[0].classList.remove(currentStyle.class)
  boxes[0].classList.add(newStyle.class)
}

function getCurrentStyleIdx() {
  if (currentLoc() === '#') return 0
  for (var i = 0, len = styles.length; i < len; i++) {
    if (styles[i].name === currentLoc()) {
      return i
    }
  }
}

function currentLoc() {
  var separator = /#\//
  return separator.test(window.location.href) ?
    RegExp.rightContext
    : '#'
}

function next(index, array) {
  return index === array.length - 1 ? array[0] : array[index + 1]
}

function prev(index, array) {
  return index === 0 ? array[array.length - 1] : array[index - 1]
}

function updateAddress(newStyle) {
  window.history.pushState(newStyle, newStyle.name, '/nineboxes#/' + newStyle.name)
}
