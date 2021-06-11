
declare global {  
    interface String {  
        format(params:string[]):string;
    }  
}  
String.prototype.format = function (params:string[])  {  
    let ret = this;
    if(this != null && params.length>=0){
        for(let i=0;i<params.length;i++){
            ret = ret.replace(`{${i}}`,params[i])
        }
    }
    return ret;}
export {};