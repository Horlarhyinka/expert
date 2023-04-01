import {Response} from "express";

export const sendMissingDependency = (res: Response, dependency?: string) =>{
    const message = !dependency? "invalid entry" : `${dependency} is required`
    return res.status(400).json({message})
}

export const sendDuplicateResource = (res: Response, resource?: string) =>{
  const message = `${!resource? "resource": resource} already exists`
  return res.status(409).json({message})
}
  
export const sendResourceNotFound = (res: Response, resource?: string) => {
  const message = `${resource? resource: ""} not found`
  return res.status(404).json({message})
}

export const sendUnauthenticated = (res: Response) =>{
  return res.status(401).json({message: "unauthenticated"})
}

export const sendServerFailed = (res: Response, action?: string) =>{
  const message = "failed " + `${!action?"":"to " + action}`
  return res.status(501).json({message})
}

export const sendInvalidEntry = (res: Response, field?: string) =>{
  const message = "invalid" + `${!field?" entry": " " + field}`
  return res.status(400).json({message})
}