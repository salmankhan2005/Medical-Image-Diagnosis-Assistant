import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

/**
 * List all analyses, ordered by timestamp descending (newest first).
 */
export const list = query({
  args: {},
  handler: async (ctx) => {
    const analyses = await ctx.db
      .query("analyses")
      .withIndex("by_timestamp")
      .order("desc")
      .collect();
    return analyses;
  },
});

/**
 * Get a single analysis by its analysisId field.
 */
export const getById = query({
  args: { analysisId: v.string() },
  handler: async (ctx, args) => {
    const analyses = await ctx.db
      .query("analyses")
      .filter((q) => q.eq(q.field("analysisId"), args.analysisId))
      .first();
    return analyses;
  },
});

/**
 * Create a new analysis record.
 */
export const create = mutation({
  args: {
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
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("analyses", args);
    return id;
  },
});

/**
 * Delete an analysis record by its Convex document _id.
 */
export const remove = mutation({
  args: { id: v.id("analyses") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

/**
 * Delete an analysis record by its analysisId string field.
 */
export const removeByAnalysisId = mutation({
  args: { analysisId: v.string() },
  handler: async (ctx, args) => {
    const record = await ctx.db
      .query("analyses")
      .filter((q) => q.eq(q.field("analysisId"), args.analysisId))
      .first();
    if (record) {
      await ctx.db.delete(record._id);
    }
  },
});

/**
 * Add doctor review notes and sign-off to an analysis.
 */
export const addReview = mutation({
  args: {
    analysisId: v.string(),
    doctorNotes: v.string(),
    reviewedByDoctor: v.boolean(),
  },
  handler: async (ctx, args) => {
    const record = await ctx.db
      .query("analyses")
      .filter((q) => q.eq(q.field("analysisId"), args.analysisId))
      .first();
    if (record) {
      await ctx.db.patch(record._id, {
        doctorNotes: args.doctorNotes,
        reviewedByDoctor: args.reviewedByDoctor,
      });
    }
  },
});
