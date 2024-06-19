import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

let cached = (global as any).mongoose || { conn: null, promise: null };

export const connectToDatabase = async () => {
   if (cached.conn) return cached.conn;

   if (!MONGODB_URI) throw new Error("MONGODB_URI is missing");

   cached.promise =
      cached.promise ||
      mongoose.connect(MONGODB_URI, {
         dbName: "EventsBIT",
         bufferCommands: false,  
      }).then(() => {
         console.log("Connection successful");
         // Emitting connected event
         mongoose.connection.emit('connected');
      })
      .catch((err) => {
         console.error("Unsuccessful connection:", err.message);
         // Emitting error event
         mongoose.connection.emit('error', err);
      });
      
   cached.conn = await cached.promise;

   return cached.conn;
};
