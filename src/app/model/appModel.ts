
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

    export interface orderModel {        
        Id: number;
        price: string;
        userId:string;
        items:ProductModel[];
        description: string;
        status:number;
    }

    export class basketModel {                                  
        userId:string="";
        items:ProductViewModel[]=[];               
    }

    
    export class UserProfileModel {        
        email:string;
        passWord:string;        
        id: string;                
        name: string;
        lastName:string;        
        birthDay:Date;
        address:string;
        postalCode: string;
    }

 
