import { Component, OnChanges, Input, Inject, SimpleChanges } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";

@Component({
    selector: "answer-list",
    templateUrl: "./answer-list.component.html",
    styleUrls: ["./answer-list.component.css"]
})

export class AnswerListComponent implements OnChanges {
    @Input() question: Question | undefined;
    answers: Answer[];
    title: string | undefined;

    constructor(private http: HttpClient,
        private router: Router,
        @Inject('BASE_URL') private baseUrl: string) {

        this.answers = [];
    }

    ngOnChanges(changes: SimpleChanges) {
        if (typeof changes['question'] !== 'undefined') {
            var change = changes['question'];
            if (!change.isFirstChange()) {
                this.loadData();
            }
        }
    }

    loadData() {
        if (this.question) {
            var url = this.baseUrl + "api/Answer/All/" + this.question.Id;
            this.http.get<Answer[]>(url).subscribe(res => {
                this.answers = res;
            }, error => console.log(error));
        }
        else {
            console.error("AnswerListComponent.loadData: question is not defined");
        }
    }

    onCreate() {
        if (this.question) {
            this.router.navigate(["answer/create/" + this.question.Id]);
        }
        else {
            console.error("AnswerListComponent.onCreate: question is not defiled.")
        }
    }

    onEdit(answer: Answer) {
        this.router.navigate(["answer/edit/" + answer.Id]);
    }

    onDelete(answer: Answer) {
        var url = this.baseUrl + "api/answer/" + answer.Id;
        this.http.delete(url, { responseType: "text" }).subscribe(res => {
            console.log("Answer with Id=" + answer.Id + " has been deleted");
            this.loadData();
        }, error => console.log(error));
    }
}