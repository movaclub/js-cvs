// js entry point

function procFile(file) {
  if( !file ) return;
  const srcCSV = [];
  const reader = new FileReader();
  reader.addEventListener('load', (e) => {
    srcCSV.push(e.target.result);
  });
  reader.addEventListener('loadend', (ev => {
    console.log('srcCSV: ', srcCSV);
    let rows = [];
    srcCSV.forEach( el => {
      rows = el.split(/[\r\n]+/);
    });
    const txtSrc = document.querySelector('#txt-src').innerHTML = '<code>' +
      rows.join('<br>') + '</code>';
  }));
  reader.readAsText(file);
}
