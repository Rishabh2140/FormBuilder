// import { pgTable, serial, text, varchar, integer } from "drizzle-orm/pg-core";

// export const jsonForms = pgTable("jsonForms", {
//   id: serial("id").primaryKey(),
//   jsonform: text("jsonform").notNull(),
//   createdBy: varchar("createdBy", { length: 255 }).notNull(),
//   createdAt: varchar("createdAt", { length: 255 }).notNull(),
//   updatedAt: varchar("updatedAt", { length: 255 }),
//   theme: varchar("theme", { length: 100 }).default("light"),
//   enableSignIn:boolean('enabledSignIn').default(false),
// }); 

// export const userResponses = pgTable("userResponses", {
//   id: serial("id").primaryKey(),
//   jsonResponse: text("jsonResponse").notNull(),
//   createdBy: varchar("createdBy", { length: 255 }).default("anonymous"),
//   createdAt: varchar("createdAt", { length: 255 }).notNull(),
//   formId: integer("formId").references(() => jsonForms.id), // foreign key to jsonForms.id
// });


// app/configs/schema.js
import { pgTable, serial, text, varchar, boolean, integer } from "drizzle-orm/pg-core";

export const jsonForms = pgTable("jsonForms", {
  id: serial("id").primaryKey(),
  jsonform: text("jsonform").notNull(),
  createdBy: varchar("createdBy", { length: 255 }).notNull(),
  createdAt: varchar("createdAt", { length: 255 }).notNull(),
  updatedAt: varchar("updatedAt", { length: 255 }),
  theme: varchar("theme", { length: 100 }).default("light"),
});

export const userResponses = pgTable("userResponses", {
  id: serial("id").primaryKey(),
  jsonResponse: text("jsonResponse").notNull(),
  createdBy: varchar("createdBy", { length: 255 }).default("anonymous"),
  createdAt: varchar("createdAt", { length: 255 }).notNull(),
  formId: integer("formId").references(() => jsonForms.id),
});

