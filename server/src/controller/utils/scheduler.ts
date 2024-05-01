import userModel, { User } from "../../models/user";


class Scheduler{
    scheduleEvent(user:User): void {
        setTimeout(() => {
            if(!user.isVerified){
                console.log("Deleting user due to in active verification😜")
                this.deleteUser(user)
            }
        },1*60*1000) // 1min
    }
    async updateUser(user: any,otpCode: string){
        try {
            console.log(user.isVerified)
            if(user.isVerified){
                return {code: 400,success: false, message: "user is already verified👀"}
            }
            if(otpCode === "123456"){
                await userModel.findByIdAndUpdate(user.id,{
                    isVerified: true
                })
                return {code: 200, success: true, message: "User verification success✔"}
            }else{
                return {code: 400,success: false, message: "Invalid otp😁"}
            }
        } catch (error) {
            throw error
        }
    }
    private  deleteUser(user: User) {
        userModel.findByIdAndDelete(user._id)
            .then(() => console.log(`User record deleted ${user.email}`))
            .catch((error) => console.error(`Error deleting account: ${error}`))
    }
}

export default new Scheduler();