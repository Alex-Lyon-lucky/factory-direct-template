(async () => {
  const columnHeaders = Array.from(document.querySelectorAll('.rdg-header-row .rdg-cell'));
  const columnNames = columnHeaders.map(cell => cell.innerText.trim().split('\n')[0]);
  return columnNames;
})()