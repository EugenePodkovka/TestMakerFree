import { Component, Inject } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";

@Component({
    selector: "answer-edit",
    templateUrl: "./answer-edit.component.html",
    styleUrls: ["./answer-edit.component.css"]
})

export class AnswerEditComponent {
    title: string | undefined;
    answer: Answer | undefined;
    editMode: boolean | undefined;

    constructor(private activatedRoute: ActivatedRoute,
        private router: Router,
        private http: HttpClient,
        @Inject('BASE_URL') private baseUrl: string
    ) {
        this.answer = <Answer>{};
        var id = +this.activatedRoute.snapshot.params["id"];
        this.editMode = (this.activatedRoute.snapshot.url[1].path === "edit");

        if (this.editMode) {
            var url = this.baseUrl + "api/answer/" + id;
            this.http.get<Answer>(url).subscribe(res => {
                this.answer = res;
                this.title = "Edit - " + this.answer.Text;
            }, error => console.log(error));
        }
        else {
            this.answer.QuestionId = id;
            this.title = "Create a new Answer";
        }
    }

    onSubmit(answer: Answer) {
        var url = this.baseUrl + "api/answer";

        if (this.editMode) {
            this.http.post<Answer>(url, answer).subscribe(res => {
                console.log("Answer with Id=" + res.Id + " was updated.");
                this.router.navigate(["/question/edit/" + res.QuestionId]);
            }, error => console.log(error));
        }
        else {
            this.http.put<Answer>(url, answer).subscribe(res => {
                console.log("Answer with Id=" + res.Id + " was created.");
                this.router.navigate(["/question/edit/" + res.QuestionId]);
            }, error => console.log(error));
        }
    }
    onBack(answer: Answer) {
        this.router.navigate(["/question/edit/" + answer.QuestionId]);
    }
}