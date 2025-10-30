import Dexie from "dexie";

export const db = new Dexie("JobsDB");

db.version(8).stores({
    jobs:"++id,jobtitle,location,description,company,status",
    users:"++id,username,email,password,isAdmin,stage",
    notes:"++id,by,note",
    assessments: "++id,for,body,time,compId",
    responses: "++id,for,by,body,compId",
})

