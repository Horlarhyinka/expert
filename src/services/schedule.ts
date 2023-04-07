import cron from "node-cron";
import User from "../models/user";
import { user_int, collection_int } from "../models/types";
import Mailer from "./mail";

export default () =>{

cron.schedule("* 21 * * 5", async()=>{
    const users = await User.find().populate("collections")
    await Promise.all(users.map(async(user: user_int) =>{
        const {email} = user;
        const collectionViews = user.collections.map((col) =>{
            const viewsCount = (col as collection_int).views.length
            return viewsCount > 0 && {title: (col as collection_int).title, count: viewsCount}
            })
        if(collectionViews.length > 0){
         const mailer = new Mailer(email)
         await mailer.sendUserFeedBack(collectionViews as ({title: string, count: number})[])
        }
    }))
})

}