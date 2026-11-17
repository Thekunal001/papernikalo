import { boards, notices, states, type Notice } from "@/data/notices";
import { formatDate } from "@/lib/format";
import { asOf } from "@/lib/site";

export function isOpen(notice: Notice) {
  return notice.applicationEnd >= asOf;
}

export function getNotice(slug: string) {
  return notices.find((notice) => notice.slug === slug);
}

export function getBoard(slug: string) {
  return boards.find((board) => board.slug === slug);
}

export function getState(slug: string) {
  return states.find((state) => state.slug === slug);
}

export function noticesForBoard(slug: string) {
  return notices.filter((notice) => notice.board === slug);
}

export function noticesForState(slug: string) {
  return notices.filter((notice) => notice.state === slug);
}

export function openNotices() {
  return notices.filter(isOpen);
}

export function closingThisMonth() {
  return openNotices()
    .filter((notice) => notice.applicationEnd <= "2026-11-30")
    .sort((a, b) => a.applicationEnd.localeCompare(b.applicationEnd));
}

export function examSchedule() {
  return notices
    .filter((notice) => notice.examDate)
    .sort((a, b) => (a.examDate ?? "").localeCompare(b.examDate ?? ""));
}

export type NoticeSummary = {
  slug: string;
  title: string;
  organization: string;
  shortOrg: string;
  board: string;
  boardName: string;
  state: string;
  stateName: string;
  qualification: string;
  totalVacancies: number;
  advertisementNo: string;
  applicationEndLabel: string;
  open: boolean;
};

export function toSummary(notice: Notice): NoticeSummary {
  return {
    slug: notice.slug,
    title: notice.title,
    organization: notice.organization,
    shortOrg: notice.shortOrg,
    board: notice.board,
    boardName: getBoard(notice.board)?.name ?? notice.board,
    state: notice.state,
    stateName: getState(notice.state)?.name ?? notice.state,
    qualification: notice.qualification,
    totalVacancies: notice.totalVacancies,
    advertisementNo: notice.advertisementNo,
    applicationEndLabel: formatDate(notice.applicationEnd),
    open: isOpen(notice),
  };
}

export function summaries(list: Notice[] = notices) {
  return list.map(toSummary);
}
