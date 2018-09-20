module.exports = function solveSudoku(matrix) {

  var solved = [];
  var steps = 0;
  var backtrackingsolved_call = 0;
  var solvedArray = [];

  initSolved(matrix);
  solve();

  function initSolved(matrix) {
      steps = 0;
      var suggest = [1, 2, 3, 4, 5, 6, 7, 8, 9];
      for ( var i=0; i<9; i++) {
          solved[i] = [];
          for ( var j=0; j<9; j++ ) {
              if ( matrix[i][j] ) {
                  solved[i][j] = [matrix[i][j], 'in', []];
              }
              else {
                  solved[i][j] = [0, 'unknown', suggest];
              }
          }
      }
  };

  function solve() {
      var changed = 0;
      do {
          changed = updateSuggests();
          steps++;
          if ( 81 < steps ) {
              break;
          }
      } while (changed);
  };

  function updateSuggests() {
      var changed = 0;
      var buf = arrayDiff(solved[1][3][2], rowContent(1));
      buf = arrayDiff(buf, colContent(3));
      buf = arrayDiff(buf, sectContent(1, 3));
      for ( var i=0; i<9; i++) {
          for ( var j=0; j<9; j++) {
              if ( 'unknown' != solved[i][j][1] ) {
                  continue;
              }

              changed += solveSingle(i, j);
              changed += solveHiddenSingle(i, j);
          }
      }
      return changed;
  };

  function solveSingle(i, j) {
      solved[i][j][2] = arrayDiff(solved[i][j][2], rowContent(i));
      solved[i][j][2] = arrayDiff(solved[i][j][2], colContent(j));
      solved[i][j][2] = arrayDiff(solved[i][j][2], sectContent(i, j));
      if ( 1 == solved[i][j][2].length ) {
          markSolved(i, j, solved[i][j][2][0]);
          solved[i][j][2] = [];
          return 1;
      }
      return 0;
  };

  function solveHiddenSingle(i, j) {
      var less_suggest = lessRowSuggest(i, j);
      var changed = 0;
      if ( 1 == less_suggest.length ) {
          markSolved(i, j, less_suggest[0]);
          changed++;
      }
      var less_suggest = lessColSuggest(i, j);
      if ( 1 == less_suggest.length ) {
          markSolved(i, j, less_suggest[0]);
          changed++;
      }
      var less_suggest = lessSectSuggest(i, j);
      if ( 1 == less_suggest.length ) {
          markSolved(i, j, less_suggest[0]);
          changed++;
      }
      return changed;
  };

  function markSolved(i, j, solve) {
      solved[i][j][0] = solve;
      solved[i][j][1] = 'solved';
  };

  function rowContent(i) {
      var content = [];
      for ( var j=0; j<9; j++ ) {
          if ( 'unknown' != solved[i][j][1] ) {
              content[content.length] = solved[i][j][0];
          }
      }
      return content;
  };

  function colContent(j) {
      var content = [];
      for ( var i=0; i<9; i++ ) {
          if ( 'unknown' != solved[i][j][1] ) {
              content[content.length] = solved[i][j][0];
          }
      }
      return content;
  };

  function sectContent(i, j) {
      var content = [];
      var offset = sectOffset(i, j);
      for ( var k=0; k<3; k++ ) {
          for ( var l=0; l<3; l++ ) {
              if ( 'unknown' != solved[offset.i+k][offset.j+l][1] ) {
                  content[content.length] = solved[offset.i+k][offset.j+l][0];
              }
          }
      }
      return content;
  };

  function lessRowSuggest(i, j) {
      var less_suggest = solved[i][j][2];
      for ( var k=0; k<9; k++ ) {
          if ( k == j || 'unknown' != solved[i][k][1] ) {
              continue;
          }
          less_suggest = arrayDiff(less_suggest, solved[i][k][2]);
      }
      if (less_suggest.length === 1) {
        solved[i][j][2] = [];
      }
      return less_suggest;
  };

  function lessColSuggest(i, j) {
      var less_suggest = solved[i][j][2];
      for ( var k=0; k<9; k++ ) {
          if ( k == i || 'unknown' != solved[k][j][1] ) {
              continue;
          }
          less_suggest = arrayDiff(less_suggest, solved[k][j][2]);
      }
      if (less_suggest.length === 1) {
        solved[i][j][2] = [];
      }
      return less_suggest;
  };

  function lessSectSuggest(i, j) {
      var less_suggest = solved[i][j][2];
      var offset = sectOffset(i, j);
      for ( var k=0; k<3; k++ ) {
          for ( var l=0; l<3; l++ ) {
              if ( ((offset.i+k) == i  && (offset.j+l) == j)|| 'unknown' != solved[offset.i+k][offset.j+l][1] ) {
                  continue;
              }
              less_suggest = arrayDiff(less_suggest, solved[offset.i+k][offset.j+l][2]);
          }
      }
      if (less_suggest.length === 1) {
        solved[i][j][2] = [];
      }
      return less_suggest;
  };

  function arrayDiff (ar1, ar2) {
      var arr_diff = [];
      for ( var i=0; i<ar1.length; i++ ) {
          var is_found = false;
          for ( var j=0; j<ar2.length; j++ ) {
              if ( ar1[i] == ar2[j] ) {
                  is_found = true;
                  break;
              }
          }
          if ( !is_found ) {
              arr_diff[arr_diff.length] = ar1[i];
          }
      }
      return arr_diff;
  };

  function arrayUnique(ar){
      var sorter = {};
      for(var i=0,j=ar.length;i<j;i++){
      sorter[ar[i]] = ar[i];
      }
      ar = [];
      for(var i in sorter){
      ar.push(i);
      }
      return ar;
  };

  function sectOffset(i, j) {
      return {
          j: Math.floor(j/3)*3,
          i: Math.floor(i/3)*3
      };
  };

  function solveHiddenPairs(i, j) {

    solveHiddenPairsRow(i);
    solveHiddenPairsCol(j);

    return;
  }

  function solveHiddenPairsRow(i) {

      for (var j = 0; j < 9; j++) {
        for (var k = j+1; k < 9; k++) {
          if (solved[i][j][2].length !== 2) {
            continue;
          } else if ( JSON.stringify(solved[i][j][2])==JSON.stringify(solved[i][k][2])) {
              // console.log('pairRow: ',(solved[i][k][2]));

              // console.log(newMatrix());
              let newMatrix1 = newMatrix();
              newMatrix1[i][j] = solved[i][j][2][0];
              // solvedArray.push(newMatrix1);
              let newMatrix2 =  newMatrix();
              newMatrix2[i][j] = solved[i][j][2][1];
              solvedArray.push(newMatrix2);
              // console.log(newMatrix2);
              return;
          }
        }
      }
    return 0;
  }

  function solveHiddenPairsCol(j) {

    for (var i = 0; i < 9; i++) {
      for (var g = i+1; g < 9; g++) {
        if (solved[i][j][2].length !== 2) {
          continue;
        } else if ( JSON.stringify(solved[i][j][2])==JSON.stringify(solved[g][j][2])) {
            let newMatrix1 = newMatrix();
            newMatrix1[i][j] = solved[i][j][2][0];
            let newMatrix2 =  newMatrix();
            newMatrix2[i][j] = solved[i][j][2][1];
            solvedArray.push(newMatrix2);
            return;
        }
      }
    }
    return 0;
  }

  function newMatrix() {
    var newMatrix = [];

    for (var i = 0; i < 9; i++) {
      newMatrix[i] = []
      for (var j = 0; j < 9; j++) {
          newMatrix[i][j] = solved[i][j][0];
      }
    }

    return newMatrix;
  }

  function setSolved(matrix) {
    var sudokuIsSolve = true;
    // console.log(solved);
    // console.log();
    for (var i = 0; i < matrix.length; i++) {
      for (var j = 0; j < matrix[i].length; j++) {
        if (!matrix[i][j]) {
          matrix[i][j] = solved[i][j][0];
        }
        if (solved[i][j][0]) {
          sudokuIsSolve = false;
          solveHiddenPairs(i, j);

        }
        // if (solved[i][j][1] !== 'unknown') {
        //   console.log(`solved[ ${i} ][ ${j} ]: `,solved[i][j][0]);
        //
        // } else {
        //
        //   matrix[i][j] = solved[i][j][2].toString();
        //   console.log(`solved[ ${i} ][ ${j} ]: `,solved[i][j][2]);
        // }
      }
      // console.log();
    }
    // console.log('matrix: ',matrix);
    // console.log();
    // console.log('solvedArray: ',solvedArray);
    if (solvedArray.length === 0) {
      return matrix;
    }
    return sudokuIsSolve ? matrix : new solveSudoku(solvedArray.shift());
  }
      return setSolved(matrix);
}
