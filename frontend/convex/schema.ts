import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  analyses: defineTable({
    analysisId: v.string(),
    patientId: v.string(),
    patientAge: v.optional(v.number()),
    patientGender: v.optional(v.string()),
    eye: v.string(),
    imageName: v.optional(v.string()),
    imageUrl: v.string(),
    gradcamUrl: v.string(),
    overlayUrl: v.string(),
    predictionGrade: v.number(),
    predictionLabel: v.string(),
    confidence: v.float64(),
    probabilityDistribution: v.array(
      v.object({
        grade: v.number(),
        name: v.string(),
        probability: v.float64(),
        color: v.string(),
      })
    ),
    findings: v.array(
      v.object({
        id: v.string(),
        name: v.string(),
        detected: v.boolean(),
        confidence: v.float64(),
        location: v.string(),
        description: v.string(),
      })
    ),
    recommendations: v.array(v.string()),
    inferenceTimeMs: v.number(),
    modelName: v.string(),
    modelVersion: v.string(),
    timestamp: v.string(),
    status: v.string(),
    reviewedByDoctor: v.boolean(),
    doctorNotes: v.optional(v.string()),
  }).index("by_timestamp", ["timestamp"]),
});
