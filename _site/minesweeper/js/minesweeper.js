var board = {
  tiles: [],
  size: 64,
  solved: false,
  appendMsg: function(msg, type) {
    $('.msg').remove()
    var elem = '<div class="msg ' + type + '">' + msg + '</div>'
    $('.board').after(elem)
  }
}

function Tile(id) {
  this.id = id
  this.x  = this.id % 8
  this.y  = Math.floor(this.id / 8)
  this.elem = '#' + this.id
  this.bomb = false
  this.revealed = false
}

function makeTiles() {
  for (var i = 0; i < board.size; i++) {
    board.tiles.push(new Tile(i))
  }
}

function placeBombs() {
  var bombIds = randIds(board.size)
  bombIds.forEach(function(tileId) {
    board.tiles[tileId].bomb = true
  })
}

function randIds(max) {
  var ids = []
  while (ids.length < 10) {
    var n = Math.floor(Math.random() * max)
    if (ids.indexOf(n) === -1) {
      ids.push(n)
    }
  }
  return ids
}

Tile.prototype.surroundingTiles = function() {
  var neighborIds = surroundingIds(this.x, this.y)
  var tiles = []
  neighborIds.forEach(function(id) {
    if (id !== undefined) {
      tiles.push(board.tiles[id])
    }
  })
  return tiles
}

function surroundingIds(x,y) {
  return [coordsToIdx(x - 1, y - 1),
          coordsToIdx(x    , y - 1),
          coordsToIdx(x + 1, y - 1),
          coordsToIdx(x - 1, y    ),
          coordsToIdx(x + 1, y    ),
          coordsToIdx(x - 1, y + 1),
          coordsToIdx(x    , y + 1),
          coordsToIdx(x + 1, y + 1)]
}

function coordsToIdx(x, y) {
  if (x >= 0 && x < 8 && y >= 0 && y < 8) {
    return x + (8 * y)
  }
}

Tile.prototype.surroundingBombs = function() {
  var numBombs = 0
  var neighbors = this.surroundingTiles()
  neighbors.forEach(function(neighbor) {
    if (neighbor.bomb === true) {
      numBombs += 1
    }
  })
  return numBombs
}

Tile.prototype.guessTile = function() {
  this.revealed = true

  if (this.bomb === true) {
    $(this.elem).text("BOOM!")
    gameOver("You stepped on a mine. Game over.")
  } else if (this.surroundingBombs() === 0) {
    $(this.elem).text("0")
    var neighbors = this.surroundingTiles()
    for (var i = 0, len = neighbors.length; i < len; i++) {
      if (neighbors[i].revealed === false) neighbors[i].guessTile()
    }
  } else {
    $(this.elem).text(this.surroundingBombs())
  }
}

function gameOver(msg) {
  board.appendMsg(msg, "lose")
  $('.tile').unbind('click')
  $('#validate-btn').unbind('click')
  $('#cheat-btn').unbind('click')
}

function setIds() {
  $('.tile').each(function(idx) {
    $(this).attr("id", idx)
  })
}

function setUpBoard() {
  makeTiles()
  placeBombs()

  $('.tile').on('click', function() {
    var id = $(this).attr("id")
    var tile = board.tiles[id]
    tile.guessTile()
  })
  $('#validate-btn').on('click', function() {
    validateBoard()
  })
  $('#cheat-btn').on('click', function() {
    cheat()
  })
}

function clearBoard() {
  board.solved = false
  board.tiles = []
  $('.tile').each(function() {
    $(this).text("")
  })
  $('.msg').remove()
}

function validateBoard() {
  var unrevealedTiles = board.tiles.filter(function(tile) {
    return !tile.revealed
  })
  var bombTiles = unrevealedTiles.filter(function(tile) {
    return tile.bomb
  })

  if (unrevealedTiles.length === bombTiles.length) {
    board.appendMsg("You win!", "win")
  } else {
    gameOver("You missed a few... Game over.")
  }
}

function cheat() {
  $('.tile').each(function() {
    var tile = board.tiles[$(this).attr("id")]
    if (tile.bomb === true) {
      $(this).text("BOMB!")
    } else {
      $(this).text(tile.surroundingBombs())
    }
  })

  board.appendMsg("You've got 3 seconds...", "warning")

  setTimeout(function () {
    board.appendMsg("You've got 2 seconds...", "warning")
  }, 1000)

  setTimeout(function () {
    board.appendMsg("You've got 1 second...", "warning")
  }, 2000)

  setTimeout(function () {
    board.tiles.forEach(function(tile) {
      if (tile.revealed !== true) {
        $(tile.elem).text("")
      }
    })
    $('.warning').remove()
  }, 3000)
}

$(document).ready(function() {
  setIds()
  setUpBoard()
  $('#new-game-btn').on('click', function() {
    clearBoard()
    setUpBoard()
  })
})
