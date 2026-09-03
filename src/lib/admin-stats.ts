import "server-only";
import { getHomeWorking, getHomePublished, getRevisions, getAuditLog } from "@/lib/cms";
import type { AuditEntry, Revision } from "./types";

export type CmsOverview = {
  draftsDiff: boolean;
  lastPublishedAt: string | null;
  revisions: Revision[];
};

export async function cmsOverview(): Promise<CmsOverview> {
  const working = await getHomeWorking();
  const published = await getHomePublished();
  const draftsDiff = JSON.stringify(working) !== JSON.stringify(published);
  return {
    draftsDiff,
    lastPublishedAt: published.updatedAt,
    revisions: await getRevisions("home", "home"),
  };
}

export async function cmsAuditRecent(): Promise<AuditEntry[]> {
  return getAuditLog();
}
