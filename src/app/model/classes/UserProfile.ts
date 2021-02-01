export class UserProfile {        
    email:string;  // or usename                   
    name: string; // first name
    lastName:string;       
    birthDay:Date; 
    address:string;
    postalCode: string;
    originalName:string;//because the firebase (or url) policy dosnt allow to pass '.' or create table with '.' , we keep the original name for example (my.name@gmail.com will change to my_name)
    createDate:Date=new Date();
}