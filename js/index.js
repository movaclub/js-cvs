// js entry point

function procFile(file) { // read in src csv file and output it
  if (!file) return;
  const srcCSV = [];
  const reader = new FileReader();
  reader.addEventListener('load', (e) => {
    srcCSV.push(e.target.result);
  });
  reader.addEventListener('loadend', (ev => {
    let rows = [];
    srcCSV.forEach(el => {
      rows = el.split(/[\r\n]+/).filter(el => el.length);
    });
    document.querySelector('#txt-src').innerHTML = '<code>' + rows.join('<br>') + '</code>';
    procSCV(rows);
  }));
  reader.readAsText(file);
}

function procSCV(rows) { // process csv data, locate zeros, interpolate them, output result set
  let matrix = []; // source set
  let interpolated = []; // resulting set
  rows.forEach(row => {
    matrix.push(row.split(',').map(el => parseInt(el)))
  });
  for (let r = 0; r < matrix.length; r++) {
    for (let c = 0; c < matrix[r].length; c++) {
      if (typeof interpolated[r] === "undefined") {
        interpolated[r] = [];
      }
      if (matrix[r][c] === 0) {
        interpolated[r][c] = ifZero({r: r, c: c}, matrix);
      } else {
        interpolated[r][c] = matrix[r][c];
      }
    }
  }
  const markupStrings = interpolated.map( el => el.join(','));
  document.querySelector('#txt-proc').innerHTML = '<code>' + markupStrings.join('<br>') + '</code>';
}

function ifZero(idx, matrix) { // calculate replacement for zero
  const {r, c} = idx;
  // assume we've got all 8 neighbors, let'em be like these
  let ul = 0, ut = 0, ur = 0;
  let sl = 0, sr = 0;
  let bl = 0, bb = 0, br = 0;

  // NB: if a neighbor equals to zero we count it anyway
  ul = (matrix[r - 1] && matrix[r - 1][c - 1]) ? parseInt(matrix[r - 1][c - 1]) : undefined;
  ut = (matrix[r - 1] && matrix[r - 1][c])     ? parseInt(matrix[r - 1][c])     : undefined;
  ur = (matrix[r - 1] && matrix[r - 1][c + 1]) ? parseInt(matrix[r - 1][c + 1]) : undefined;

  bl = (matrix[r + 1] && matrix[r + 1][c - 1]) ? parseInt(matrix[r + 1][c - 1]) : undefined;
  bb = (matrix[r + 1] && matrix[r + 1][c])     ? parseInt(matrix[r + 1][c])     : undefined;
  br = (matrix[r + 1] && matrix[r + 1][c + 1]) ? parseInt(matrix[r + 1][c + 1]) : undefined;

  sl = (matrix[r] && matrix[r][c - 1]) ? parseInt(matrix[r][c - 1]) : undefined;
  sr = (matrix[r] && matrix[r][c + 1]) ? parseInt(matrix[r][c + 1]) : undefined;

  let counter = 0; //  arithmetic mean divisor
  let sum = 0; // arithmetic sum
  [ul, ut, ur, sl, sr, bl, bb, br].forEach((count) => {
    if (count) {
      sum += count;
      counter += 1;
    }
  });
  return Math.round(sum / counter);
}
