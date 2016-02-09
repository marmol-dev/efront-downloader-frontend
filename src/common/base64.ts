export default class Base64 {
  static decode(str: string){
    let buffer = new Buffer(str, 'base64');
    return buffer.toString('ascii');
  }

  static encode(str: string){
    let buffer = new Buffer(str);
    return buffer.toString('base64');
  }
}
