export interface OperationResponse {
  error?: string;
  success?: {
    message: string;
    data?: string;
  }
}

export class OperationError implements OperationResponse {
  constructor(public error: string){

  }
};

export class OperationSuccess implements OperationResponse {
  public success : {
    message: string;
    data?: string;
  };

  constructor(message: string, data?: string){
    this.success.message = message;
    if (data) this.success.data = data;
  }
};
