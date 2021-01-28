
//instance of a product
export interface ProductModel {
    Title: string;
    Body: string;
    imgUrl: string;
    price: string;
    cat: string;
    count: string;
    Createdate: Date;
}


export interface ProductViewModel {
    id:string;
    Id:string;
    Title: string;
    Body: string;
    imgUrl: string;
    price: string;
    cat: string;
    count: string;    
    Createdate: Date;
}

//instance of a category of product
export interface CategoryModel {
    Title: string;
    Id: number;
    Description: string;
}

//carrying out search items
export class searchModel {
    id: string = "";// id of product
    cat: number = -1;// category of product {1:laptop, 2: phone, 3: headphones}
    sortBy: number = -1;// id of filters that are sorting items to show
    productTitle:string="";// for searching by title in searchbar
    }

    //all status about order
    export enum status {received, accepted, processing, sent, delivered, canceled};

    export class orderModel { 
        id:string="";
        price: string="";       
        items:ProductViewModel[]=[];
        description: string="";
        status:status=status.received;//we set received by default at initial
    }


    export class orderViewModel {               
        price: string="";       
        products:string="";
        description: string="";
        status:string="";
        View:string[][]=[];        
    }


    export class basketModel {                                         
        items:ProductViewModel[]=[];               
    }


    export class loginModel {                                  
        email:string;
        password:string;               
    }
    
    export class UserProfileModel {        
        email:string;                     
        name: string;
        lastName:string;        
        birthDay:Date;
        address:string;
        postalCode: string;
        originalName:string;
        createDate:Date=new Date();
    }


    export class User {
        constructor(
          public email: string,
          public id: string,
          private _token: string,
          private _tokenExpirationDate: Date
        ) {}
      
        get token() {
          if (!this._tokenExpirationDate || new Date() > this._tokenExpirationDate) {
            return null;
          }
          return this._token;
        }
      }
      

 
