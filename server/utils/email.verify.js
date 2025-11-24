const verifyName= (name)=>{

    const regex= /^[A-Za-z ]{3,30}$/;
    const valid = regex.test(name);

    return valid;
}