function randomPick(target: object[], n: number) {
  const shuffled = target.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, n);
}

export default randomPick;
