﻿import { Component, Inject } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";

@Component({
    selector: "question-edit",
    templateUrl: "./question-edit.component.html",
    styleUrls: ["./question-edit.component.css"]
})

export class QuestionEditComponent {
    title: string | undefined;
    question: Question | undefined;
    editMode: boolean | undefined;

    constructor(private activatedRoute: ActivatedRoute,
        private router: Router,
        private http: HttpClient,
        @Inject('BASE_URL') private baseUrl: string
    ) {
        this.question = <Question>{};
        var id = +this.activatedRoute.snapshot.params["id"];
        this.editMode = (this.activatedRoute.snapshot.url[1].path === "edit");

        if (this.editMode) {
            var url = this.baseUrl + "api/question/" + id;
            this.http.get<Question>(url).subscribe(res => {
                this.question = res;
                this.title = "Edit - " + this.question.Text;
            }, error => console.log(error));
        }
        else {
            this.question.QuizId = id;
            this.title = "Create a new Question";
        }
    }

    onSubmit(question: Question) {
        var url = this.baseUrl + "api/question";

        if (this.editMode) {
            this.http.post<Question>(url, question).subscribe(res => {
                console.log("Question with Id=" + res.Id + " was updated.");
                this.router.navigate(["/quiz/edit/" + res.QuizId]);
            }, error => console.log(error));
        }
        else {
            this.http.put<Question>(url, question).subscribe(res => {
                console.log("Question with Id=" + res.Id + " was created.");
                this.router.navigate(["/quiz/edit/" + res.QuizId]);
            }, error => console.log(error));
        }
    }
    onBack(question: Question) {
            this.router.navigate(["/quiz/edit/" + question.QuizId]);
    }
}