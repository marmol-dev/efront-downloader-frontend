export default class Delay {
  static action(time: number, action: Function){
    setTimeout(action, time);
  }
}
