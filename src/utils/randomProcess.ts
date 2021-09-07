function randomProcess ( target: object, range: number, extractNum: number ) {
  let processed = [];
  let usedNumber = [];
  let num = extractNum;
  while (num) {
    const rand_num = Math.floor(Math.random() * range)+ 1;
    if (usedNumber.find(element => element == rand_num)) {

    } else {
      usedNumber.push(rand_num);
      num--;
    }
  }
  usedNumber.map(element => {
    processed.push(target[element - 1]);
  })
  return processed;
}

export default randomProcess;