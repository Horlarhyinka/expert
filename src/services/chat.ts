import {Server} from "socket.io";
import {Server as server} from "http";
import * as cache from "./cache";
import { v4 as uuid} from "uuid";

type message_arg = {target: string, body: string}
type msg_obj = {body: string, at: Date, me?: boolean}

export default (server: server) =>{
    const users: {[key: string]: {
        id: string,
        rooms: (string)[]
    }} = {};
    let io = new Server(server)
    const ns = io.of("/")
    const rooms = []
    ns.on("connection", (socket)=>{
        
        socket.on("login", async(args: {user: string})=>{
            if(!users[args.user]){
                users[args.user] = {
                        id: socket.id,
                        rooms: []
                    }
                await cache.setCache(args.user, [])
                console.log("user logged in")
            }
            users[args.user].id = socket.id
        })
        socket.on("message",async(args: {target: string, body: string})=>{
            const {target, body} = args
            if(!target || !body)return;
            if(!users[target]){
                const msgObj = {body, at: new Date(), me: true}
                const prevMsg = await cache.getCache(target) as (msg_obj)[] | null;
                if(!prevMsg){
                    await cache.setCache(target, [msgObj])
                }else{
                await cache.setCache(target, [...prevMsg!, msgObj])
                }
                return socket.broadcast.to(target).emit("message", body);
            }
            const user = users[target]
            //add user and sender to a room
            const set: Set<string> = new Set();
            set.add(user.id)
            set.add(socket.id)
            const roomID = uuid();
            console.log(roomID);
            ns.adapter.rooms.set(roomID, set);
            //push roomID to user's rooms array
            user.rooms.push(roomID);
            const userRooms = await cache.getCache(target) as string[] | null
            if(!userRooms){
                await cache.setCache(target, [roomID])
            }else{
                await cache.setCache(target, [...userRooms!, roomID])
            }
            const prevMsg = await cache.getCache(roomID) as msg_obj[] | null
            if(!prevMsg){
                await cache.setCache(roomID, [{body, at: new Date(), me: false}])
            }else{
                await cache.setCache(roomID, [...prevMsg!, {body, at: new Date(), me: false}])
            }
            //send message to room
            return socket.broadcast.to(roomID).emit("message", body);
        })
    })
}