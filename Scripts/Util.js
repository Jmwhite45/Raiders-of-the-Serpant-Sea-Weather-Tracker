export async function RollDie(dice){
    var r = new Roll(dice);
    await r.roll();
    return (r.total);
}

export function RandomChoice(arr) {
const randomIndex = Math.floor(Math.random() * arr.length);
return arr[randomIndex];
}

//makes sure num is between(inclusive) max and min. If no min is given min is 0
export function between(num, max, min=0){
    return Math.min(Math.max(num, min), max);
  }