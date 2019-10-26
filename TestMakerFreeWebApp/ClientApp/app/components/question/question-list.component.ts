import { Component, Inject, Input, SimpleChanges } from "@angular/core";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";

@Component({
    selector: "question-list",
    templateUrl: "./question-list.component.html",
    styleUrls: ["./question-list.component.css"]
})

export class QuestionListComponent {
    @Input() quiz: Quiz | undefined;
    questions: Question[] | undefined;
    title: string | undefined;

    constructor(private http: HttpClient,
        @Inject('BASE_URL') private baseUrl: string,
        private router: Router) {

        this.questions = [];
    }

    ngOnChanges(changes: SimpleChanges) {
        if (typeof changes['quiz'] !== 'undefined') {
            var change = changes['quiz'];
            if (!change.isFirstChange()) {
                this.loadData();
            }
        }
    }

    loadData() {
        if (this.quiz) {
            var url = this.baseUrl + "api/question/All/" + this.quiz.Id;
            this.http.get<Question[]>(url).subscribe(res => {
                this.questions = res;
            }, error => console.log(error));
        }
        else {
            console.error("QuestionListComponent.loadData: Quiz was not defined");
        }
    }

    onCreate() {
        if (this.quiz) {
            this.router.navigate(["/question/create", this.quiz.Id])
        }
        else {
            console.error("QuestionListComponent.onCreate: Quiz was not defined");
        }
    }

    onEdit(question: Question) {
        this.router.navigate(["/question/edit", question.Id])
    }


    onDelete(question: Question) {
        if (confirm("Do you want to delete this question?")) {
            var url = this.baseUrl + "api/question/" + question.Id;
            this.http.delete(url, { responseType: 'text' }).subscribe(res => {
                console.log("Question with Id=" + question.Id + " has been deleted.");
                this.loadData();
            }, error => console.log(error));
        }
    }
}