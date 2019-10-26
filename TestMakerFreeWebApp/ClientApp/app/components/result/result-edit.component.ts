import { Component, Inject } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";

@Component({
    selector: "result-edit",
    templateUrl: "./result-edit.component.html",
    styleUrls: ["./result-edit.component.css"]
})

export class ResultEditComponent {
    title: string | undefined;
    result: Result | undefined;
    editMode: boolean | undefined;

    constructor(private activatedRoute: ActivatedRoute,
        private router: Router,
        private http: HttpClient,
        @Inject('BASE_URL') private baseUrl: string
    ) {
        this.result = <Result>{};
        var id = +this.activatedRoute.snapshot.params["id"];
        this.editMode = (this.activatedRoute.snapshot.url[1].path === "edit");

        if (this.editMode) {
            var url = this.baseUrl + "api/result/" + id;
            this.http.get<Result>(url).subscribe(res => {
                this.result = res;
                this.title = "Edit - " + this.result.Text;
            }, error => console.log(error));
        }
        else {
            this.result.QuizId = id;
            this.title = "Create a new Result";
        }
    }

    onSubmit(result: Result) {
        var url = this.baseUrl + "api/result";

        if (this.editMode) {
            this.http.post<Result>(url, result).subscribe(res => {
                console.log("Result with Id=" + res.Id + " was updated.");
                this.router.navigate(["/quiz/edit/" + res.QuizId]);
            }, error => console.log(error));
        }
        else {
            this.http.put<Result>(url, result).subscribe(res => {
                console.log("Result with Id=" + res.Id + " was created.");
                this.router.navigate(["/quiz/edit/" + res.QuizId]);
            }, error => console.log(error));
        }
    }
    onBack(result: Result) {
            this.router.navigate(["/quiz/edit/" + result.QuizId]);
    }
}