

export default () =>{
    process.on("uncaughtException", (ex)=>{
    console.log("error: uncaught exception ", ex)
    shutDown()
})
process.on("unhandledRejection", (ex)=>{
    console.log("error: unhandled rejection ", ex)
    shutDown()
})}

function shutDown(){
    console.log("exiting............")
    return process.exit(1)
}