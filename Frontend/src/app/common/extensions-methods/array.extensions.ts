
declare global {  
    interface Array<T> {  
        sortAsc(field: (field:T)=>any ): T[];  
        sortDesc(field: (field:any)=>any ): T[];  
        distinct<C>(field: (field:T)=>C ): C[];  
        min(field: (field:T)=>number ): number;  
        max(field: (field:T)=>number ): number;  
    }  
}  
Array.prototype.sortAsc = function (field: (field:any)=>any)  {  
    this.sort((first,second)=>{
        if(field(first) > field(second)){
            return 1;
        }
        return -1;
    })
    return this;
}
Array.prototype.sortDesc = function (field: (field:any)=>any)  {  
    this.sort((first,second)=>{
        if(field(first) > field(second)){
            return -1
        }
        return 1;
    })
    return this;
}
Array.prototype.distinct = function<T> (field: (field:any)=>T)  {  
    let fieldArray = this.map(m=> field(m));
    let set = new Set<T>(fieldArray);
    return Array.from(set); 
}
Array.prototype.min = function (field: (field:any)=>number)  {  
    let ret = null;
    for (let i=0;i<this.length;i++){
        if(ret==null || ret > field(this[i])){
            ret=field(this[i]);
        }
    }
    return ret;
}
Array.prototype.max = function (field: (field:any)=>number)  {  
    let ret = null;
    for (let i=0;i<this.length;i++){
        if(ret==null || ret < field(this[i])){
            ret=field(this[i]);
        }
    }
    return ret;
}


export {};