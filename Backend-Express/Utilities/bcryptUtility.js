const bcrypt = require('bcrypt')

const hashpassword = async(plain_password) =>{
    const saltRounds = 10;
    const extrasalt = await bcrypt.genSalt(10)
    const finalhashedpassword = await bcrypt.hash(plain_password, extrasalt)
    return finalhashedpassword 
}

const verifyPassword = async (pwFromUser, pwFromDb)=>{
    try{
        const isMatch = await bcrypt.compare(pwFromUser, pwFromDb)
        return isMatch
    }catch(ex){
        console.error("unable to compare passwords")
    }
    
}

module.exports = [hashpassword, verifyPassword]


