"use client";
import { db } from "../src/libs/db";
import { createServer, Model, Response } from "miragejs";
import candidatesData from "./candidates.json";
import jobsData from "./jobs.json";

class MirageServer {
  server = null;
  seededCollections = new Set();

  start() {
    if (this.server) return this.server;

    this.server = createServer({
      environment: "development",
      models: {
        user: Model,
        job: Model,
        note: Model,
        assessment: Model,
        responses: Model,
      },

      seeds(server) {
        candidatesData.map((ele) => {
          server.create("user", {
            username: ele.username,
            email: ele.email,
            isAdmin: ele.isAdmin,
            password: ele.password,
            stage: ele.stage
          })
        })

        jobsData.map((ele) => {
          server.create("job", {
            jobTitle: ele.jobTitle,
            location: ele.location,
            company: ele.company,
            description: ele.description,
            status: ele.status
          })
        })
      },

      routes() {
        this.namespace = "api";
        this.timing = 1500;

        const loadOnceFromIndexedDB = async (schema, collectionName) => {
          if (mirageServer.seededCollections.has(collectionName)) return;

          const restoreData = await db[collectionName].toArray();
          restoreData.forEach((data) => {
            schema[collectionName].create({ ...data, id: String(data.id) });
          });

          mirageServer.seededCollections.add(collectionName);
        };

        this.get("/candidates", async (schema) => {
          return schema.users.all().models.map((m) => m.attrs);
        });

        this.get("/candidates/:id", async (schema, request) => {
          const user = schema.users.find(request.params.id);
          if (user) return user;
          return new Response(404, {}, { errors: ["Candidate not found"] });
        });

        this.patch("/candidates/:id", async (schema, request) => {
          const user = schema.users.find(request.params.id);
          if (!user) {
            return new Response(404, {}, { errors: ["Candidate not found"] });
          }
          const body = JSON.parse(request.requestBody);
          const updated = user.update(body);
          const updatedCount = await db.users.update(Number(request.params.id), { ...updated.attrs });
          console.log(updatedCount);
          if (updatedCount == 0) await db.users.put({ ...updated.attrs, id: Number(request.params.id) })
          return updated;
        });

        this.get("/jobs", async (schema) => {
          await loadOnceFromIndexedDB(schema, "jobs");
          await loadOnceFromIndexedDB(schema, "users");
          await loadOnceFromIndexedDB(schema, "notes");
          await loadOnceFromIndexedDB(schema, "assessments");
          await loadOnceFromIndexedDB(schema, "responses");
          return schema.jobs.all().models.map((m) => m.attrs);
        });

        this.get("/jobs/:id", async (schema, request) => {
          const job = schema.jobs.find(request.params.id);
          if (job) return job;
          return new Response(404, {}, { errors: ["Job not found"] });
        });

        this.patch("/jobs/:id", async (schema, request) => {
          const id = request.params.id;
          const body = JSON.parse(request.requestBody);
          const doc = schema.jobs.find(id);
          if (!doc) return new Response(404, {}, { errors: ["Job not found"] });
          const updated = doc.update(body);
          const numericId = String(id);
          const updateCount = await db.jobs.update(numericId, { ...updated.attrs });
          if (updateCount === 0) await db.jobs.put({ ...updated.attrs, id: numericId });
          return updated;
        });

        this.post("/jobs", async (schema, request) => {
          const body = JSON.parse(request.requestBody);
          const job = schema.jobs.create(body);
          await db.jobs.add(job.attrs);
          return job;
        });

        this.get("/note/:id", async (schema, request) => {
          const notes = schema.notes.where({ by: request.params.id }).models.map((m) => m.attrs);
          if (notes.length > 0) return notes;
          return new Response(201, {}, { errors: ["Notes not found"] });
        });

        this.delete("/note/:id", async (schema, request) => {
          const note = schema.notes.find(request.params.id);
          if (!note) {
            return new Response(404, {}, { errors: ["Note not found"] });
          }

          note.destroy();
          await db.notes.delete(Number(request.params.id));

          return new Response(200, {}, { success: true, message: "Note deleted successfully" });
        });

        this.post("/addnote", async (schema, request) => {
          const body = JSON.parse(request.requestBody);
          const note = schema.notes.create(body);
          await db.notes.add(note.attrs);
          return new Response(200, {}, { success: true });
        });

        this.post("/login", async (schema, request) => {
          const body = JSON.parse(request.requestBody);
          const user = schema.users.findBy({
            username: body.username,
            password: body.password,
          });
          if (!user) {
            return new Response(201, {}, { success: false, message: "Invalid username or password" });
          }
          return new Response(200, {}, { success: true, message: "User Logged In Successfully", data: user });
        });

        this.post("/register", async (schema, request) => {
          await loadOnceFromIndexedDB(schema, "users");
          const body = JSON.parse(request.requestBody);
          if (schema.users.findBy({ email: body.email })) {
            return new Response(409, {}, { error: ["User already exists"] });
          }
          const doc = schema.users.create(body);
          await db.users.add(doc.attrs);
          return doc;
        });

        this.get("/assessment/:id", async (schema, request) => {
          const doc = schema.assessments.where({ for: request.params.id });
          if (doc.models.length > 0) {
            return doc.models.map((d) => d.attrs);
          } else {
            return new Response(201, {}, { success: false, message: "No Assessment found" });
          }
        });

        this.get("/singleAssessment/:id", async (schema, request) => {
          const doc = schema.assessments.find(request.params.id);
          if (doc) {
            return doc;
          } else {
            return new Response(401, {}, { success: false, message: "No Assessment found" });
          }
        });

        this.post("/assessment/:id", async (schema, request) => {
          const body = JSON.parse(request.requestBody);
          const data = { for: request.params.id, body: JSON.stringify(body.defination), time: body.time, compId: request.params.id };
          console.log(data);
          const doc = schema.assessments.create(data);
          await db.assessments.add(doc.attrs);
          return doc;
        });

        this.post("/response/:id", async (schema, request) => {
          const body = JSON.parse(request.requestBody);
          const data = { for: request.params.id, by: body.by, body: JSON.stringify(body.defination), compId: body.compId };
          console.log(data);
          const doc = schema.responses.create(data);
          await db.responses.add(doc.attrs);
          return doc;
        });
        this.get("/response/:id", async (schema, request) => {
          const doc = schema.responses.where({ by: request.params.id }).models.map((m) => m.attrs);
          const data = doc.map((ele) => ele.for)
          if (!doc) {
            return new Response(201, {}, { success: false, message: "The candidate has not attempted any assessments yet" })
          }
          else {
            return new Response(200, {}, { success: true, data: data });
          }
        })
        this.passthrough();
      },
    });

    return this.server;
  }
  stop() {
    if (this.server) {
      this.server.shutdown();
      this.server = null;
      this.seededCollections.clear();
    }
  }
}

export const mirageServer = new MirageServer();
