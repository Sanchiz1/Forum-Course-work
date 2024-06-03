import { map } from "rxjs";
import { GetAjaxObservable } from "./APIUtils";
import { Report } from "../Types/Report";


export function requestReports(offset: number, next: number, userTimestamp: Date, orderBy: string = "Id", order: string = "ASC") {
    return GetAjaxObservable<Report[]>(`/reports?userTimestamp=${userTimestamp.toISOString()}&take=${next}&skip=${offset}&orderBy=${orderBy}&order=${order}`, "GET", true, {'Content-Type': 'application/json'}, true).pipe(
        map((value) => {
            return value.response.data;
        })
    );
}

export function deleteReportRequest(replyId: number) {
    return GetAjaxObservable<Report[]>(`/reports/${replyId}`, "DELETE", true, {'Content-Type': 'application/json'},true).pipe(
        map(() => {
            return "Reply deleted successfully";
        })
    );
}

export function createReportRequest(postId: number, text: string) {
    return GetAjaxObservable<Report[]>(`/reports`, "POST", true, {'Content-Type': 'application/json'},true, {postId: postId, text: text}).pipe(
        map(() => {
            return "Reply deleted successfully";
        })
    );
}