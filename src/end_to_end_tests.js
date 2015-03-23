/* https://github.com/angular/protractor/blob/master/docs/toc.md */

describe('Chess', function() {

  'use strict';
  
  beforeEach(function() {
    browser.get('http://localhost:9000/game.min.html');
  });


  function getDiv(row, col) {
    return element(by.id('e2e_test_div_' + row + 'x' + col));
  }

  function getPiece(row, col, pieceKind) {
    return element(by.id('e2e_test_img_' + pieceKind + '_' + row + 'x' + col));
  }

  function expectPiece(row, col, pieceKind) {
    // Careful when using animations and asserting isDisplayed:
    // Originally, my animation started from {opacity: 0;}
    // And then the image wasn't displayed.
    // I changed it to start from {opacity: 0.1;}
    expect(getPiece(row, col, 'WK').isDisplayed()).toEqual(pieceKind === "WK" ? true : false);
    expect(getPiece(row, col, 'WQ').isDisplayed()).toEqual(pieceKind === "WQ" ? true : false);
    expect(getPiece(row, col, 'WR').isDisplayed()).toEqual(pieceKind === "WR" ? true : false);
    expect(getPiece(row, col, 'WB').isDisplayed()).toEqual(pieceKind === "WB" ? true : false);
    expect(getPiece(row, col, 'WN').isDisplayed()).toEqual(pieceKind === "WN" ? true : false);
    expect(getPiece(row, col, 'WP').isDisplayed()).toEqual(pieceKind === "WP" ? true : false);
    expect(getPiece(row, col, 'BK').isDisplayed()).toEqual(pieceKind === "BK" ? true : false);
    expect(getPiece(row, col, 'BQ').isDisplayed()).toEqual(pieceKind === "BQ" ? true : false);
    expect(getPiece(row, col, 'BR').isDisplayed()).toEqual(pieceKind === "BR" ? true : false);
    expect(getPiece(row, col, 'BB').isDisplayed()).toEqual(pieceKind === "BB" ? true : false);
    expect(getPiece(row, col, 'BN').isDisplayed()).toEqual(pieceKind === "BN" ? true : false);
    expect(getPiece(row, col, 'BP').isDisplayed()).toEqual(pieceKind === "BP" ? true : false);
  }

  function expectBoard(board) {
    for (var row = 0; row < 8; row++) {
      for (var col = 0; col < 8; col++) {
        expectPiece(row, col, board[row][col]);
      }
    }
  }

  function clickDivsAndExpectPiece(deltaFrom, deltaTo, pieceKind) {
    getDiv(deltaFrom.row, deltaFrom.col).click();
    getDiv(deltaTo.row, deltaTo.col).click();

    expectPiece(deltaTo.row, deltaTo.col, pieceKind);
  }

  // playMode is either: 'passAndPlay', 'playAgainstTheComputer', 'onlyAIs',
  // or a number representing the playerIndex (-2 for viewer, 0 for white player, 1 for black player, etc)
  function setMatchState(matchState, playMode) {
    browser.executeScript(function(matchStateInJson, playMode) {
      var stateService = window.e2e_test_stateService;
      stateService.setMatchState(angular.fromJson(matchStateInJson));
      stateService.setPlayMode(angular.fromJson(playMode));
      angular.element(document).scope().$apply(); // to tell angular that things changes.
    }, JSON.stringify(matchState), JSON.stringify(playMode));
  }

  it('should have a title', function () {
    expect(browser.getTitle()).toEqual('Chess');
  });

  it('should have an empty Chess board', function () {
    expectBoard(
      ['BR', 'BN', 'BB', 'BQ', 'BK', 'BB', 'BN', 'BR'], 
      ['BP', 'BP', 'BP', 'BP', 'BP', 'BP', 'BP', 'BP'], 
      ['', '', '', '', '', '', '', ''],  
      ['', '', '', '', '', '', '', ''], 
      ['', '', '', '', '', '', '', ''],  
      ['', '', '', '', '', '', '', ''], 
      ['WP', 'WP', 'WP', 'WP', 'WP', 'WP', 'WP', 'WP'],
      ['WR', 'WN', 'WB', 'WQ', 'WK', 'WB', 'WN', 'WR']);
  });

  it('should show WP in 5x5 if I move it from 6x5', function () {
    var deltaFrom = {row: 6, col: 5};
    var deltaTo = {row: 5, col: 5};

    clickDivsAndExpectPiece(deltaFrom, deltaTo, "WP");
    expectBoard(
      ['BR', 'BN', 'BB', 'BQ', 'BK', 'BB', 'BN', 'BR'], 
      ['BP', 'BP', 'BP', 'BP', 'BP', 'BP', 'BP', 'BP'], 
      ['', '', '', '', '', '', '', ''],  
      ['', '', '', '', '', '', '', ''], 
      ['', '', '', '', '', '', '', ''],  
      ['', '', '', '', '', 'WP', '', ''], 
      ['WP', 'WP', 'WP', 'WP', 'WP', '', 'WP', 'WP'],
      ['WR', 'WN', 'WB', 'WQ', 'WK', 'WB', 'WN', 'WR']);
  });

  it('should ignore clicking on a non-empty cell', function () {
    clickDivsAndExpectPiece(0, 0, "X");
    clickDivsAndExpectPiece(0, 0, "X"); // clicking on a non-empty cell doesn't do anything.
    clickDivsAndExpectPiece(1, 1, "O");
    expectBoard(
        [['X', '', ''],
         ['', 'O', ''],
         ['', '', '']]);
  });

  it('should end game if X wins', function () {
    for (var col = 0; col < 3; col++) {
      clickDivsAndExpectPiece(1, col, "X");
      // After the game ends, player "O" click (in cell 2x2) will be ignored.
      clickDivsAndExpectPiece(2, col, col === 2 ? "" : "O");
    }
    expectBoard(
        [['', '', ''],
         ['X', 'X', 'X'],
         ['O', 'O', '']]);
  });

  it('should end the game in tie', function () {
    clickDivsAndExpectPiece(0, 0, "X");
    clickDivsAndExpectPiece(1, 0, "O");
    clickDivsAndExpectPiece(0, 1, "X");
    clickDivsAndExpectPiece(1, 1, "O");
    clickDivsAndExpectPiece(1, 2, "X");
    clickDivsAndExpectPiece(0, 2, "O");
    clickDivsAndExpectPiece(2, 0, "X");
    clickDivsAndExpectPiece(2, 1, "O");
    clickDivsAndExpectPiece(2, 2, "X");
    expectBoard(
        [['X', 'X', 'O'],
         ['O', 'O', 'X'],
         ['X', 'O', 'X']]);
  });

  var delta1 = {row: 1, col: 0};
  var board1 =
      [['X', 'O', ''],
       ['X', '', ''],
       ['', '', '']];
  var delta2 = {row: 1, col: 1};
  var board2 =
      [['X', 'O', ''],
       ['X', 'O', ''],
       ['', '', '']];
  var delta3 = {row: 2, col: 0};
  var board3 =
      [['X', 'O', ''],
       ['X', 'O', ''],
       ['X', '', '']];
  var delta4 = {row: 2, col: 1};
  var board4 =
      [['X', 'O', ''],
       ['X', 'O', ''],
       ['', 'X', '']];

  var matchState2 = {
    turnIndexBeforeMove: 1,
    turnIndex: 0,
    endMatchScores: null,
    lastMove: [{setTurn: {turnIndex: 0}},
          {set: {key: 'board', value: board2}},
          {set: {key: 'delta', value: delta2}}],
    lastState: {board: board1, delta: delta1},
    currentState: {board: board2, delta: delta2},
    lastVisibleTo: {},
    currentVisibleTo: {},
  };
  var matchState3 = {
    turnIndexBeforeMove: 0,
    turnIndex: -2,
    endMatchScores: [1, 0],
    lastMove: [{endMatch: {endMatchScores: [1, 0]}},
         {set: {key: 'board', value: board3}},
         {set: {key: 'delta', value: delta3}}],
    lastState: {board: board2, delta: delta2},
    currentState: {board: board3, delta: delta3},
    lastVisibleTo: {},
    currentVisibleTo: {},
  };
  var matchState4 = {
    turnIndexBeforeMove: 0,
    turnIndex: 1,
    endMatchScores: null,
    lastMove: [{setTurn: {turnIndex: 1}},
         {set: {key: 'board', value: board4}},
         {set: {key: 'delta', value: delta4}}],
    lastState: {board: board2, delta: delta2},
    currentState: {board: board4, delta: delta4},
    lastVisibleTo: {},
    currentVisibleTo: {},
  };

  it('can start from a match that is about to end, and win', function () {
    setMatchState(matchState2, 'passAndPlay');
    expectBoard(board2);
    clickDivsAndExpectPiece(2, 0, "X"); // winning click!
    clickDivsAndExpectPiece(2, 1, ""); // can't click after game ended
    expectBoard(board3);
  });

  it('cannot play if it is not your turn', function () {
    // Now make sure that if you're playing "O" (your player index is 1) then
    // you can't do the winning click!
    setMatchState(matchState2, 1); // playMode=1 means that yourPlayerIndex=1.
    expectBoard(board2);
    clickDivsAndExpectPiece(2, 0, ""); // can't do the winning click!
    expectBoard(board2);
  });

  it('can start from a match that ended', function () {
    setMatchState(matchState3, 'passAndPlay');
    expectBoard(board3);
    clickDivsAndExpectPiece(2, 1, ""); // can't click after game ended
  });

  it('should make an AI move after at most 1.5 seconds', function () {
    setMatchState(matchState4, 'playAgainstTheComputer');
    browser.sleep(1500);
    expectBoard(
        [['X', 'O', ''],
         ['X', 'O', ''],
         ['O', 'X', '']]);
    clickDivsAndExpectPiece(2, 2, "X"); // Human-player X did a very stupid move!
    browser.sleep(1500); // AI will now make the winning move
    expectBoard(
        [['X', 'O', 'O'],
         ['X', 'O', ''],
         ['O', 'X', 'X']]);
    clickDivsAndExpectPiece(1, 2, ""); // Can't make a move after game is over
  });
});